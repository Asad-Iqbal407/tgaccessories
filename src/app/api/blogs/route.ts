import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Fetch only published blogs for public view
    const blogs = await db.collection('blogs')
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .toArray();

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