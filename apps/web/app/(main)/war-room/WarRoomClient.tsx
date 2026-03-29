'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GameData {
  id: string;
  away: string;
  awayFull: string;
  awayScore: string;
  home: string;
  homeFull: string;
  homeScore: string;
  status: string;
  statusState: string;
  gameDate: string;
}

interface WarRoomClientProps {
  liveGames: GameData[];
  upcomingGames: GameData[];
  finalGames: GameData[];
}

export function WarRoomClient({ liveGames, upcomingGames, finalGames }: WarRoomClientProps) {
  const [live, setLive] = useState(liveGames);
  const [upcoming, setUpcoming] = useState(upcomingGames);
  const [final_, setFinal] = useState(finalGames);

  // Auto-refresh from ESPN every 60s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard'
        );
        if (!res.ok) return;
        const data = await res.json();
        const events = data?.events;
        if (!Array.isArray(events)) return;

        const games: GameData[] = events.map((event: Record<string, unknown>) => {
          const competition = (event.competitions as Array<Record<string, unknown>>)?.[0];
          const competitors = (competition?.competitors as Array<Record<string, unknown>>) ?? [];
          const homeTeam = competitors.find((c) => c.homeAway === 'home');
          const awayTeam = competitors.find((c) => c.homeAway === 'away');
          const statusType = (event.status as Record<string, unknown>)?.type as Record<string, unknown> | undefined;

          return {
            id: event.id as string,
            away: ((awayTeam?.team as Record<string, unknown>)?.abbreviation ?? '???') as string,
            awayFull: ((awayTeam?.team as Record<string, unknown>)?.displayName ?? '') as string,
            awayScore: (awayTeam?.score ?? '0') as string,
            home: ((homeTeam?.team as Record<string, unknown>)?.abbreviation ?? '???') as string,
            homeFull: ((homeTeam?.team as Record<string, unknown>)?.displayName ?? '') as string,
            homeScore: (homeTeam?.score ?? '0') as string,
            status: ((statusType?.shortDetail ?? statusType?.description ?? '') as string),
            statusState: ((statusType?.state ?? '') as string),
            gameDate: (event.date ?? '') as string,
          };
        });

        setLive(games.filter((g) => g.statusState === 'in'));
        setUpcoming(games.filter((g) => g.statusState === 'pre'));
        setFinal(games.filter((g) => g.statusState === 'post'));
      } catch {
        // Keep existing data
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const hasAnyGames = live.length > 0 || upcoming.length > 0 || final_.length > 0;

  if (!hasAnyGames) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 32 }}>
        <p className="post-body" style={{ fontSize: '1.1rem' }}>
          No games scheduled right now.
        </p>
        <p style={{ color: 'var(--faded-ink)', fontSize: '0.85rem', marginTop: 8 }}>
          Check back on game day for live action.
        </p>
      </div>
    );
  }

  return (
    <div>
      {live.length > 0 && (
        <GameSection title="LIVE NOW" variant="live" games={live} />
      )}
      {upcoming.length > 0 && (
        <GameSection title="UPCOMING" variant="upcoming" games={upcoming} />
      )}
      {final_.length > 0 && (
        <GameSection title="FINAL" variant="final" games={final_} />
      )}
    </div>
  );
}

function GameSection({
  title,
  variant,
  games,
}: {
  title: string;
  variant: 'live' | 'upcoming' | 'final';
  games: GameData[];
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className={`war-room-header war-room-header-${variant}`}>{title}</div>
      <div className="war-room-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function GameCard({ game, variant }: { game: GameData; variant: string }) {
  const isLive = variant === 'live';

  return (
    <Link
      href={`/war-room/${game.id}`}
      className={`game-card ${isLive ? 'game-card-live' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      <div className="game-card-teams">
        <div className="game-card-team">
          <span className="game-card-abbr">{game.away}</span>
          <span className="game-card-name">{game.awayFull}</span>
        </div>
        <div className="game-card-scores">
          {variant !== 'upcoming' ? (
            <>
              <span className="game-card-score">{game.awayScore}</span>
              <span className="game-card-vs">-</span>
              <span className="game-card-score">{game.homeScore}</span>
            </>
          ) : (
            <span className="game-card-vs">VS</span>
          )}
        </div>
        <div className="game-card-team game-card-team-right">
          <span className="game-card-abbr">{game.home}</span>
          <span className="game-card-name">{game.homeFull}</span>
        </div>
      </div>
      <div className="game-card-status">
        {isLive && <span className="game-card-live-dot" />}
        <span>{game.status}</span>
      </div>
    </Link>
  );
}
