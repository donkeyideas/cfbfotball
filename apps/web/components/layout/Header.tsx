'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Sidebar } from './Sidebar';

interface LiveScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export function Header() {
  const { profile } = useAuth();
  const username = profile?.username ?? null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scores, setScores] = useState<LiveScore[]>([]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">
              CFB Social
            </h1>
          </Link>

          {/* Live scores ticker */}
          {scores.length > 0 && (
            <div className="hidden flex-1 overflow-hidden px-8 md:block">
              <div className="flex animate-[scroll_30s_linear_infinite] gap-6">
                {scores.map((score) => (
                  <span
                    key={score.id}
                    className="shrink-0 font-mono text-xs text-[var(--text-secondary)]"
                  >
                    {score.awayTeam} {score.awayScore} - {score.homeScore} {score.homeTeam}{' '}
                    <span className="text-[var(--text-muted)]">({score.status})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-[var(--text-secondary)]" />
            </button>
            {username && (
              <Link
                href={`/profile/${username}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--school-primary)] font-serif text-sm font-bold text-[var(--text-inverse)]"
              >
                {username[0]?.toUpperCase()}
              </Link>
            )}
          </div>
        </div>

        {/* Ornamental line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
      </header>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-[var(--surface-raised)]">
            <div className="pt-16">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
