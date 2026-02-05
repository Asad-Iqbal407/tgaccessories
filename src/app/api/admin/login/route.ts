import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    const db = client.db('tg_accessories');

    // Find admin user
    const admin = await db.collection('admins').findOne({ email });

    // Verify password
    let isValidPassword = false;
    
    // Special check for specific admin credentials
    if (email === 'tariq@gmail.com' && password === 'Tariq123') {
       // Create a mock admin object if it doesn't exist in DB, or use the found one
       // If not found in DB, we'll create a token anyway for this super user
       if (!admin) {
         const token = jwt.sign(
            { id: 'master-admin', email: 'tariq@gmail.com', role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          return NextResponse.json({
            message: 'Login successful',
            token,
            admin: {
              id: 'master-admin',
              email: 'tariq@gmail.com',
              role: 'admin'
            }
          });
       }
       isValidPassword = true; // If found in DB, assume password is correct for this specific user if you want to override, 
                               // BUT better to just return success immediately above if we want to bypass DB password check.
                               // Let's just return immediately for this user to be safe and simple.
    }

    if (!admin && email !== 'tariq@gmail.com') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (admin && (email !== 'tariq@gmail.com' || password !== 'Tariq123')) {
        isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin?._id || 'master-admin', email: admin?.email || email, role: admin?.role || 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin?._id || 'master-admin',
        email: admin?.email || email,
        role: admin?.role || 'admin'
      }
    });

    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
