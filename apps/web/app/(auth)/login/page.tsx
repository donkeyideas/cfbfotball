import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Sign In to Your Account',
  description: 'Sign in to CFB Social to post takes, debate rivalries, file predictions, and track the transfer portal across 653 college football schools.',
  openGraph: {
    title: 'Sign In | CFB Social',
    description: 'Sign in to the college football fan community.',
    images: [{ url: 'https://www.cfbsocial.com/logo.png', width: 256, height: 256, alt: 'CFB Social Logo' }],
  },
  alternates: {
    canonical: 'https://www.cfbsocial.com/login',
  },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
