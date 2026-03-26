import { NextRequest, NextResponse } from 'next/server';
import { MOCK_UPPER_MIDWEST, MOCK_NORTHERN_PLAINS, MOCK_CENTRAL_VALLEY, MOCK_NATIONAL_SUMMARY } from '@/lib/data/mock';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region');
  const dataType = searchParams.get('type') || 'summary';

  // Try live data first, fall back to mock
  if (dataType === 'crop_acreage') {
    return await fetchCropAcreage(searchParams.get('state') || undefined);
  }

  if (dataType === 'water_quality') {
    return await fetchWaterQuality(searchParams.get('huc8') || undefined);
  }

  // Return mock regional data
  if (region === 'upper_midwest') return NextResponse.json(MOCK_UPPER_MIDWEST);
  if (region === 'northern_plains') return NextResponse.json(MOCK_NORTHERN_PLAINS);
  if (region === 'central_valley') return NextResponse.json(MOCK_CENTRAL_VALLEY);

  return NextResponse.json(MOCK_NATIONAL_SUMMARY);
}

async function fetchCropAcreage(state?: string) {
  const apiKey = process.env.USDA_NASS_API_KEY;

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        key: apiKey,
        commodity_desc: 'CORN',
        statisticcat_desc: 'AREA PLANTED',
        year: '2023',
        agg_level_desc: 'STATE',
        ...(state ? { state_alpha: state } : {}),
      });

      const res = await fetch(
        `https://quickstats.nass.usda.gov/api/api_GET/?${params}`,
        { next: { revalidate: 86400 } }
      );

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ source: 'live', provider: 'USDA NASS', data: data.data?.slice(0, 20) || [] });
      }
    } catch {
      // Fall through to mock
    }
  }

  return NextResponse.json({
    source: 'illustrative',
    provider: 'USDA NASS',
    data: [
      { state: 'IA', commodity: 'CORN', acres: 12_900_000 },
      { state: 'IL', commodity: 'CORN', acres: 10_800_000 },
      { state: 'MN', commodity: 'CORN', acres: 7_600_000 },
      { state: 'IN', commodity: 'CORN', acres: 5_500_000 },
      { state: 'NE', commodity: 'CORN', acres: 9_200_000 },
    ],
  });
}

async function fetchWaterQuality(huc8?: string) {
  try {
    const url = huc8
      ? `https://attains.epa.gov/attains-public/api/assessmentUnits?huc=${huc8}&returnCountOnly=false`
      : `https://attains.epa.gov/attains-public/api/assessmentUnits?state=IA&returnCountOnly=true`;

    const res = await fetch(url, { next: { revalidate: 604800 } });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ source: 'live', provider: 'EPA ATTAINS', data });
    }
  } catch {
    // Fall through to mock
  }

  return NextResponse.json({
    source: 'illustrative',
    provider: 'EPA ATTAINS',
    data: {
      totalAssessmentUnits: 1247,
      goodStatus: 387,
      impairedStatus: 742,
      unknownStatus: 118,
    },
  });
}
