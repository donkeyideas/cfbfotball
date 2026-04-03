import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Child Safety Standards | CFB Social",
  description:
    "Child safety standards and policies for CFB Social college football social platform.",
};

export default function ChildSafetyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "Georgia, serif",
        color: "#1a1a1a",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Child Safety Standards</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Last updated: April 1, 2026
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Our Commitment</h2>
        <p>
          CFB Social is a college football social platform designed for adult
          sports fans. We are committed to preventing child sexual abuse and
          exploitation (CSAE) on our platform and maintaining a safe environment
          for all users.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Age Requirement
        </h2>
        <p>
          CFB Social is intended for users aged 17 and older. We do not
          knowingly collect personal information from children under 17. If we
          become aware that a user is under 17, their account will be
          immediately suspended and removed.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Prohibited Content
        </h2>
        <p>
          We have zero tolerance for any content that sexually exploits or
          endangers children. This includes but is not limited to:
        </p>
        <ul style={{ paddingLeft: 24, marginTop: 12 }}>
          <li>
            Child sexual abuse material (CSAM) in any form, including AI-generated
          </li>
          <li>Grooming or solicitation of minors</li>
          <li>Sexualized content involving minors</li>
          <li>Sextortion or trafficking of minors</li>
          <li>
            Any content that promotes, normalizes, or glorifies abuse of children
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Detection and Enforcement
        </h2>
        <p>
          We use a combination of automated AI moderation and human review to
          detect and remove prohibited content. All flagged content is reviewed
          promptly. Accounts found to violate these standards are permanently
          banned and reported to the appropriate authorities.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Reporting</h2>
        <p>
          Users can report content that violates our child safety standards
          directly within the app using the FLAG button on any post. Reports are
          reviewed by our moderation team.
        </p>
        <p style={{ marginTop: 12 }}>
          You can also report concerns by contacting us at{" "}
          <a href="mailto:info@donkeyideas.com" style={{ color: "#8B0000" }}>
            info@donkeyideas.com
          </a>
          .
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          Cooperation with Authorities
        </h2>
        <p>
          We comply with all relevant child safety laws and report to regional
          and national authorities, including NCMEC (National Center for Missing
          &amp; Exploited Children), when we identify potential CSAM or child
          exploitation on our platform.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Contact</h2>
        <p>
          For questions about our child safety standards, contact us at{" "}
          <a href="mailto:info@donkeyideas.com" style={{ color: "#8B0000" }}>
            info@donkeyideas.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
