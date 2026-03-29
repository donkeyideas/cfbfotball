'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Swords, ArrowRightLeft, Trophy, Settings } from 'lucide-react';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/rivalry', label: 'Rivalry Ring', icon: Swords },
  { href: '/portal', label: 'Portal Wire', icon: ArrowRightLeft },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[var(--school-primary)]/10 text-[var(--school-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-ink'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Hall of Fame - special styling */}
      <hr className="gridiron-divider my-2" />
      <Link
        href="/profile"
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          pathname.startsWith('/profile')
            ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-ink'
        }`}
      >
        <Trophy className="h-5 w-5 shrink-0" />
        <span>Hall of Fame</span>
      </Link>
    </nav>
  );
}
