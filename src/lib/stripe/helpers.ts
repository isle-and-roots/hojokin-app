import { getStripe, PLANS } from "./config";

export async function createCheckoutSession(
  userId: string,
  email: string,
  planKey: "pro" | "business",
  returnUrl: string
) {
  const plan = PLANS[planKey];
  if (!plan || !plan.priceId) {
    throw new Error(`無効なプラン: ${planKey}`);
  }

  const session = await getStripe().checkout.sessions.create({
    customer_email: email,
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
  });

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
