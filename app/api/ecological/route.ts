import { NextRequest, NextResponse } from 'next/server';
import { MOCK_UPPER_MIDWEST, MOCK_NORTHERN_PLAINS, MOCK_CENTRAL_VALLEY, MOCK_NATIONAL_SUMMARY } from '@/lib/data/mock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region');
  const dataType = searchParams.get('type') || 'summary';

  // Try live data first, fall back to mock
  if (dataType === 'crop_acreage') {
    return await fetchCropAcreage(searchParams.get('state') || undefined);
  }

  if (dataType === 'water_quality') {
    const boundingBox = searchParams.get('boundingBox');
    if (boundingBox) {
      return await fetchWaterQualityByBBox(boundingBox);
    }
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

async function fetchWaterQualityByBBox(boundingBox: string) {
  // Two-step approach:
  // 1. Use USGS WBD service to find HUC12 codes within the bounding box
  // 2. Query EPA ATTAINS huc12summary for each HUC12 and aggregate results

  try {
    const [west, south, east, north] = boundingBox.split(',').map(Number);
    if ([west, south, east, north].some(isNaN)) throw new Error('Invalid bbox');

    // Step 1: Find HUC12s in bbox via USGS National Map WBD service
    const geom = JSON.stringify({ xmin: west, ymin: south, xmax: east, ymax: north });
    const wbdUrl = `https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/6/query?` +
      `where=1%3D1&geometry=${encodeURIComponent(geom)}&geometryType=esriGeometryEnvelope` +
      `&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=huc12&returnGeometry=false&f=json&resultRecordCount=25`;

    const wbdRes = await fetch(wbdUrl, { next: { revalidate: 604800 } });
    if (!wbdRes.ok) throw new Error('WBD request failed');

    const wbdData = await wbdRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const huc12s: string[] = (wbdData.features || []).map((f: any) => f.attributes?.huc12).filter(Boolean);

    if (huc12s.length === 0) throw new Error('No HUC12s found');

    // Step 2: Query ATTAINS huc12summary for a sample of HUC12s (cap at 15 for performance)
    const sample = huc12s.slice(0, 15);
    const summaries = await Promise.allSettled(
      sample.map((huc) =>
        fetch(`https://attains.epa.gov/attains-public/api/huc12summary?huc=${huc}`, {
          next: { revalidate: 604800 },
        }).then((r) => r.ok ? r.json() : null)
      )
    );

    // Aggregate area-weighted results across HUC12s
    let totalAssessedSqMi = 0;
    let goodSqMi = 0;
    let impairedSqMi = 0;
    let assessmentUnitCount = 0;

    for (const result of summaries) {
      if (result.status !== 'fulfilled' || !result.value) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items: any[] = result.value.items || [];
      for (const item of items) {
        const assessed = item.assessedCatchmentAreaSqMi || 0;
        totalAssessedSqMi += assessed;
        goodSqMi += item.assessedGoodCatchmentAreaSqMi || 0;
        impairedSqMi += item.containImpairedWatersCatchmentAreaSqMi || 0;
        assessmentUnitCount += item.assessmentUnitCount || 0;
      }
    }

    if (totalAssessedSqMi > 0) {
      const pct_good = Math.round((goodSqMi / totalAssessedSqMi) * 100);
      const pct_impaired = Math.round((impairedSqMi / totalAssessedSqMi) * 100);
      return NextResponse.json({
        source: 'live',
        provider: 'EPA ATTAINS',
        data: {
          good: pct_good,
          impaired: pct_impaired,
          unknown: 100 - pct_good - pct_impaired,
          total: assessmentUnitCount,
          pct_good,
          pct_impaired,
          huc12_count: sample.length,
        },
      });
    }

    // If all HUC12s came back with 0 assessed area, still mark as live with 0 data
    if (assessmentUnitCount === 0 && sample.length > 0) {
      return NextResponse.json({
        source: 'live',
        provider: 'EPA ATTAINS',
        data: {
          good: 0,
          impaired: 0,
          unknown: 100,
          total: 0,
          pct_good: 0,
          pct_impaired: 0,
          huc12_count: sample.length,
        },
      });
    }
  } catch {
    // Fall through to mock
  }

  return NextResponse.json({
    source: 'illustrative',
    provider: 'EPA ATTAINS',
    data: {
      good: 387,
      impaired: 742,
      unknown: 118,
      total: 1247,
      pct_good: 31,
      pct_impaired: 59,
    },
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
