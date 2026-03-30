import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { FloatingNotepad } from '@/components/widgets/floating-notepad';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <AdminHeader />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>{children}</main>
      </div>
      <FloatingNotepad />
    </div>
  );
}
