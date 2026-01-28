import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const foodItem = await prisma.foodItem.findUnique({
      where: { id },
      include: {
        images: true
      }
    });

    if (!foodItem) {
      return NextResponse.json({ message: 'Food item not found' }, { status: 404 });
    }

    return NextResponse.json(foodItem);
  } catch (error) {
    console.error(`Error fetching food item:`, error);
    return NextResponse.json({ message: 'Error fetching food item' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const json = await request.json();
    const updatedFoodItem = await prisma.foodItem.update({
      where: { id },
      data: json,
    });

    return NextResponse.json(updatedFoodItem);
  } catch (error) {
    console.error(`Error updating food item:`, error);
    return NextResponse.json({ message: 'Error updating food item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.foodItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Food item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting food item:`, error);
    return NextResponse.json({ message: 'Error deleting food item' }, { status: 500 });
  }
}
