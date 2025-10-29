import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  // apiVersion: '2023-10-16', // Use the latest stable API version
  typescript:true
});

// Example function to create a payment intent for license payment
export async function createPaymentIntent(clientId: string, accountTypeId: number, amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd', // Adjust currency based on your needs
      payment_method_types: ['card'], // Can add 'us_bank_account' for bank integration
      metadata: {
        clientId,
        accountTypeId,
      },
      description: `License payment for account type ${accountTypeId}`,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// // Example usage in a Next.js API route (e.g., pages/api/payment.ts)
// import { NextApiRequest, NextApiResponse } from 'next';
// import { createPaymentIntent } from '../../lib/stripe'; // Adjust the import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { clientId, accountTypeId, amount } = req.body;
      const paymentIntent = await createPaymentIntent(clientId, accountTypeId, amount);
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}