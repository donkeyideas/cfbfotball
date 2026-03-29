'use client';

import { useState } from 'react';
import { Masthead } from '@/components/layout/Masthead';
import { ScoresRibbon } from '@/components/layout/ScoresRibbon';
import { Footer } from '@/components/layout/Footer';
import { CorkboardNav } from '@/components/layout/CorkboardNav';
import { DynastyTicket } from '@/components/layout/DynastyTicket';
import { FeaturesBreakdown } from '@/components/layout/FeaturesBreakdown';
import { PressBoxSidebar } from '@/components/layout/PressBoxSidebar';
import { SchoolThemeProvider } from '@/components/layout/SchoolThemeProvider';
import { AuthCtaBanner } from '@/components/layout/AuthCtaBanner';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <SchoolThemeProvider>
        <div className="min-h-screen">
          <Masthead
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            menuOpen={mobileMenuOpen}
          />
          <ScoresRibbon />

          <main className="main-layout">
            {/* Left Column — Bulletin Board */}
            <aside className="col-left">
              <CorkboardNav />
              <DynastyTicket />
              <FeaturesBreakdown />
            </aside>

            {/* Center Column — Feed / Content */}
            <div className="col-center">
              {children}
            </div>

            {/* Right Column — Press Box */}
            <aside className="col-right">
              <PressBoxSidebar />
            </aside>
          </main>

          <Footer />
          <AuthCtaBanner />

          {/* Mobile sidebar overlay */}
          {mobileMenuOpen && (
            <div className="mobile-sidebar-overlay lg:hidden">
              <div
                className="mobile-sidebar-backdrop"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="mobile-sidebar-panel">
                <CorkboardNav onNavigate={() => setMobileMenuOpen(false)} />
                <DynastyTicket />
              </div>
            </div>
          )}
        </div>
      </SchoolThemeProvider>
    </AuthProvider>
  );
}
