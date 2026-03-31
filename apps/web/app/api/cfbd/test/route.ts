import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint: GET /api/cfbd/test
 * Hit this in the browser to see exactly what's happening with the CFBD API.
 */
export async function GET() {
  const apiKey = process.env.CFBD_API_KEY;
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length ?? 0,
    keyPrefix: apiKey?.slice(0, 4) ?? 'N/A',
  };

  if (!apiKey) {
    diagnostics.error = 'CFBD_API_KEY environment variable is not set';
    return NextResponse.json(diagnostics, { status: 500 });
  }

  // Test recruiting endpoint
  try {
    const recruitRes = await fetch(
      'https://api.collegefootballdata.com/recruiting/players?year=2026',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      },
    );
    diagnostics.recruiting = {
      status: recruitRes.status,
      statusText: recruitRes.statusText,
      ok: recruitRes.ok,
    };
    if (recruitRes.ok) {
      const data = await recruitRes.json();
      diagnostics.recruiting = {
        ...diagnostics.recruiting as object,
        resultCount: Array.isArray(data) ? data.length : 'not-an-array',
        sample: Array.isArray(data) && data.length > 0
          ? { name: data[0].name, committedTo: data[0].committedTo, stars: data[0].stars }
          : null,
      };
    } else {
      const body = await recruitRes.text().catch(() => '');
      (diagnostics.recruiting as Record<string, unknown>).errorBody = body.slice(0, 500);
    }
  } catch (err) {
    diagnostics.recruiting = { error: String(err) };
  }

  // Test portal endpoint
  try {
    const portalRes = await fetch(
      'https://api.collegefootballdata.com/player/portal?year=2026',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      },
    );
    diagnostics.portal = {
      status: portalRes.status,
      statusText: portalRes.statusText,
      ok: portalRes.ok,
    };
    if (portalRes.ok) {
      const data = await portalRes.json();
      diagnostics.portal = {
        ...diagnostics.portal as object,
        resultCount: Array.isArray(data) ? data.length : 'not-an-array',
        sample: Array.isArray(data) && data.length > 0
          ? { firstName: data[0].firstName, lastName: data[0].lastName, origin: data[0].origin }
          : null,
      };
    } else {
      const body = await portalRes.text().catch(() => '');
      (diagnostics.portal as Record<string, unknown>).errorBody = body.slice(0, 500);
    }
  } catch (err) {
    diagnostics.portal = { error: String(err) };
  }

  return NextResponse.json(diagnostics);
}
