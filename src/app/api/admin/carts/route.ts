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

    // Fetch from orders collection instead of carts
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    
    // Log one order to check structure
    if (orders.length > 0) {
      console.log('Sample order from DB:', JSON.stringify(orders[0], null, 2));
    }

    // Transform MongoDB documents to match Cart interface
    const transformedCarts = orders.map((order) => ({
      id: order.orderId || order._id.toString(), // Use orderId if available, fallback to _id
      sessionId: order.sessionId,
      items: order.items || [],
      total: order.total || 0,
      createdAt: order.createdAt || new Date(),
      updatedAt: order.updatedAt || new Date(),
      customerDetails: order.customerDetails,
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
