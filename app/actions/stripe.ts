'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createDonationCheckoutSession() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    throw new Error('Server configuration error');
  }

  try {
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '$1 Donation to Anime Art Generator',
              description: 'Thank you for supporting our project!',
            },
            unit_amount: 100, // $1 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}?success=true`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}?canceled=true`,
    });

    if (!session.url) {
      console.error('Stripe session created, but no URL was returned');
      throw new Error('Failed to create checkout session URL');
    }

    console.log('Checkout session created successfully:', session.url);
    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe error: ${error.message}`);
    }
    throw new Error('Failed to create checkout session');
  }
}

