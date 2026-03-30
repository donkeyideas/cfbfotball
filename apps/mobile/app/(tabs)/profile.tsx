import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { AuthGate } from '@/components/ui/AuthGate';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useColors } from '@/lib/theme/ThemeProvider';

export default function ProfileTab() {
  const colors = useColors();
  const router = useRouter();
  const { session, loading, profile } = useAuth();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.paper,
    },
  }), [colors]);

  useEffect(() => {
    if (!loading && session && profile?.username) {
      router.replace(`/profile/${profile.username}` as never);
    }
  }, [loading, session, profile?.username, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <AuthGate message="Sign in to view your profile" />
      </View>
    );
  }

  // While redirecting, show loading
  return <LoadingScreen />;
}
