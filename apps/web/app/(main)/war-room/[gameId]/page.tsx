import { Suspense } from 'react';
import Link from 'next/link';
import { GameThread } from './GameThread';

export const dynamic = 'force-dynamic';

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: GamePageProps) {
  const { gameId } = await params;
  return { title: `War Room - Game ${gameId}` };
}

export default async function GameThreadPage({ params }: GamePageProps) {
  const { gameId } = await params;
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Fetch or create game thread
  let { data: thread } = await supabase
    .from('game_threads')
    .select('*')
    .eq('espn_game_id', gameId)
    .maybeSingle();

  // If no thread exists, try to get game info from ESPN and create one
  if (!thread) {
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`
      );
      if (res.ok) {
        const data = await res.json();
        const event = data?.events?.find((e: Record<string, unknown>) => e.id === gameId);
        if (event) {
          const competition = (event.competitions as Array<Record<string, unknown>>)?.[0];
          const competitors = (competition?.competitors as Array<Record<string, unknown>>) ?? [];
          const homeTeam = competitors.find((c) => c.homeAway === 'home');
          const awayTeam = competitors.find((c) => c.homeAway === 'away');
          const statusType = (event.status as Record<string, unknown>)?.type as Record<string, unknown> | undefined;
          const statusState = (statusType?.state ?? '') as string;

          const awayAbbr = ((awayTeam?.team as Record<string, unknown>)?.abbreviation ?? '???') as string;
          const homeAbbr = ((homeTeam?.team as Record<string, unknown>)?.abbreviation ?? '???') as string;
          const awayFull = ((awayTeam?.team as Record<string, unknown>)?.displayName ?? awayAbbr) as string;
          const homeFull = ((homeTeam?.team as Record<string, unknown>)?.displayName ?? homeAbbr) as string;

          let status = 'SCHEDULED';
          if (statusState === 'in') status = 'LIVE';
          else if (statusState === 'post') status = 'FINAL';

          const { data: newThread } = await supabase
            .from('game_threads')
            .insert({
              espn_game_id: gameId,
              title: `${awayFull} vs ${homeFull}`,
              away_team: awayAbbr,
              home_team: homeAbbr,
              away_score: parseInt(awayTeam?.score as string) || 0,
              home_score: parseInt(homeTeam?.score as string) || 0,
              status,
              status_detail: ((statusType?.shortDetail ?? '') as string),
              game_date: (event.date ?? new Date().toISOString()) as string,
            })
            .select()
            .single();

          thread = newThread;
        }
      }
    } catch {
      // ESPN unreachable
    }
  }

  // Fallback thread for when ESPN is unreachable
  const threadData = thread ?? {
    id: '',
    espn_game_id: gameId,
    title: `Game ${gameId}`,
    away_team: 'AWAY',
    home_team: 'HOME',
    away_score: 0,
    home_score: 0,
    status: 'SCHEDULED',
    status_detail: '',
    game_date: new Date().toISOString(),
    viewer_count: 0,
    message_count: 0,
  };

  // Load initial messages
  let initialMessages: Array<Record<string, unknown>> = [];
  if (thread?.id) {
    const { data: msgs } = await supabase
      .from('game_thread_messages')
      .select(`
        *,
        author:profiles!game_thread_messages_user_id_fkey(
          id, username, display_name, avatar_url, dynasty_tier
        )
      `)
      .eq('game_thread_id', thread.id)
      .order('created_at', { ascending: true })
      .limit(50);
    initialMessages = msgs ?? [];
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/war-room"
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.8rem',
            color: 'var(--faded-ink)',
            textDecoration: 'none',
          }}
        >
          &larr; Back to War Room
        </Link>
      </div>

      <Suspense fallback={<div className="content-card" style={{ opacity: 0.5, padding: 32 }}>Loading game thread...</div>}>
        <GameThread
          thread={threadData}
          espnGameId={gameId}
          initialMessages={initialMessages}
        />
      </Suspense>
    </div>
  );
}
