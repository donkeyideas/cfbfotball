import { NextRequest, NextResponse } from 'next/server';

/* ── Rate Limiting ─────────────────────────────────────────────── */

const MONTHLY_LIMIT = 950; // hard stop (50-call buffer under 1,000)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: unknown[];
  fetchedAt: number;
}

interface MonthlyCounter {
  month: string; // "YYYY-MM"
  count: number;
}

const cache = new Map<string, CacheEntry>();
const counter: MonthlyCounter = {
  month: new Date().toISOString().slice(0, 7),
  count: 0,
};

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function getCallsRemaining(): number {
  const now = getCurrentMonth();
  if (counter.month !== now) {
    counter.month = now;
    counter.count = 0;
  }
  return MONTHLY_LIMIT - counter.count;
}

function incrementCounter(): void {
  const now = getCurrentMonth();
  if (counter.month !== now) {
    counter.month = now;
    counter.count = 0;
  }
  counter.count++;
}

function getCached(key: string): CacheEntry | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
  return entry;
}

/* ── CFBD API Fetch ────────────────────────────────────────────── */

const CFBD_BASE = 'https://api.collegefootballdata.com';

async function fetchCFBD(path: string): Promise<unknown[]> {
  const apiKey = process.env.CFBD_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(`${CFBD_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`CFBD API error: ${res.status} ${res.statusText} for ${path}`);
    return [];
  }

  return res.json();
}

/* ── Route Handler ─────────────────────────────────────────────── */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const year = searchParams.get('year') || '2026';

  if (!type || !['recruiting', 'portal'].includes(type)) {
    return NextResponse.json(
      { error: 'Missing or invalid type param. Use ?type=recruiting or ?type=portal' },
      { status: 400 },
    );
  }

  const cacheKey = `${type}-${year}`;

  // Check cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json({
      data: cached.data,
      cached: true,
      callsRemaining: getCallsRemaining(),
    });
  }

  // Check rate limit
  if (getCallsRemaining() <= 0) {
    // Return stale cache if available, otherwise empty
    const stale = cache.get(cacheKey);
    return NextResponse.json({
      data: stale?.data || [],
      cached: true,
      callsRemaining: 0,
      rateLimited: true,
    });
  }

  // Fetch from CFBD
  let path = '';
  if (type === 'recruiting') {
    path = `/recruiting/players?year=${year}`;
  } else {
    path = `/player/portal?year=${year}`;
  }

  const data = await fetchCFBD(path);
  incrementCounter();

  // Store in cache (even empty results to avoid hammering)
  cache.set(cacheKey, { data, fetchedAt: Date.now() });

  return NextResponse.json({
    data,
    cached: false,
    callsRemaining: getCallsRemaining(),
  });
}
