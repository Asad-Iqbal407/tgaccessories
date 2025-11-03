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

    const users = await db.collection('contacts').find({}).toArray();

    // Transform MongoDB documents to match User interface
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt || new Date(),
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
