import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, image } = body;
    console.log('--- API PUT Category ---');
    console.log('ID:', id);
    console.log('Body:', body);
    
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    
    console.log('Update Data:', updateData);
    
    const result = await db.collection('categories').updateOne(
      { id: id },
      { $set: updateData }
    );
    
    console.log('Match result:', result.matchedCount, 'Modified:', result.modifiedCount);
    
    if (result.matchedCount === 0) {
      console.log('❌ Category not found for update');
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    console.log('✅ Category updated successfully');
    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { id } = params;
    console.log('--- API DELETE Category ---');
    console.log('ID:', id);
    
    const client = await clientPromise;
    const db = client.db('tg_accessories');
    
    const result = await db.collection('categories').deleteOne({ id: id });
    console.log('Deleted count:', result.deletedCount);
    
    if (result.deletedCount === 0) {
      console.log('❌ Category not found for deletion');
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    console.log('✅ Category deleted successfully');
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
