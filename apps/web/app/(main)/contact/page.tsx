import { ContactForm } from './ContactForm';

export const metadata = {
  title: 'Contact Us | CFB Social',
  description: 'Get in touch with CFB Social. Report bugs, request features, ask questions, or explore partnership opportunities.',
  openGraph: {
    title: 'Contact Us | CFB Social',
    description: 'Get in touch with CFB Social. Report bugs, request features, ask questions, or explore partnership opportunities.',
  },
  alternates: {
    canonical: 'https://www.cfbsocial.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Contact Us</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: 'var(--faded-ink)', marginTop: 4 }}>
          Have a question, found a bug, or want to partner with CFB Social? Drop us a line.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
