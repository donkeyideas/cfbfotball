import { Suspense } from 'react';
import { EditProfileClient } from './EditProfileClient';

export const dynamic = 'force-dynamic';

export default function EditProfilePage() {
  return (
    <Suspense>
      <EditProfileClient />
    </Suspense>
  );
}
