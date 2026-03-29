'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MatchupSchool {
  id: string;
  name: string;
  abbreviation: string;
  slug: string;
  primary_color: string;
  secondary_color: string;
  mascot: string;
}

interface Matchup {
  id: string;
  round: number;
  position: number;
  school_1: MatchupSchool | null;
  school_2: MatchupSchool | null;
  school_1_votes: number;
  school_2_votes: number;
  winner_id: string | null;
  status: string;
  voting_ends_at: string | null;
}

interface UserVote {
  matchup_id: string;
  school_id: string;
}

const ROUND_LABELS: Record<number, string> = {
  1: 'Round of 64',
  2: 'Round of 32',
  3: 'Sweet 16',
  4: 'Elite 8',
  5: 'Final Four',
  6: 'Championship',
};

interface MascotWarsClientProps {
  bracket: Record<string, unknown> | null;
  matchups: Array<Record<string, unknown>>;
  userVotes: Array<Record<string, unknown>>;
}

export function MascotWarsClient({ bracket, matchups: rawMatchups, userVotes: rawVotes }: MascotWarsClientProps) {
  const matchups = rawMatchups as unknown as Matchup[];
  const initialVotes = rawVotes as unknown as UserVote[];
  const [votes, setVotes] = useState<Map<string, string>>(
    new Map(initialVotes.map((v) => [v.matchup_id, v.school_id]))
  );
  const [localCounts, setLocalCounts] = useState<Map<string, { s1: number; s2: number }>>(
    new Map(matchups.map((m) => [m.id, { s1: m.school_1_votes, s2: m.school_2_votes }]))
  );

  const handleVote = useCallback(async (matchupId: string, schoolId: string, isSchool1: boolean) => {
    if (votes.has(matchupId)) return;

    // Optimistic update
    setVotes((prev) => new Map(prev).set(matchupId, schoolId));
    setLocalCounts((prev) => {
      const next = new Map(prev);
      const current = next.get(matchupId) ?? { s1: 0, s2: 0 };
      next.set(matchupId, {
        s1: isSchool1 ? current.s1 + 1 : current.s1,
        s2: !isSchool1 ? current.s2 + 1 : current.s2,
      });
      return next;
    });

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('mascot_votes').insert({
      matchup_id: matchupId,
      user_id: user.id,
      school_id: schoolId,
    });
  }, [votes]);

  if (!bracket) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 32 }}>
        <p className="post-body" style={{ fontSize: '1.1rem' }}>
          No active bracket right now.
        </p>
        <p style={{ color: 'var(--faded-ink)', fontSize: '0.85rem', marginTop: 8 }}>
          Check back when the next Mascot Wars tournament begins.
        </p>
      </div>
    );
  }

  const currentRound = bracket.current_round as number;
  const roundLabel = ROUND_LABELS[currentRound] ?? `Round ${currentRound}`;
  const bracketName = bracket.name as string;

  return (
    <div>
      <div className="round-header">
        <div className="round-header-name">{bracketName}</div>
        <div className="round-header-round">{roundLabel}</div>
      </div>

      <div className="matchup-grid">
        {matchups.length === 0 ? (
          <div style={{ color: 'var(--faded-ink)', fontFamily: 'var(--sans)', fontSize: '0.85rem', textAlign: 'center', padding: 24 }}>
            No matchups for this round yet.
          </div>
        ) : (
          matchups.map((matchup) => (
            <MatchupCard
              key={matchup.id}
              matchup={matchup}
              userVote={votes.get(matchup.id)}
              counts={localCounts.get(matchup.id) ?? { s1: matchup.school_1_votes, s2: matchup.school_2_votes }}
              onVote={handleVote}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MatchupCard({
  matchup,
  userVote,
  counts,
  onVote,
}: {
  matchup: Matchup;
  userVote?: string;
  counts: { s1: number; s2: number };
  onVote: (matchupId: string, schoolId: string, isSchool1: boolean) => void;
}) {
  const s1 = matchup.school_1;
  const s2 = matchup.school_2;
  if (!s1 || !s2) return null;

  const totalVotes = counts.s1 + counts.s2;
  const s1Pct = totalVotes > 0 ? Math.round((counts.s1 / totalVotes) * 100) : 50;
  const s2Pct = totalVotes > 0 ? 100 - s1Pct : 50;
  const hasVoted = !!userVote;
  const isVoting = matchup.status === 'VOTING';
  const isCompleted = matchup.status === 'COMPLETED';

  return (
    <div className="matchup-card">
      <div className="matchup-body">
        {/* School 1 */}
        <div className="matchup-school">
          <div className="matchup-school-avatar" style={{ backgroundColor: s1.primary_color }}>
            {s1.abbreviation}
          </div>
          <div className="matchup-school-mascot">{s1.mascot}</div>
          <div className="matchup-school-name">{s1.name}</div>
          {isVoting && !hasVoted && (
            <button
              className="matchup-vote-btn"
              style={{ borderColor: s1.primary_color, color: s1.primary_color }}
              onClick={() => onVote(matchup.id, s1.id, true)}
            >
              Vote
            </button>
          )}
          {hasVoted && userVote === s1.id && (
            <span className="matchup-voted" style={{ color: s1.primary_color }}>Your pick</span>
          )}
        </div>

        {/* VS */}
        <div className="matchup-vs">
          <span>VS</span>
          {totalVotes > 0 && (
            <span className="matchup-vote-count">{totalVotes} votes</span>
          )}
        </div>

        {/* School 2 */}
        <div className="matchup-school">
          <div className="matchup-school-avatar" style={{ backgroundColor: s2.primary_color }}>
            {s2.abbreviation}
          </div>
          <div className="matchup-school-mascot">{s2.mascot}</div>
          <div className="matchup-school-name">{s2.name}</div>
          {isVoting && !hasVoted && (
            <button
              className="matchup-vote-btn"
              style={{ borderColor: s2.primary_color, color: s2.primary_color }}
              onClick={() => onVote(matchup.id, s2.id, false)}
            >
              Vote
            </button>
          )}
          {hasVoted && userVote === s2.id && (
            <span className="matchup-voted" style={{ color: s2.primary_color }}>Your pick</span>
          )}
        </div>
      </div>

      {/* Vote Bar */}
      {(hasVoted || isCompleted) && totalVotes > 0 && (
        <div className="matchup-bar">
          <div
            className="matchup-bar-fill matchup-bar-left"
            style={{ width: `${s1Pct}%`, backgroundColor: s1.primary_color }}
          />
          <div
            className="matchup-bar-fill matchup-bar-right"
            style={{ width: `${s2Pct}%`, backgroundColor: s2.primary_color }}
          />
        </div>
      )}

      {(hasVoted || isCompleted) && totalVotes > 0 && (
        <div className="matchup-bar-labels">
          <span style={{ color: s1.primary_color }}>{s1Pct}%</span>
          <span style={{ color: s2.primary_color }}>{s2Pct}%</span>
        </div>
      )}

      {isCompleted && matchup.winner_id && (
        <div className="matchup-winner">
          Winner: {matchup.winner_id === s1.id ? s1.mascot : s2.mascot}
        </div>
      )}
    </div>
  );
}
