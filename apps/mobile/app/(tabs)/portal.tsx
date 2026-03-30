import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { AppHeader } from '@/components/navigation/AppHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { PortalTicker } from '@/components/portal/PortalTicker';
import {
  PortalFilters,
  statusToDb,
  starToDb,
  type PortalFilterState,
} from '@/components/portal/PortalFilters';
import { PortalCard, type PortalPlayerData } from '@/components/portal/PortalCard';
import { ClaimModal } from '@/components/portal/ClaimModal';
import { useColors } from '@/lib/theme/ThemeProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';

const PORTAL_SELECT = `
  *,
  previous_school:schools!portal_players_previous_school_id_fkey(id, name, abbreviation, primary_color, slug),
  committed_school:schools!portal_players_committed_school_id_fkey(id, name, abbreviation, primary_color, slug)
`;

const PAGE_SIZE = 20;

export default function PortalScreen() {
  const colors = useColors();
  const { dark } = useSchoolTheme();
  const [players, setPlayers] = useState<PortalPlayerData[]>([]);
  const [tickerEntries, setTickerEntries] = useState<
    { id: string; name: string; position: string; status: string | null; previous_school_name: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<PortalFilterState>({
    status: 'All',
    position: 'All',
    stars: 'All',
  });
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimTarget, setClaimTarget] = useState<PortalPlayerData | null>(null);

  const offsetRef = useRef(0);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.paper,
    },
    listContent: {
      padding: 16,
      gap: 12,
      paddingBottom: 40,
    },
  }), [colors]);

  // ---------------------------------------------------------------
  // Fetch ticker entries (latest 15)
  // ---------------------------------------------------------------
  const fetchTicker = useCallback(async () => {
    const { data } = await supabase
      .from('portal_players')
      .select('id, name, position, status, previous_school_name')
      .order('created_at', { ascending: false })
      .limit(15);
    if (data) {
      setTickerEntries(data as typeof tickerEntries);
    }
  }, []);

  // ---------------------------------------------------------------
  // Build query with filters
  // ---------------------------------------------------------------
  const buildQuery = useCallback(
    (offset: number) => {
      let query = supabase
        .from('portal_players')
        .select(PORTAL_SELECT)
        .order('created_at', { ascending: false });

      // Status filter
      const dbStatus = statusToDb(filters.status);
      if (dbStatus !== 'All') {
        query = query.eq('status', dbStatus);
      }

      // Position filter
      if (filters.position !== 'All') {
        query = query.eq('position', filters.position);
      }

      // Star filter
      const dbStars = starToDb(filters.stars);
      if (dbStars !== 'All') {
        query = query.eq('star_rating', parseInt(dbStars, 10));
      }

      query = query.range(offset, offset + PAGE_SIZE - 1);
      return query;
    },
    [filters]
  );

  // ---------------------------------------------------------------
  // Fetch players
  // ---------------------------------------------------------------
  const fetchPlayers = useCallback(
    async (reset = true) => {
      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      }

      const { data, error } = await buildQuery(offsetRef.current);

      if (!error && data) {
        const typed = data as unknown as PortalPlayerData[];
        if (reset) {
          setPlayers(typed);
        } else {
          setPlayers((prev) => [...prev, ...typed]);
        }
        setHasMore(typed.length >= PAGE_SIZE);
        offsetRef.current += typed.length;
      }

      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    },
    [buildQuery]
  );

  useEffect(() => {
    fetchTicker();
    fetchPlayers(true);
  }, [fetchTicker, fetchPlayers]);

  // ---------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTicker();
    fetchPlayers(true);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchPlayers(false);
  };

  const handleFilterChange = (newFilters: PortalFilterState) => {
    setFilters(newFilters);
    // fetchPlayers will re-run due to buildQuery dependency change
  };

  const handleClaim = (player: PortalPlayerData) => {
    setClaimTarget(player);
    setClaimModalVisible(true);
  };

  const handleClaimCreated = () => {
    // Refresh the current list
    fetchPlayers(true);
  };

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  const renderItem = useCallback(
    ({ item }: { item: PortalPlayerData }) => (
      <PortalCard player={item} onClaim={handleClaim} />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <PortalTicker entries={tickerEntries} />
      <SectionLabel text="Portal Wire" />
      <PortalFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          removeClippedSubviews
          maxToRenderPerBatch={8}
          initialNumToRender={6}
          windowSize={5}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={dark}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <EmptyState
              title="No players found"
              subtitle="Try adjusting your filters or check back later."
            />
          }
        />
      )}

      <ClaimModal
        visible={claimModalVisible}
        playerId={claimTarget?.id ?? null}
        playerName={claimTarget?.name ?? ''}
        onClose={() => {
          setClaimModalVisible(false);
          setClaimTarget(null);
        }}
        onCreated={handleClaimCreated}
      />
    </View>
  );
}
