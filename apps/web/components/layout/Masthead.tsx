'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from './ThemeToggle';

interface MastheadProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function Masthead({ onMenuToggle, menuOpen }: MastheadProps) {
  const { isLoggedIn, profile } = useAuth();
  const username = profile?.username ?? null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  return (
    <>
      <div className="header-top-border" />
      <header className="masthead">
        <div className="masthead-inner">
          {/* Mobile menu button — hidden on desktop via CSS */}
          <button
            onClick={onMenuToggle}
            className="masthead-btn masthead-mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Left: Date & Edition — hidden on mobile via CSS */}
          <div className="masthead-left">
            <div>
              <div className="masthead-date">{dateStr}</div>
              <div className="masthead-edition">
                Vol. I &middot; No. {dayOfYear}
              </div>
            </div>
          </div>

          {/* Center: Brand */}
          <div className="masthead-brand">
            <Link href="/">
              <h1 className="masthead-title">CFB SOCIAL</h1>
            </Link>
            <div className="masthead-subtitle">
              College Football&apos;s Social Home &mdash; Est. 2026
            </div>
          </div>

          {/* Right: Actions */}
          <div className="masthead-actions">
            <ThemeToggle />
            <button className="masthead-btn" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            {isLoggedIn === true ? (
              <>
                <NotificationBell />
                {username ? (
                  <Link href={`/profile/${username}`} className="masthead-profile">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={username} className="masthead-profile-img" />
                    ) : (
                      username[0]?.toUpperCase()
                    )}
                  </Link>
                ) : (
                  <Link href="/settings" className="masthead-profile">
                    ?
                  </Link>
                )}
              </>
            ) : isLoggedIn === false ? (
              <>
                <Link href="/login" className="masthead-auth-link">
                  Log In
                </Link>
                <Link href="/register" className="masthead-auth-btn">
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}
