'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Users,
  FileText,
  TrendingUp,
  GraduationCap,
  Activity,
  Flag,
  Server,
  Download,
  Settings,
  Globe,
} from 'lucide-react';

const navSections = [
  {
    label: 'Analytics',
    items: [
      { href: '/', label: 'Overview', icon: LayoutDashboard },
      { href: '/engagement', label: 'Engagement', icon: TrendingUp },
      { href: '/content', label: 'Content', icon: FileText },
      { href: '/schools', label: 'Schools', icon: GraduationCap },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/moderation', label: 'Moderation', icon: Shield },
      { href: '/users', label: 'Users', icon: Users },
      { href: '/reports', label: 'Reports', icon: Flag },
      { href: '/portal', label: 'Portal', icon: Globe },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/realtime', label: 'Real-time', icon: Activity },
      { href: '/system', label: 'System', icon: Server },
      { href: '/exports', label: 'Exports', icon: Download },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[var(--admin-border)] bg-[var(--admin-surface)]">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[var(--admin-accent)]" />
          <span className="text-lg font-bold text-[var(--admin-text)]">
            CFB Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-[var(--admin-accent)]/10 text-[var(--admin-accent-light)]'
                        : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] hover:text-[var(--admin-text)]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
