import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  role: string;
}

async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const blogs = await db.collection('blogs').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ 
      blogs: blogs.map(blog => ({
        ...blog,
        id: blog._id.toString()
      }))
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, image, category, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Create a simple slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await db.collection('blogs').findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newBlog = {
      title,
      slug: uniqueSlug,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      image: image || 'https://images.unsplash.com/photo-1499750310159-5b5f0d6920a9?w=800&h=600&fit=crop',
      category: category || 'General',
      isPublished: isPublished || false,
      author: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('blogs').insertOne(newBlog);

    return NextResponse.json({ 
      message: 'Blog created successfully',
      blog: { ...newBlog, id: result.insertedId.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}