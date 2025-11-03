import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Connect to MongoDB and get user data
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const user = await db.collection('users').findOne(
      { _id: decoded.userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}