import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }
    const stripe = new Stripe(key);
    const body = await request.text();
    const { items, customerEmail } = JSON.parse(body);

    interface CheckoutItem {
      name: string;
      image: string;
      price: number;
      quantity: number;
    }

    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${request.nextUrl.origin}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
