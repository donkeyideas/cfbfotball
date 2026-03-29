'use client';

import { useState } from 'react';
import { ProfileEditModal } from './ProfileEditModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface ProfileEditButtonProps {
  profileUserId: string;
}

export function ProfileEditButton({ profileUserId }: ProfileEditButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { refreshProfile } = useAuth();

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="profile-edit-trigger"
      >
        Edit Profile
      </button>
      {showModal && (
        <ProfileEditModal
          userId={profileUserId}
          onClose={() => setShowModal(false)}
          onSaved={async (newUsername: string) => {
            setShowModal(false);
            await refreshProfile();
            router.push(`/profile/${newUsername}`);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
