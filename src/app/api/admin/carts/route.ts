import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const carts = await db.collection('carts').find({}).toArray();

    // Transform MongoDB documents to match Cart interface
    const transformedCarts = carts.map((cart) => ({
      id: cart._id.toString(),
      sessionId: cart.sessionId,
      items: cart.items || [],
      total: cart.total || 0,
      createdAt: cart.createdAt || new Date(),
      updatedAt: cart.updatedAt || new Date(),
    }));

    return NextResponse.json({ carts: transformedCarts });
  } catch (error) {
    console.error('Error fetching carts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
