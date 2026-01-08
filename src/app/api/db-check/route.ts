import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('--- DB Health Check ---');
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    // Test ping
    await db.command({ ping: 1 });
    console.log('✅ DB Ping successful');
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const categoriesCount = await db.collection('categories').countDocuments();
    const latestCategories = await db.collection('categories').find({}).limit(5).toArray();
    
    return NextResponse.json({
      status: 'connected',
      database: 'tg_accessories',
      collections: collectionNames,
      categoriesCount,
      sampleData: latestCategories,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ DB Health Check Failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
