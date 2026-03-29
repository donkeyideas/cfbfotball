'use client';

import Link from 'next/link';
import { VoteBar } from './VoteBar';

interface ChallengeCardProps {
  challenge: {
    id: string;
    topic: string;
    status: string;
    challenger_votes: number;
    challenged_votes: number;
    challenger_argument: string | null;
    challenged_argument: string | null;
    voting_ends_at: string | null;
    created_at: string;
    challenger: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
    challenged: {
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

const statusLabels: Record<string, string> = {
  PENDING: 'Awaiting Response',
  ACTIVE: 'Arguments Open',
  VOTING: 'Voting Active',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  EXPIRED: 'Expired',
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const challengerName = challenge.challenger?.display_name ?? challenge.challenger?.username ?? 'Unknown';
  const challengedName = challenge.challenged?.display_name ?? challenge.challenged?.username ?? 'Unknown';
  const isVoting = challenge.status === 'VOTING';
  const isComplete = challenge.status === 'COMPLETED';

  return (
    <div className="post-card" style={{ marginBottom: 16 }}>
      <div style={{
        background: 'var(--warm-white)',
        border: '1.5px solid rgba(59,47,30,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--dark-brown)',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.65rem',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}>
            Challenge
          </span>
          <span style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.7rem',
            color: 'var(--cream)',
            fontWeight: 600,
          }}>
            {statusLabels[challenge.status] ?? challenge.status}
          </span>
        </div>

        <div style={{ padding: 16 }}>
          {/* Topic */}
          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--dark-brown)',
            marginBottom: 12,
          }}>
            {challenge.topic}
          </p>

          {/* Participants */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--crimson)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                fontSize: '0.85rem',
                margin: '0 auto 4px',
              }}>
                {challengerName[0]?.toUpperCase()}
              </div>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--dark-brown)' }}>
                @{challenge.challenger?.username}
              </span>
            </div>

            <span style={{
              fontFamily: 'var(--serif)',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--faded-ink)',
              letterSpacing: 2,
            }}>
              VS
            </span>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--dark-brown)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--serif)',
                fontWeight: 700,
                fontSize: '0.85rem',
                margin: '0 auto 4px',
              }}>
                {challengedName[0]?.toUpperCase()}
              </div>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--dark-brown)' }}>
                @{challenge.challenged?.username}
              </span>
            </div>
          </div>

          {/* Vote bar (only show during voting/completed) */}
          {(isVoting || isComplete) && (
            <VoteBar
              votesA={challenge.challenger_votes}
              votesB={challenge.challenged_votes}
              labelA={challenge.challenger?.username ?? 'Challenger'}
              labelB={challenge.challenged?.username ?? 'Challenged'}
            />
          )}

          {/* Voting deadline */}
          {isVoting && challenge.voting_ends_at && (
            <p style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--faded-ink)',
              textAlign: 'center',
              marginTop: 8,
            }}>
              Voting ends {new Date(challenge.voting_ends_at).toLocaleDateString()}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <Link
              href={`/rivalry/challenge/${challenge.id}`}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.75rem',
                color: 'var(--crimson)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                textDecoration: 'none',
              }}
            >
              View Challenge &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
