import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const cart = await db.collection('carts').findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    return NextResponse.json({
      items: cart.items || [],
      total: cart.total || 0
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    // Get product details
    const product = await db.collection('products').findOne({ id: productId });
    if (!product) {
      console.error('Product not found in database:', productId);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get or create session
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      sessionId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get existing cart or create new one
    let cart = await db.collection('carts').findOne({ sessionId });

    if (!cart) {
      cart = {
        sessionId,
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
    }

    // Check if product already in cart
    const existingItemIndex = cart!.items.findIndex((item: any) => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        addedAt: new Date()
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    // Save cart
    await db.collection('carts').updateOne(
      { sessionId },
      { $set: cart },
      { upsert: true }
    );

    // Set session cookie
    const response = NextResponse.json({
      items: cart.items,
      total: cart.total,
      message: 'Product added to cart'
    });

    response.cookies.set('cart-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No cart session found' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const cart = await db.collection('carts').findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Update item quantity
    const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Product not in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    // Save cart
    await db.collection('carts').updateOne(
      { sessionId },
      { $set: cart }
    );

    return NextResponse.json({
      items: cart.items,
      total: cart.total,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart-session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No cart session found' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('tgaccessories');

    const cart = await db.collection('carts').findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove item from cart
    cart.items = cart.items.filter((item: any) => item.productId !== productId);

    // Recalculate total
    cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    // Save cart
    await db.collection('carts').updateOne(
      { sessionId },
      { $set: cart }
    );

    return NextResponse.json({
      items: cart.items,
      total: cart.total,
      message: 'Product removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}