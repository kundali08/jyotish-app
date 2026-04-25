/**
 * Kundali Milan API Route
 * POST: { groomMoonLon, brideMoonLon, groomLagnaRashi, brideLagnaRashi, groomMarsRashi, brideMarsRashi }
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateKundaliMilan } from '@/lib/engine/compatibility';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groomMoonLon, brideMoonLon,
      groomLagnaRashi, brideLagnaRashi,
      groomMarsRashi, brideMarsRashi
    } = body;

    if (groomMoonLon == null || brideMoonLon == null) {
      return NextResponse.json(
        { error: 'Both groom and bride Moon longitudes are required' },
        { status: 400 }
      );
    }

    const result = calculateKundaliMilan(
      groomMoonLon, brideMoonLon,
      groomLagnaRashi || 1, brideLagnaRashi || 1,
      groomMarsRashi || 1, brideMarsRashi || 1
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Kundali Milan error:', error);
    return NextResponse.json(
      { error: error.message || 'Milan calculation failed' },
      { status: 500 }
    );
  }
}
