import { DeleteAccountForm } from './DeleteAccountForm';

export const metadata = {
  title: 'Delete Account | CFB Social',
  description: 'Permanently delete your CFB Social account and associated data.',
  openGraph: {
    title: 'Delete Account | CFB Social',
    description: 'Permanently delete your CFB Social account and associated data.',
  },
  alternates: {
    canonical: 'https://cfbsocial.com/delete-account',
  },
};

export default function DeleteAccountPage() {
  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Delete Account</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: 'var(--faded-ink)', marginTop: 4 }}>
          Permanently remove your account and personal data.
        </p>
      </div>

      <DeleteAccountForm />
    </div>
  );
}
