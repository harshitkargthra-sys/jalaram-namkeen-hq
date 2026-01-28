import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    return NextResponse.json({ message: 'Error fetching order' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const json = await request.json();
    const { items, ...orderData } = json; // Destructure items if present

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...orderData,
        // If items are being updated, you'd typically handle this with nested writes
        // For simplicity, this example only updates top-level order data.
        // Handling nested updates for OrderItems would require more complex logic.
      },
      include: {
        OrderItems: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    return NextResponse.json({ message: 'Error deleting order' }, { status: 500 });
  }
}
