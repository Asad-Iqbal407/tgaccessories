import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { categories } from '@/lib/data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const staticProducts = categories.flatMap(category =>
      category.products.map(product => ({
        ...product,
        categoryName: category.name,
      }))
    );

    for (const p of staticProducts) {
      await db.collection('products').updateOne(
        { id: p.id },
        {
          $setOnInsert: {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            category: p.category,
            categoryName: p.categoryName,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    const products = await db.collection('products').find({}).toArray();

    return NextResponse.json({
      products,
      source: 'database',
      count: products.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Validate required fields
    const { name, description, price, image, category } = productData;
    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Insert product
    const product = {
      ...productData,
      createdAt: new Date(),
    };

    const result = await db.collection('products').insertOne(product);

    return NextResponse.json(
      {
        message: 'Product added successfully',
        id: result.insertedId,
        product
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
