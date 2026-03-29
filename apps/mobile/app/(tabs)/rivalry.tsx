import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

interface Challenge {
  id: string;
  topic: string;
  status: string;
  created_at: string;
  challenger: { username: string; display_name: string | null } | null;
  challenged: { username: string; display_name: string | null } | null;
}

export default function RivalryScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChallenges = useCallback(async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        id, topic, status, created_at,
        challenger:users!challenges_challenger_id_fkey(username, display_name),
        challenged:users!challenges_challenged_id_fkey(username, display_name)
      `)
      .in('status', ['ACTIVE', 'VOTING'])
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setChallenges(data as unknown as Challenge[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  function onRefresh() {
    setRefreshing(true);
    fetchChallenges();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Challenge rival fans to head-to-head debates. Put your record on the line.
      </Text>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.crimson}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.topic}>{item.topic}</Text>
            <Text style={styles.participants}>
              {item.challenger?.display_name ?? item.challenger?.username} vs{' '}
              {item.challenged?.display_name ?? item.challenged?.username}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No active rivalries</Text>
            <Text style={styles.emptySubtitle}>Be the first to throw down a challenge.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  description: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  topic: {
    fontFamily: typography.serifBold,
    fontSize: 18,
    color: colors.ink,
  },
  participants: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: typography.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontFamily: typography.serif,
    fontSize: 20,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});
