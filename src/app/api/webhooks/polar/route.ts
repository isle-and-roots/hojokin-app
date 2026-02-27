import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";
import { getPolarWebhookSecret } from "@/lib/polar/config";
import { getPlanKeyByProductId } from "@/lib/plans";
import { trackServerEvent, identifyUser } from "@/lib/posthog/track";
import { EVENTS } from "@/lib/posthog/events";

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
  if (processedEvents.size >= MAX_PROCESSED_EVENTS) {
    const firstEntry = processedEvents.values().next().value;
    if (firstEntry) processedEvents.delete(firstEntry);
  }
  processedEvents.add(eventId);
  return true;
}

/** Polar の recurringInterval ("month"|"year") → DB 値 ("monthly"|"annual") */
function resolveInterval(data: { recurringInterval?: string }): "monthly" | "annual" {
  return data.recurringInterval === "year" ? "annual" : "monthly";
}

export const POST = Webhooks({
  webhookSecret: getPolarWebhookSecret(),

  onSubscriptionCreated: async (payload) => {
    const eventId = `created-${payload.data.id}`;
    if (!markEventProcessed(eventId)) return;

    const supabaseAdmin = getSupabaseAdmin();
    const userId = payload.data.customer.externalId;
    const productId = payload.data.productId;

    if (!userId) {
      console.error("Webhook: externalId (userId) が見つかりません");
      return;
    }

    const planKey = getPlanKeyByProductId(productId);
    if (!planKey) {
      console.error(`Webhook: 不明な productId: ${productId}`);
      return;
    }

    const interval = resolveInterval(payload.data);

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        plan: planKey,
        polar_customer_id: payload.data.customerId,
        polar_subscription_id: payload.data.id,
        subscription_interval: interval,
      })
      .eq("id", userId);

    if (error) {
      console.error("subscription.created DB update error:", error);
    } else {
      trackServerEvent(userId, EVENTS.SUBSCRIPTION_CREATED, {
        plan: planKey,
        product_id: productId,
        billing_interval: interval,
      });
      identifyUser(userId, { plan: planKey });
    }
  },

  onSubscriptionActive: async (payload) => {
    const eventId = `active-${payload.data.id}-${payload.data.modifiedAt?.toISOString() ?? ""}`;
    if (!markEventProcessed(eventId)) return;

    const supabaseAdmin = getSupabaseAdmin();
    const userId = payload.data.customer.externalId;
    const productId = payload.data.productId;

    if (!userId) return;

    const planKey = getPlanKeyByProductId(productId);
    if (!planKey) return;

    const interval = resolveInterval(payload.data);

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        plan: planKey,
        polar_customer_id: payload.data.customerId,
        polar_subscription_id: payload.data.id,
        subscription_interval: interval,
      })
      .eq("id", userId);

    if (error) {
      console.error("subscription.active DB update error:", error);
    }
  },

  onSubscriptionUpdated: async (payload) => {
    const eventId = `updated-${payload.data.id}-${payload.data.modifiedAt?.toISOString() ?? ""}`;
    if (!markEventProcessed(eventId)) return;

    const supabaseAdmin = getSupabaseAdmin();
    const userId = payload.data.customer.externalId;

    if (!userId) return;

    if (payload.data.status === "active" || payload.data.status === "trialing") {
      // プラン変更（例: Starter → Pro）を反映
      const productId = payload.data.productId;
      const planKey = getPlanKeyByProductId(productId);

      if (planKey) {
        const interval = resolveInterval(payload.data);

        const { error } = await supabaseAdmin
          .from("user_profiles")
          .update({
            plan: planKey,
            polar_customer_id: payload.data.customerId,
            polar_subscription_id: payload.data.id,
            subscription_interval: interval,
          })
          .eq("id", userId);

        if (error) {
          console.error("subscription.updated (plan change) DB update error:", error);
        }
      }
    } else {
      // active 以外のステータス（past_due, unpaid 等）は free に戻す
      const { error } = await supabaseAdmin
        .from("user_profiles")
        .update({
          plan: "free",
          polar_subscription_id: null,
        })
        .eq("id", userId);

      if (error) {
        console.error("subscription.updated DB update error:", error);
      }
    }
  },

  onSubscriptionCanceled: async (payload) => {
    const eventId = `canceled-${payload.data.id}`;
    if (!markEventProcessed(eventId)) return;

    const supabaseAdmin = getSupabaseAdmin();
    const userId = payload.data.customer.externalId;

    if (!userId) return;

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        plan: "free",
        polar_subscription_id: null,
      })
      .eq("id", userId);

    if (error) {
      console.error("subscription.canceled DB update error:", error);
    } else {
      trackServerEvent(userId, EVENTS.SUBSCRIPTION_CANCELLED, {
        previous_subscription_id: payload.data.id,
      });
      identifyUser(userId, { plan: "free" });
    }
  },

  onSubscriptionRevoked: async (payload) => {
    const eventId = `revoked-${payload.data.id}`;
    if (!markEventProcessed(eventId)) return;

    const supabaseAdmin = getSupabaseAdmin();
    const userId = payload.data.customer.externalId;

    if (!userId) return;

    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({
        plan: "free",
        polar_subscription_id: null,
      })
      .eq("id", userId);

    if (error) {
      console.error("subscription.revoked DB update error:", error);
    }
  },
});
