import Link from 'next/link';

const EFFECTIVE_DATE = 'March 29, 2026';
const CONTACT_EMAIL = 'info@donkeyideas.com';

export const metadata = {
  title: 'Privacy Policy | CFB Social',
  description: 'Privacy Policy for CFB Social (CFB Social), operated by Donkey Ideas. Learn how we collect, use, and protect your information.',
  openGraph: {
    title: 'Privacy Policy | CFB Social',
    description: 'Privacy Policy for CFB Social (CFB Social), operated by Donkey Ideas.',
  },
  alternates: {
    canonical: 'https://www.cfbsocial.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Privacy Policy</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--faded-ink)', marginTop: 4, letterSpacing: '0.5px' }}>
          Effective Date: {EFFECTIVE_DATE}
        </p>
      </div>

      <div className="content-card" style={{ padding: '28px 32px' }}>
        <p style={bodyStyle}>
          CFB Social (&quot;CFB Social,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is operated by Donkey Ideas. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services.
        </p>

        <h2 style={headingStyle}>1. Information We Collect</h2>

        <h3 style={subheadingStyle}>Account Information</h3>
        <p style={bodyStyle}>
          When you create an account, we collect your email address, username, display name, and school affiliation. If you sign in with Google or Apple, we receive your name and email from those providers.
        </p>

        <h3 style={subheadingStyle}>Profile Information</h3>
        <p style={bodyStyle}>
          You may optionally provide a profile photo, bio, and banner image. This information is publicly visible to other users.
        </p>

        <h3 style={subheadingStyle}>User Content</h3>
        <p style={bodyStyle}>
          We collect posts, replies, predictions, votes, and other content you create on the platform. This content is publicly visible unless removed by moderation.
        </p>

        <h3 style={subheadingStyle}>Usage Data</h3>
        <p style={bodyStyle}>
          We automatically collect device type, browser, operating system, and general usage patterns to improve the experience.
        </p>

        <h3 style={subheadingStyle}>Push Notification Tokens</h3>
        <p style={bodyStyle}>
          If you enable push notifications on the mobile app, we store your device push token to deliver notifications. You can disable notifications at any time in Settings.
        </p>

        <h2 style={headingStyle}>2. How We Use Your Information</h2>
        <p style={bodyStyle}>We use the information we collect to:</p>
        <ul style={listStyle}>
          <li>Provide, operate, and maintain the platform</li>
          <li>Create and manage your account</li>
          <li>Display your profile and content to other users</li>
          <li>Send push notifications (with your consent)</li>
          <li>Moderate content and enforce community guidelines</li>
          <li>Calculate dynasty rankings, XP, and achievements</li>
          <li>Improve the platform and develop new features</li>
          <li>Respond to support requests and inquiries</li>
        </ul>

        <h2 style={headingStyle}>3. How We Share Your Information</h2>
        <p style={bodyStyle}>
          We do not sell your personal information. We may share information in the following circumstances:
        </p>
        <ul style={listStyle}>
          <li><strong>Public content:</strong> Posts, profiles, and votes are publicly visible</li>
          <li><strong>Service providers:</strong> We use Supabase for data storage and authentication, and Expo for push notifications</li>
          <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights</li>
          <li><strong>With your consent:</strong> We may share information with your explicit permission</li>
        </ul>

        <h2 style={headingStyle}>4. Data Storage and Security</h2>
        <p style={bodyStyle}>
          Your data is stored securely using Supabase (powered by PostgreSQL) with row-level security policies. Authentication tokens are stored securely on your device. We use industry-standard security measures to protect your information, but no method of transmission over the internet is 100% secure.
        </p>

        <h2 style={headingStyle}>5. Your Rights and Choices</h2>
        <p style={bodyStyle}>You have the right to:</p>
        <ul style={listStyle}>
          <li>Access and update your profile information in Settings</li>
          <li>Delete your account and associated data</li>
          <li>Disable push notifications</li>
          <li>Control notification preferences</li>
          <li>Request a copy of your data by contacting us</li>
        </ul>

        <h2 style={headingStyle}>6. Account Deletion</h2>
        <p style={bodyStyle}>
          You can delete your account at any time from the <Link href="/delete-account" style={{ color: 'var(--crimson)', textDecoration: 'underline' }}>Account Deletion</Link> page. When you delete your account, we will delete your profile and personal information and disassociate your content. Some anonymized content may remain for the integrity of community discussions. Account deletion is permanent and cannot be undone.
        </p>

        <h2 style={headingStyle}>7. Children&apos;s Privacy</h2>
        <p style={bodyStyle}>
          CFB Social is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete it promptly.
        </p>

        <h2 style={headingStyle}>8. Third-Party Services</h2>
        <p style={bodyStyle}>Our platform integrates with the following third-party services:</p>
        <ul style={listStyle}>
          <li>Supabase (authentication and data storage)</li>
          <li>Google Sign-In (optional authentication)</li>
          <li>Apple Sign-In (optional authentication)</li>
          <li>ESPN (public sports data for live scores)</li>
          <li>Expo (push notifications and mobile app infrastructure)</li>
        </ul>
        <p style={bodyStyle}>Each service has its own privacy policy governing how they handle your data.</p>

        <h2 style={headingStyle}>9. Changes to This Policy</h2>
        <p style={bodyStyle}>
          We may update this Privacy Policy from time to time. We will notify you of significant changes through the platform or via email. Continued use of CFB Social after changes constitutes acceptance of the updated policy.
        </p>

        <h2 style={headingStyle}>10. Contact Us</h2>
        <p style={bodyStyle}>
          If you have questions about this Privacy Policy or your data, contact us at:
        </p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.88rem', color: 'var(--crimson)', marginBottom: 8 }}>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--crimson)', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
        </p>

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--faded-ink)', letterSpacing: '0.5px', lineHeight: 1.8 }}>
            Donkey Ideas<br />CFB Social / CFB Social
          </p>
        </div>
      </div>
    </div>
  );
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '1.15rem',
  fontWeight: 700,
  color: 'var(--ink)',
  marginTop: 28,
  marginBottom: 8,
};

const subheadingStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--ink)',
  marginTop: 14,
  marginBottom: 4,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '0.88rem',
  lineHeight: 1.7,
  color: 'var(--faded-ink)',
  marginBottom: 8,
};

const listStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '0.88rem',
  lineHeight: 1.8,
  color: 'var(--faded-ink)',
  marginBottom: 8,
  paddingLeft: 20,
};
