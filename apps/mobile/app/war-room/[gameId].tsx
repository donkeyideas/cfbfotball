import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useRealtimeGameChat } from '@/lib/hooks/useRealtimeGameChat';
import { AppHeader } from '@/components/navigation/AppHeader';
import { LiveScoreboard } from '@/components/war-room/LiveScoreboard';
import { GameChat } from '@/components/war-room/GameChat';
import { ChatInput } from '@/components/war-room/ChatInput';
import { colors } from '@/lib/theme/colors';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';

const MESSAGE_SELECT = `
  *,
  author:profiles!game_thread_messages_user_id_fkey(
    id, username, display_name, avatar_url
  )
`;

export default function GameThreadScreen() {
  const { dark } = useSchoolTheme();
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const { userId } = useAuth();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [gameName, setGameName] = useState('');

  const { messages, setMessages, viewerCount } = useRealtimeGameChat(threadId);

  // Find or create the game thread
  const findOrCreateThread = useCallback(async () => {
    if (!gameId) return;

    // Check for existing thread
    const { data: existing } = await supabase
      .from('game_threads')
      .select('*')
      .eq('espn_game_id', gameId)
      .maybeSingle();

    if (existing) {
      setThreadId(existing.id);
      setGameName(existing.title || '');
      await loadMessages(existing.id);
      setInitialLoading(false);
      return;
    }

    // Fetch game info from ESPN to create thread
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/${gameId}`
      );
      const data = await res.json();

      const competition = data?.competitions?.[0];
      const away = competition?.competitors?.find(
        (c: { homeAway: string }) => c.homeAway === 'away'
      );
      const home = competition?.competitors?.find(
        (c: { homeAway: string }) => c.homeAway === 'home'
      );

      const title = away && home
        ? `${away.team?.displayName ?? 'Away'} at ${home.team?.displayName ?? 'Home'}`
        : data?.name ?? `Game ${gameId}`;

      const awayName = away?.team?.displayName ?? 'Away';
      const homeName = home?.team?.displayName ?? 'Home';
      const gameDate = data?.date ?? new Date().toISOString();
      const awayScore = parseInt(away?.score ?? '0', 10);
      const homeScore = parseInt(home?.score ?? '0', 10);
      const gameStatus = data?.status?.type?.state === 'in' ? 'LIVE' : data?.status?.type?.state === 'post' ? 'FINAL' : 'UPCOMING';
      const statusDetail = data?.status?.type?.shortDetail ?? '';

      const { data: newThread, error } = await supabase
        .from('game_threads')
        .insert({
          espn_game_id: gameId,
          title,
          away_team: awayName,
          home_team: homeName,
          away_score: awayScore,
          home_score: homeScore,
          status: gameStatus,
          status_detail: statusDetail,
          game_date: gameDate,
        })
        .select()
        .single();

      if (!error && newThread) {
        setThreadId(newThread.id);
        setGameName(title);
      }
    } catch {
      // If ESPN fetch fails, create a basic thread
      const { data: fallback } = await supabase
        .from('game_threads')
        .insert({
          espn_game_id: gameId,
          title: `Game Thread ${gameId}`,
          away_team: 'TBD',
          home_team: 'TBD',
          away_score: 0,
          home_score: 0,
          status: 'UPCOMING',
          status_detail: '',
          game_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (fallback) {
        setThreadId(fallback.id);
        setGameName(`Game Thread ${gameId}`);
      }
    }

    setInitialLoading(false);
  }, [gameId]);

  const loadMessages = async (tid: string) => {
    const { data } = await supabase
      .from('game_thread_messages')
      .select(MESSAGE_SELECT)
      .eq('game_thread_id', tid)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data as any);
    }
  };

  useEffect(() => {
    findOrCreateThread();
  }, [findOrCreateThread]);

  if (initialLoading || !gameId) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={dark} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <LiveScoreboard espnGameId={gameId} viewerCount={viewerCount} />
      <View style={styles.chatContainer}>
        <GameChat messages={messages} />
      </View>
      <ChatInput threadId={threadId} />
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
  chatContainer: {
    flex: 1,
  },
});
