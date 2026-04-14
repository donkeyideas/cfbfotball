import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-ornament">&diams;</div>
      <p>
        CFB SOCIAL &mdash; College Football&apos;s Social Home &mdash; Est. 2026
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
        {[
          { href: '/schools', label: 'All Schools' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
          { href: '/contact', label: 'Contact' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--faded-ink)',
              textDecoration: 'none',
              letterSpacing: '0.3px',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', lineHeight: 1.5, color: 'var(--faded-ink)', margin: '10px auto 0', padding: '0 16px' }}>
        The college football fan community. Debate rivalries, file predictions, track the transfer portal, and build your dynasty across 653 schools. The best place for CFB fan debates, college football takes, and real-time fan reactions.
      </p>

      {/* SEO FAQ section — provides question headings + lists for AEO */}
      <div className="footer-faq">
        <h2 className="footer-faq-heading">What is CFB Social?</h2>
        <p className="footer-faq-text">
          CFB Social is the college football fan community where you debate rivalries, file predictions, track the transfer portal, and build your dynasty across all 653 schools.
        </p>
        <h3 className="footer-faq-heading">What can you do on CFB Social?</h3>
        <ul className="footer-faq-list">
          <li>Post takes and debate college football in the Feed</li>
          <li>Challenge rival fan bases in the Rivalry Ring</li>
          <li>Track every transfer portal move on Portal Wire</li>
          <li>File predictions and collect receipts or busts</li>
          <li>Vote in Mascot Wars bracket tournaments</li>
          <li>Build your fan dynasty and climb the leaderboard</li>
        </ul>
        <h3 className="footer-faq-heading">How do you join the conversation?</h3>
        <ul className="footer-faq-list">
          <li>Create a free account and pick your school</li>
          <li>Start posting takes and voting on debates</li>
          <li>Earn XP, unlock achievements, and rise through dynasty tiers</li>
        </ul>
      </div>
    </footer>
  );
}
