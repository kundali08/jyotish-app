import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Mode 1: Resolve Coordinates to Timezone
  if (lat && lon) {
    try {
      const tzResponse = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 86400 } // Cache heavily as timezones don't change often
      });
      
      if (!tzResponse.ok) throw new Error('TimeAPI failed');
      const tzData = await tzResponse.json();

      // Convert seconds offset to decimal hours (e.g., 20700 -> 5.75)
      const offsetHours = (tzData.standardUtcOffset?.seconds || tzData.currentUtcOffset?.seconds || 0) / 3600;

      return NextResponse.json({
        timezoneName: tzData.timeZone || 'UTC',
        timezoneOffset: offsetHours
      });
    } catch (error) {
      console.error('[Geocode API] Timezone error:', error);
      return NextResponse.json({ error: 'Failed to fetch timezone' }, { status: 500 });
    }
  }

  // Mode 2: Search Query to Coordinates
  if (query) {
    try {
      // Respect Nominatim Usage Policy by providing a User-Agent
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=en,ne`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'JyotishApp/1.0 (Astrology Software)'
        }
      });

      if (!geoResponse.ok) throw new Error('Nominatim failed');
      const geoData = await geoResponse.json();

      const results = geoData.map((item: any) => {
        // Extract a clean name from display_name
        const parts = item.display_name.split(', ');
        const name = parts[0];
        const state = parts.length > 2 ? parts[parts.length - 2] : '';
        const country = parts[parts.length - 1];

        return {
          name: name,
          nameNe: name, // We just pass English if Nepali isn't perfectly provided by Nominatim
          state: state,
          country: country,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name
        };
      });

      return NextResponse.json(results);
    } catch (error) {
      console.error('[Geocode API] Search error:', error);
      return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}
