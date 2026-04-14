export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-ink">CFB Social</h1>
          <hr className="gridiron-divider mx-auto mt-3 w-24" />
        </div>

        {/* Auth card */}
        <div className="gridiron-card p-8">{children}</div>

        {/* SEO FAQ section */}
        <div className="footer-faq" style={{ marginTop: 32 }}>
          <h2 className="footer-faq-heading">Why join CFB Social?</h2>
          <ul className="footer-faq-list">
            <li>Post takes and debate college football across 653 schools</li>
            <li>File predictions and earn receipts when you are right</li>
            <li>Track the transfer portal and claim recruits for your school</li>
            <li>Build your fan dynasty and climb the leaderboard</li>
          </ul>
          <h3 className="footer-faq-heading">Is CFB Social free?</h3>
          <p className="footer-faq-text">Yes, CFB Social is completely free. Sign up, pick your school, and start engaging with the college football community.</p>
        </div>
      </div>
    </div>
  );
}
