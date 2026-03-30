import { MainShell } from './MainShell';

export const dynamic = 'force-dynamic';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainShell>{children}</MainShell>;
}
