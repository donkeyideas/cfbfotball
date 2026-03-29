import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  xp: number;
  dynasty_tier: string | null;
  followers_count: number;
  following_count: number;
  school: {
    name: string;
    abbreviation: string;
    primary_color: string;
    secondary_color: string;
  } | null;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, username, display_name, bio, xp, dynasty_tier,
        followers_count, following_count,
        school:schools!profiles_school_id_fkey(
          name, abbreviation, primary_color, secondary_color
        )
      `)
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setProfile(data as unknown as UserProfile);
    }
    setLoading(false);
    setRefreshing(false);
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function onRefresh() {
    setRefreshing(true);
    fetchProfile();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Unable to load profile</Text>
      </View>
    );
  }

  const displayName = profile.display_name ?? profile.username;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.crimson}
        />
      }
    >
      {/* School color banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: profile.school?.primary_color ?? colors.crimson },
        ]}
      />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: profile.school?.primary_color ?? colors.crimson },
          ]}
        >
          <Text style={styles.avatarText}>{displayName[0]}</Text>
        </View>
      </View>

      {/* Name and info */}
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{profile.username}</Text>

        {profile.school && (
          <Text
            style={[styles.schoolName, { color: profile.school.primary_color }]}
          >
            {profile.school.name}
          </Text>
        )}

        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.xp ?? 0}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.followers_count ?? 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.following_count ?? 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Dynasty tier */}
        {profile.dynasty_tier && (
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>
              {profile.dynasty_tier.replace('_', ' ')}
            </Text>
          </View>
        )}

        {/* Settings button */}
        <Pressable
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsButtonText}>Edit Settings</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  emptyTitle: {
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.textSecondary,
  },
  banner: {
    height: 100,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: -40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.paper,
  },
  avatarText: {
    fontFamily: typography.serifBold,
    fontSize: 32,
    color: '#ffffff',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  displayName: {
    fontFamily: typography.serifBold,
    fontSize: 24,
    color: colors.ink,
  },
  username: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  schoolName: {
    fontFamily: typography.sansSemiBold,
    fontSize: 14,
    marginTop: 8,
  },
  bio: {
    fontFamily: typography.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontFamily: typography.sansBold,
    fontSize: 16,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.secondary}30`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  tierText: {
    fontFamily: typography.mono,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  settingsButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
});
