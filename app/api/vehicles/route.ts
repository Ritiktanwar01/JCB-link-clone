import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicles, createVehicle } from '@/lib/auth';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vehicles = getAllVehicles();
    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const vehicle = createVehicle(data);

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}
