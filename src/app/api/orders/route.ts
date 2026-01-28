import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        OrderItems: true, // Include related order items
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { items, ...orderData } = json;

    const newOrder = await prisma.order.create({
      data: {
        ...orderData,
        OrderItems: {
          create: items.map((item: any) => ({
            foodItemId: item.foodItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        OrderItems: true,
      },
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}
