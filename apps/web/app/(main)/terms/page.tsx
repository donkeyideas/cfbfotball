import Link from 'next/link';

const EFFECTIVE_DATE = 'March 29, 2026';
const CONTACT_EMAIL = 'info@donkeyideas.com';

export const metadata = {
  title: 'Terms of Service | CFB Social',
  description: 'Terms of Service for CFB Social (CFB Social), operated by Donkey Ideas. Read our terms before using the platform.',
  openGraph: {
    title: 'Terms of Service | CFB Social',
    description: 'Terms of Service for CFB Social (CFB Social), operated by Donkey Ideas.',
  },
};

export default function TermsOfServicePage() {
  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Terms of Service</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--faded-ink)', marginTop: 4, letterSpacing: '0.5px' }}>
          Effective Date: {EFFECTIVE_DATE}
        </p>
      </div>

      <div className="content-card" style={{ padding: '28px 32px' }}>
        <p style={bodyStyle}>
          Welcome to CFB Social (&quot;CFB Social&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of the CFB Social website, mobile application, and related services operated by Donkey Ideas (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an account or using the platform, you agree to these Terms.
        </p>

        <h2 style={headingStyle}>1. Eligibility</h2>
        <p style={bodyStyle}>
          You must be at least 13 years old to use CFB Social. By using the platform, you represent that you meet this age requirement. If you are under 18, you represent that you have parental or guardian consent to use the platform.
        </p>

        <h2 style={headingStyle}>2. Account Registration</h2>
        <p style={bodyStyle}>To access certain features, you must create an account. You agree to:</p>
        <ul style={listStyle}>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized access</li>
          <li>Accept responsibility for all activity under your account</li>
        </ul>
        <p style={bodyStyle}>
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>

        <h2 style={headingStyle}>3. User Content</h2>
        <p style={bodyStyle}>
          You retain ownership of the content you post on CFB Social. By posting content, you grant us a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content within the platform and related marketing materials.
        </p>
        <p style={bodyStyle}>You are solely responsible for your content and agree not to post content that:</p>
        <ul style={listStyle}>
          <li>Is illegal, threatening, harassing, or defamatory</li>
          <li>Contains hate speech or discrimination</li>
          <li>Infringes on intellectual property rights</li>
          <li>Contains spam, malware, or phishing attempts</li>
          <li>Includes personal information of others without consent</li>
          <li>Violates our Community Guidelines</li>
        </ul>

        <h2 style={headingStyle}>4. Community Guidelines</h2>
        <p style={bodyStyle}>CFB Social is a college football discussion community. We expect users to:</p>
        <ul style={listStyle}>
          <li>Keep discussions related to college football</li>
          <li>Respect other users and their opinions</li>
          <li>Avoid political, religious, or off-topic inflammatory content</li>
          <li>Not harass, bully, or target individual users</li>
          <li>Not impersonate other users, athletes, coaches, or public figures</li>
          <li>Report content that violates these guidelines</li>
        </ul>

        <h2 style={headingStyle}>5. Moderation</h2>
        <p style={bodyStyle}>
          We reserve the right to moderate, flag, or remove content that violates these Terms or Community Guidelines. Moderation actions include:
        </p>
        <ul style={listStyle}>
          <li>Content flagging and review</li>
          <li>Content removal</li>
          <li>Account suspension (temporary or permanent)</li>
        </ul>
        <p style={bodyStyle}>
          Users may appeal moderation decisions through the in-app appeal process. Appeal decisions are final.
        </p>

        <h2 style={headingStyle}>6. Dynasty Mode and Gamification</h2>
        <p style={bodyStyle}>
          CFB Social includes gamification features such as XP, levels, dynasty tiers, and achievements. These are virtual elements with no monetary value. We reserve the right to modify the gamification system, including XP values, tier requirements, and achievements, at any time.
        </p>

        <h2 style={headingStyle}>7. Intellectual Property</h2>
        <p style={bodyStyle}>
          The CFB Social platform, including its design, features, and branding (&quot;CFB Social&quot;), is the property of Donkey Ideas. You may not copy, modify, distribute, or reverse-engineer any part of the platform without our written permission.
        </p>
        <p style={bodyStyle}>
          College football team names, logos, and related marks are the property of their respective institutions and conferences. CFB Social is not affiliated with, endorsed by, or sponsored by the NCAA, any conference, or any university.
        </p>

        <h2 style={headingStyle}>8. Third-Party Services</h2>
        <p style={bodyStyle}>
          CFB Social integrates with third-party services including Google, Apple, ESPN, and Supabase. Your use of these services is subject to their respective terms and privacy policies. We are not responsible for third-party service availability or content.
        </p>

        <h2 style={headingStyle}>9. Disclaimers</h2>
        <p style={bodyStyle}>CFB Social is provided &quot;as is&quot; without warranties of any kind. We do not guarantee:</p>
        <ul style={listStyle}>
          <li>Uninterrupted or error-free service</li>
          <li>Accuracy of live scores or sports data</li>
          <li>Accuracy of user-generated predictions or takes</li>
          <li>Availability of specific features</li>
        </ul>
        <p style={bodyStyle}>
          CFB Social is for entertainment purposes only. No content on the platform constitutes professional advice.
        </p>

        <h2 style={headingStyle}>10. Limitation of Liability</h2>
        <p style={bodyStyle}>
          To the maximum extent permitted by law, Donkey Ideas shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to loss of data, loss of profits, or interruption of service.
        </p>

        <h2 style={headingStyle}>11. Account Termination</h2>
        <p style={bodyStyle}>
          You may delete your account at any time from the <Link href="/delete-account" style={{ color: 'var(--crimson)', textDecoration: 'underline' }}>Account Deletion</Link> page. We may suspend or terminate your account for violations of these Terms. Upon termination, your right to use the platform ceases immediately.
        </p>

        <h2 style={headingStyle}>12. Changes to These Terms</h2>
        <p style={bodyStyle}>
          We may update these Terms from time to time. We will notify you of material changes through the platform. Continued use after changes constitutes acceptance of the updated Terms.
        </p>

        <h2 style={headingStyle}>13. Governing Law</h2>
        <p style={bodyStyle}>
          These Terms are governed by the laws of the United States. Any disputes arising from these Terms shall be resolved through binding arbitration.
        </p>

        <h2 style={headingStyle}>14. Contact Us</h2>
        <p style={bodyStyle}>
          If you have questions about these Terms of Service, contact us at:
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
