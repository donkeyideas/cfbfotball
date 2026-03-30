import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/ui/Avatar';
import { SchoolBadge } from '@/components/ui/SchoolBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface LeaderboardEntry {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  correct_predictions: number;
  prediction_count: number;
  school: {
    abbreviation: string;
    primary_color: string;
    slug: string | null;
  } | null;
}

export function PredictionLeaderboard() {
  const colors = useColors();
  const router = useRouter();
  const { dark } = useSchoolTheme();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    listContent: {
      padding: 16,
      gap: 8,
      paddingBottom: 80,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
    },
    topRow: {
      borderColor: colors.secondary,
    },
    rank: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      width: 28,
      textAlign: 'center',
    },
    info: {
      flex: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    name: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textPrimary,
      flexShrink: 1,
    },
    stats: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: 0.3,
    },
  }), [colors]);

  const fetchLeaderboard = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, correct_predictions, prediction_count, school:schools!profiles_school_id_fkey(abbreviation, primary_color, slug)')
      .gt('prediction_count', 0)
      .order('correct_predictions', { ascending: false })
      .limit(25);

    if (!error && data) {
      setEntries(data as unknown as LeaderboardEntry[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={dark} />
      </View>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return colors.secondary;
    if (rank <= 3) return dark;
    return colors.textMuted;
  };

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const winRate = item.prediction_count > 0
      ? Math.round((item.correct_predictions / item.prediction_count) * 100)
      : 0;

    return (
      <Pressable
        style={[styles.row, rank <= 3 && styles.topRow]}
        onPress={() => {
          if (item.username) {
            router.push(`/profile/${item.username}` as never);
          }
        }}
      >
        <Text style={[styles.rank, { color: getRankColor(rank) }]}>
          {rank}
        </Text>
        <Avatar
          url={item.avatar_url}
          name={item.display_name || item.username}
          size={36}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.display_name || item.username || 'Anonymous'}
            </Text>
            {item.school && (
              <SchoolBadge
                abbreviation={item.school.abbreviation}
                color={item.school.primary_color}
                slug={item.school.slug}
                small
              />
            )}
          </View>
          <Text style={styles.stats}>
            {item.correct_predictions}/{item.prediction_count} -- {winRate}% win rate
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={dark}
        />
      }
      ListEmptyComponent={
        <EmptyState
          title="No predictions yet"
          subtitle="Be the first to put your take on the record."
        />
      }
    />
  );
}
