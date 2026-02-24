import { getStripe } from "./config";
import { PLAN_LIST } from "@/lib/plans";
import type Stripe from "stripe";

export async function createCheckoutSession(
  userId: string,
  email: string,
  planKey: "starter" | "pro" | "business",
  returnUrl: string,
  existingCustomerId?: string
) {
  const plan = PLAN_LIST.find((p) => p.key === planKey);
  if (!plan || !plan.priceId) {
    throw new Error(`無効なプランまたは Price ID 未設定: ${planKey}`);
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
      plan: planKey,
    },
  };

  // 既存顧客の場合は customer を、新規の場合は customer_email を使用
  if (existingCustomerId) {
    sessionParams.customer = existingCustomerId;
  } else {
    sessionParams.customer_email = email;
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);
  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
