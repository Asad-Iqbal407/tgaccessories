import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ContactFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Insert contact form data
    const contactData = {
      ...body,
      createdAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(contactData);

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully',
        id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}