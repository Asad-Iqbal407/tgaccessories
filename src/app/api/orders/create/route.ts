import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      return NextResponse.json({ message: 'No session' });
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Find the cart
    const cart = await db.collection('carts').findOne({ sessionId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ message: 'Cart empty or not found' });
    }

    // Create the order
    const order = {
      ...cart,
      _id: undefined, // Let MongoDB generate a new ID for the order
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      status: 'paid', // Assuming this is called after successful payment
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('orders').insertOne(order);

    // Empty the cart
    await db.collection('carts').updateOne(
      { sessionId },
      { 
        $set: { 
          items: [], 
          total: 0, 
          updatedAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ message: 'Order created and cart cleared', orderId: order.orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}