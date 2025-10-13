"use server";

import { stripe } from "@/lib/stripe";

export async function createPaymentIntent(amount: number, currency = "usd", accountTypeId?: string) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    payment_method_types: ["card"],
    metadata: { accountTypeId },
  });

  return paymentIntent.client_secret;
}