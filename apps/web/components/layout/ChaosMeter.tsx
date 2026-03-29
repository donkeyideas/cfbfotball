'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ChaosData {
  level: number;
  label: string;
  detail: string;
}

function calculateChaos(stats: {
  posts24h: number;
  challenges24h: number;
  flagged24h: number;
  portalMoves: number;
}): ChaosData {
  // Score: posts contribute moderately, challenges and flags amplify chaos
  let score = 0;
  score += Math.min(stats.posts24h * 2, 30);
  score += Math.min(stats.challenges24h * 8, 25);
  score += Math.min(stats.flagged24h * 10, 20);
  score += Math.min(stats.portalMoves * 5, 25);

  // Clamp 0–100
  score = Math.min(Math.max(Math.round(score), 0), 100);

  let label: string;
  let detail: string;

  if (score >= 80) {
    label = 'MAXIMUM CHAOS';
    detail = 'The boards are on fire';
  } else if (score >= 60) {
    label = 'HIGH CHAOS';
    detail = 'Rivalry week energy';
  } else if (score >= 40) {
    label = 'ELEVATED';
    detail = 'Takes are flowing';
  } else if (score >= 20) {
    label = 'MODERATE';
    detail = 'Steady discourse';
  } else {
    label = 'CALM';
    detail = 'Off-season vibes';
  }

  return { level: score, label, detail };
}

function getChaosColor(level: number): string {
  if (level >= 80) return '#8b0000';
  if (level >= 60) return 'var(--crimson)';
  if (level >= 40) return '#cc7722';
  if (level >= 20) return '#b8860b';
  return '#556b2f';
}

export function ChaosMeter() {
  const [chaos, setChaos] = useState<ChaosData>({ level: 0, label: 'LOADING', detail: '...' });

  useEffect(() => {
    const supabase = createClient();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    async function loadChaos() {
      const [postsRes, challengesRes, flaggedRes, portalRes] = await Promise.all([
        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterday)
          .eq('status', 'PUBLISHED'),
        supabase
          .from('challenges')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterday),
        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterday)
          .eq('status', 'FLAGGED'),
        supabase
          .from('portal_players')
          .select('id', { count: 'exact', head: true })
          .in('status', ['IN_PORTAL', 'COMMITTED']),
      ]);

      setChaos(calculateChaos({
        posts24h: postsRes.count ?? 0,
        challenges24h: challengesRes.count ?? 0,
        flagged24h: flaggedRes.count ?? 0,
        portalMoves: portalRes.count ?? 0,
      }));
    }

    loadChaos();
  }, []);

  const color = getChaosColor(chaos.level);

  return (
    <div className="chaos-meter">
      <div className="chaos-meter-title">Chaos Meter</div>
      <div className="chaos-meter-value" style={{ color }}>{chaos.level}</div>
      <div className="chaos-meter-bar-track">
        <div
          className="chaos-meter-bar-fill"
          style={{
            width: `${chaos.level}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
      <div className="chaos-meter-labels">
        <span>Calm</span>
        <span>{chaos.label}</span>
        <span>Max</span>
      </div>
      <div className="chaos-meter-detail">{chaos.detail}</div>
    </div>
  );
}
