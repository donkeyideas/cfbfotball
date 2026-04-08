import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/* ── In-memory cache (same pattern as /api/cfbd) ──────────────── */

interface CacheEntry {
  data: SidebarData;
  fetchedAt: number;
}

interface SidebarData {
  portalPlayers: Array<{
    name: string;
    position: string;
    school: { abbreviation: string } | null;
  }>;
  claims: Array<{
    created_at: string;
    school: { abbreviation: string } | null;
    player: { name: string; star_rating: number | null } | null;
  }>;
  leaders: Array<{
    username: string;
    xp: number;
    dynasty_tier: string;
    school: { abbreviation: string } | null;
  }>;
  chaos: {
    posts24h: number;
    challenges24h: number;
    flagged24h: number;
    portalMoves: number;
  };
}

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
let cached: CacheEntry | null = null;

function getAnonSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET() {
  // Return cached if fresh
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    });
  }

  const sb = getAnonSupabase();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Run all 7 queries in parallel
  const [portalRes, claimsRes, leadersRes, posts24hRes, challenges24hRes, flagged24hRes, portalMovesRes] =
    await Promise.all([
      sb
        .from('portal_players')
        .select('name, position, school:schools!portal_players_previous_school_id_fkey(abbreviation)')
        .order('created_at', { ascending: false })
        .limit(8),
      sb
        .from('roster_claims')
        .select('created_at, school:schools!roster_claims_school_id_fkey(abbreviation), player:portal_players!roster_claims_player_id_fkey(name, star_rating)')
        .order('created_at', { ascending: false })
        .limit(5),
      sb
        .from('profiles')
        .select('username, xp, dynasty_tier, school:schools!profiles_school_id_fkey(abbreviation)')
        .order('xp', { ascending: false })
        .limit(5),
      sb
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday)
        .eq('status', 'PUBLISHED'),
      sb
        .from('challenges')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday),
      sb
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', yesterday)
        .eq('status', 'FLAGGED'),
      sb
        .from('portal_players')
        .select('id', { count: 'exact', head: true })
        .in('status', ['IN_PORTAL', 'COMMITTED']),
    ]);

  const data: SidebarData = {
    portalPlayers: (portalRes.data ?? []) as SidebarData['portalPlayers'],
    claims: (claimsRes.data ?? []) as SidebarData['claims'],
    leaders: (leadersRes.data ?? []) as SidebarData['leaders'],
    chaos: {
      posts24h: posts24hRes.count ?? 0,
      challenges24h: challenges24hRes.count ?? 0,
      flagged24h: flagged24hRes.count ?? 0,
      portalMoves: portalMovesRes.count ?? 0,
    },
  };

  // Update cache
  cached = { data, fetchedAt: Date.now() };

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
    },
  });
}
