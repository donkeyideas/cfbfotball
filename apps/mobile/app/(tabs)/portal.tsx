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

interface PortalPlayer {
  id: string;
  name: string;
  position: string;
  status: string;
  entered_portal_at: string;
  origin_school: { abbreviation: string; primary_color: string } | null;
  destination_school: { abbreviation: string; primary_color: string } | null;
}

export default function PortalScreen() {
  const [players, setPlayers] = useState<PortalPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlayers = useCallback(async () => {
    const { data, error } = await supabase
      .from('portal_players')
      .select(`
        id, name, position, status, entered_portal_at,
        origin_school:schools!portal_players_origin_school_id_fkey(abbreviation, primary_color),
        destination_school:schools!portal_players_destination_school_id_fkey(abbreviation, primary_color)
      `)
      .order('entered_portal_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      setPlayers(data as unknown as PortalPlayer[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  function onRefresh() {
    setRefreshing(true);
    fetchPlayers();
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'COMMITTED':
        return { bg: `${colors.success}20`, text: colors.success };
      case 'WITHDRAWN':
        return { bg: `${colors.textMuted}20`, text: colors.textMuted };
      default:
        return { bg: `${colors.warning}20`, text: colors.warning };
    }
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
        Transfer Portal War Room. Track entries, predict commitments, claim your sources.
      </Text>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.crimson}
          />
        }
        renderItem={({ item }) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor:
                        item.origin_school?.primary_color ?? colors.crimson,
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{item.name}</Text>
                  <Text style={styles.playerDetails}>
                    {item.position} &middot;{' '}
                    {item.origin_school?.abbreviation ?? 'Unknown'}
                    {item.destination_school && ` \u2192 ${item.destination_school.abbreviation}`}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No portal activity</Text>
            <Text style={styles.emptySubtitle}>
              Check back when the transfer window opens.
            </Text>
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
    gap: 8,
  },
  card: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.serifBold,
    fontSize: 18,
    color: '#ffffff',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: typography.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  playerDetails: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
