import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const foodItems = await prisma.foodItem.findMany({
      include: {
        images: true
      }
    });
    return NextResponse.json(foodItems);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json({ message: 'Error fetching food items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { password, images, ...productData } = json;

    // Verify Admin Password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Unauthorized: Invalid Admin Key' }, { status: 401 });
    }

    const newFoodItem = await prisma.foodItem.create({
      data: {
        ...productData,
        images: {
          create: images?.map((url: string) => ({ url })) || []
        }
      },
      include: {
        images: true
      }
    });
    return NextResponse.json(newFoodItem, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json({ message: 'Error creating food item' }, { status: 500 });
  }
}