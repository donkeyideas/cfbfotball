import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AppHeader } from '@/components/navigation/AppHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { GameCard, type ESPNGame } from '@/components/war-room/GameCard';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';

const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard';

interface GameSection {
  title: string;
  data: ESPNGame[];
}

function groupGames(events: ESPNGame[]): GameSection[] {
  const live: ESPNGame[] = [];
  const upcoming: ESPNGame[] = [];
  const final: ESPNGame[] = [];

  for (const game of events) {
    const state = game.status?.type?.state;
    if (state === 'in') {
      live.push(game);
    } else if (state === 'post') {
      final.push(game);
    } else {
      upcoming.push(game);
    }
  }

  const sections: GameSection[] = [];
  if (live.length > 0) sections.push({ title: 'LIVE', data: live });
  if (upcoming.length > 0) sections.push({ title: 'UPCOMING', data: upcoming });
  if (final.length > 0) sections.push({ title: 'FINAL', data: final });

  return sections;
}

export default function WarRoomScreen() {
  const { dark } = useSchoolTheme();
  const [sections, setSections] = useState<GameSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch(ESPN_SCOREBOARD_URL);
      const data = await res.json();
      const events: ESPNGame[] = data?.events ?? [];
      setSections(groupGames(events));
    } catch {
      // Silently fail - keep current state
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchGames();

    // Auto-refresh every 60 seconds
    intervalRef.current = setInterval(fetchGames, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchGames]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGames();
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: GameSection;
  }) => {
    const isLive = section.title === 'LIVE';
    return (
      <View style={styles.sectionHeader}>
        {isLive && <View style={styles.liveDot} />}
        <Text
          style={[
            styles.sectionTitle,
            isLive && { color: colors.success },
          ]}
        >
          {section.title}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <SectionLabel text="War Room" />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={dark} />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No games on the board</Text>
          <Text style={styles.emptySubtitle}>
            Check back on game day to join the War Room.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GameCard game={item} />}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={dark}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  sectionTitle: {
    fontFamily: typography.sansBold,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: typography.serif,
    fontSize: 20,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
