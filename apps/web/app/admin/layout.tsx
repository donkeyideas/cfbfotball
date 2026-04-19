import './admin.css';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { FloatingNotepad } from '@/components/admin/widgets/floating-notepad';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: 'CFB Social Admin',
    template: '%s | CFB Social Admin',
  },
  description: 'Administration dashboard for CFB Social',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      {/* Inline script to apply dark class before paint, preventing flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{if(localStorage.getItem('cfb-admin-theme')!=='light'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
        }}
      />
      <div style={{ display: 'flex', minHeight: '100vh', maxWidth: '100vw' }}>
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main area */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100vh', position: 'sticky', top: 0 }}>
          <AdminHeader />
          <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <Suspense>{children}</Suspense>
          </main>
        </div>
        <FloatingNotepad />
      </div>
    </div>
  );
}
