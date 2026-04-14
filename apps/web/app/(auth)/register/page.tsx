import { Suspense } from 'react';
import { RegisterForm } from './RegisterForm';

export const metadata = {
  title: 'Create Your Account',
  description: 'Join CFB Social for free. Pick your school and start debating college football, filing predictions, and building your fan dynasty.',
  openGraph: {
    title: 'Create Your Account | CFB Social',
    description: 'Join the college football fan community for free.',
    images: [{ url: 'https://www.cfbsocial.com/logo.png', width: 256, height: 256, alt: 'CFB Social Logo' }],
  },
  alternates: {
    canonical: 'https://www.cfbsocial.com/register',
  },
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
