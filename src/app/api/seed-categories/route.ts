import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { categories as initialCategories } from '@/lib/data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    // Check if categories exist
    const count = await db.collection('categories').countDocuments();
    
    if (count === 0) {
      // Seed initial categories
      // We only need id, name, description, image from the initial data
      const categoriesToInsert = initialCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        createdAt: new Date()
      }));
      
      await db.collection('categories').insertMany(categoriesToInsert);
      return NextResponse.json({ message: 'Categories seeded successfully', categories: categoriesToInsert });
    }
    
    return NextResponse.json({ message: 'Categories already exist' });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json({ error: 'Failed to seed categories' }, { status: 500 });
  }
}
