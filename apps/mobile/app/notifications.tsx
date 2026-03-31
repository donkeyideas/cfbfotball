import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { AppHeader } from '@/components/navigation/AppHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AuthGate } from '@/components/ui/AuthGate';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  NotificationItem,
  type NotificationData,
} from '@/components/notifications/NotificationItem';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';

const NOTIFICATION_SELECT = `
  *,
  actor:profiles!notifications_actor_id_fkey(
    id, username, display_name, avatar_url
  )
`;

export default function NotificationsScreen() {
  const colors = useColors();
  const { dark } = useSchoolTheme();
  const { session, profile } = useAuth();
  const userId = profile?.id ?? null;
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.paper,
    },
    markAllRow: {
      alignItems: 'flex-end',
      paddingHorizontal: 16,
    },
    markAllButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    markAllText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 13,
      color: colors.crimson,
    },
    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      paddingBottom: 40,
    },
  }), [colors]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('notifications')
      .select(NOTIFICATION_SELECT)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as unknown as NotificationData[]);
    }

    setLoading(false);
    setRefreshing(false);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [fetchNotifications, userId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderItem = useCallback(
    ({ item }: { item: NotificationData }) => (
      <NotificationItem notification={item} onRead={handleRead} />
    ),
    []
  );

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const hasUnread = notifications.some((n) => !n.is_read);

  if (!session) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <SectionLabel text="Notifications" />
        <AuthGate message="Sign in to view your notifications" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <SectionLabel text="Notifications" />
      {hasUnread && (
        <View style={styles.markAllRow}>
          <Pressable onPress={handleMarkAllRead} style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: dark }]}>Mark all read</Text>
          </Pressable>
        </View>
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={dark} />
        </View>
      ) : (
        <FlatList
          data={notifications}
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
          ListEmptyComponent={
            <EmptyState
              title="No notifications yet"
              subtitle="When fans interact with your posts, you will see it here."
            />
          }
        />
      )}
    </View>
  );
}
