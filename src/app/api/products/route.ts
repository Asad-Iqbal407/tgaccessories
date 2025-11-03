import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { categories } from '@/lib/data';

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Get all products from database
    const products = await db.collection('products').find({}).toArray();

    // If no products in database, seed with static data
    if (products.length === 0) {
      console.log('No products found in database, seeding with static data...');

      // Insert static data into database
      const allProducts = categories.flatMap(category =>
        category.products.map(product => ({
          ...product,
          categoryName: category.name,
          createdAt: new Date(),
        }))
      );

      const result = await db.collection('products').insertMany(allProducts);
      console.log(`Seeded ${result.insertedCount} products into database`);

      // Verify the insertion by fetching again
      const seededProducts = await db.collection('products').find({}).toArray();

      return NextResponse.json({
        products: seededProducts,
        source: 'database',
        seeded: true,
        count: seededProducts.length
      });
    }

    return NextResponse.json({
      products,
      source: 'database',
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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