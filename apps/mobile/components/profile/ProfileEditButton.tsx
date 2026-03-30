import { useState, useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { ProfileEditModal } from './ProfileEditModal';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface ProfileEditButtonProps {
  onSaved?: () => void;
}

export function ProfileEditButton({ onSaved }: ProfileEditButtonProps) {
  const colors = useColors();
  const [visible, setVisible] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    button: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.ink,
    },
  }), [colors]);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
      <ProfileEditModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSaved={() => {
          setVisible(false);
          onSaved?.();
        }}
      />
    </>
  );
}
