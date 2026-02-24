import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/config";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Webhook には Service Role Key を使用（RLS バイパス）
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// 簡易冪等性チェック（処理済みイベントIDを保持）
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 1000;

function markEventProcessed(eventId: string): boolean {
  if (processedEvents.has(eventId)) {
    return false; // 既に処理済み
  }
  // メモリ制限: 古いエントリを削除
  if (processedEvents.size >= MAX_PROCESSED_EVENTS) {
    const firstEntry = processedEvents.values().next().value;
    if (firstEntry) processedEvents.delete(firstEntry);
  }
  processedEvents.add(eventId);
  return true; // 新規イベント
}

export async function POST(request: Request) {
  // 環境変数の安全な参照
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // 冪等性チェック: 同じイベントの重複処理を防止
  if (!markEventProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId && plan) {
          const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({
              plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
            })
            .eq("id", userId);

          if (error) {
            console.error("checkout.session.completed DB update error:", error);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (subscription.status === "active") {
          // サブスクリプションがアクティブの場合、プランを維持
        } else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid"
        ) {
          // 解約またはアカウント未払いの場合、free に戻す
          const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({
              plan: "free",
              stripe_subscription_id: null,
            })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error("subscription.updated DB update error:", error);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabaseAdmin
          .from("user_profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("subscription.deleted DB update error:", error);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const attemptCount = invoice.attempt_count;

        console.warn(
          `Payment failed for customer ${customerId}, attempt ${attemptCount}`
        );

        // 3回以上支払い失敗でプランを free に戻す
        if (attemptCount >= 3) {
          const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ plan: "free" })
            .eq("stripe_customer_id", customerId);

          if (error) {
            console.error("invoice.payment_failed DB update error:", error);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
