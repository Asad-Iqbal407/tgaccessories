import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, email, phone, and address are required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    console.log('Saving details for session:', sessionId);
    console.log('Details:', { name, email, phone, address });

    if (!sessionId) {
      console.log('No session ID found');
      return NextResponse.json(
        { error: 'No cart session found' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const result = await db.collection('carts').updateOne(
      { sessionId },
      { 
        $set: { 
          customerDetails: { name, email, phone, address },
          updatedAt: new Date()
        } 
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('No matching cart found for session:', sessionId);
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Customer details saved' });
  } catch (error) {
    console.error('Error saving customer details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}