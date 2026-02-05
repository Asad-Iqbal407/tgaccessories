import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      return NextResponse.json({ message: 'No session' });
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Option 1: Delete the cart completely (bucket empty)
    // await db.collection('carts').deleteOne({ sessionId });
    
    // Option 2: Empty the items but keep the session (bucket empty)
    // This is better if we want to reuse the session ID
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

    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}