/**
 * Gochara (Transit) API Route
 * POST: { natalMoonLongitude, transitDate?, timezone? }
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateGochara } from '@/lib/engine/transit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { natalMoonLongitude, transitDate, timezone = 5.75 } = body;

    if (natalMoonLongitude == null) {
      return NextResponse.json(
        { error: 'Natal Moon longitude is required' },
        { status: 400 }
      );
    }

    const date = transitDate ? new Date(transitDate) : new Date();

    const result = calculateGochara(natalMoonLongitude, date, timezone);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Gochara error:', error);
    return NextResponse.json(
      { error: error.message || 'Transit calculation failed' },
      { status: 500 }
    );
  }
}
