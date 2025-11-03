import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = {
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };

    const result = await db.collection('admins').insertOne(admin);

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
