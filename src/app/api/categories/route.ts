import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    const categories = await db.collection('categories').find({}).toArray();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, image } = body;
    
    if (!id || !name || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    // Check if category ID already exists
    const existingCategory = await db.collection('categories').findOne({ id });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category ID already exists' }, { status: 400 });
    }
    
    const newCategory = {
      id,
      name,
      description,
      image,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('categories').insertOne(newCategory);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
