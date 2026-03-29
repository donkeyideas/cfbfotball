import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

export default function SplashScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/(tabs)/feed');
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>The Gridiron</Text>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top ornament */}
      <Text style={styles.ornament}>EST. 2026</Text>

      {/* Main title */}
      <Text style={styles.title}>The Gridiron</Text>
      <Text style={styles.subtitle}>COLLEGE FOOTBALL SOCIAL</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Tagline */}
      <Text style={styles.tagline}>
        Stake your claims. Call your shots.{'\n'}Build your dynasty.
      </Text>

      {/* CTA buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.primaryButtonText}>Enter The Gridiron</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </Pressable>
      </View>

      {/* Bottom ornament */}
      <Text style={styles.ornament}>WHERE RECEIPTS ARE KEPT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    paddingHorizontal: 32,
  },
  ornament: {
    fontFamily: typography.mono,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: typography.serifBold,
    fontSize: 48,
    color: colors.ink,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.mono,
    fontSize: 12,
    letterSpacing: 4,
    color: colors.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  divider: {
    width: 120,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  tagline: {
    fontFamily: typography.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loading: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.crimson,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: typography.sansBold,
    fontSize: 16,
    color: '#ffffff',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 16,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
});
