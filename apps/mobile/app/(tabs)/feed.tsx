import { useEffect, useState, useCallback } from 'react';
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
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

interface Post {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  author: {
    username: string;
    display_name: string | null;
    school_id: string | null;
  } | null;
  school: {
    abbreviation: string;
    primary_color: string;
  } | null;
}

type FeedTab = 'national' | 'school';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTab>('national');

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, content, post_type, created_at,
        author:users!posts_author_id_fkey(username, display_name, school_id),
        school:schools!posts_school_id_fkey(abbreviation, primary_color)
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      setPosts(data as unknown as Post[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function onRefresh() {
    setRefreshing(true);
    fetchPosts();
  }

  function getTimeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  function renderPost({ item }: { item: Post }) {
    const authorName = item.author?.display_name ?? item.author?.username ?? 'Unknown';

    return (
      <View style={styles.postCard}>
        {/* Post type badge */}
        {item.post_type !== 'STANDARD' && (
          <Text style={styles.postType}>{item.post_type.replace('_', ' ')}</Text>
        )}

        {/* Author row */}
        <View style={styles.authorRow}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: item.school?.primary_color ?? colors.crimson },
            ]}
          >
            <Text style={styles.avatarText}>{authorName[0]}</Text>
          </View>
          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{authorName}</Text>
              {item.school && (
                <View
                  style={[
                    styles.schoolBadge,
                    { backgroundColor: `${item.school.primary_color}20` },
                  ]}
                >
                  <Text
                    style={[styles.schoolBadgeText, { color: item.school.primary_color }]}
                  >
                    {item.school.abbreviation}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>
              @{item.author?.username ?? 'unknown'} &middot; {getTimeAgo(item.created_at)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.content}>{item.content}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>TD</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Fumble</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Reply</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Repost</Text>
          </Pressable>
        </View>
      </View>
    );
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
      {/* Tab switcher */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'national' && styles.tabActive]}
          onPress={() => setActiveTab('national')}
        >
          <Text
            style={[styles.tabText, activeTab === 'national' && styles.tabTextActive]}
          >
            National
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'school' && styles.tabActive]}
          onPress={() => setActiveTab('school')}
        >
          <Text
            style={[styles.tabText, activeTab === 'school' && styles.tabTextActive]}
          >
            My School
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.crimson}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>The Gridiron is quiet...</Text>
            <Text style={styles.emptySubtitle}>Be the first to post and stake your claim.</Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.surfaceRaised,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 14,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.ink,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  postCard: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  postType: {
    fontFamily: typography.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.secondary,
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.serifBold,
    fontSize: 16,
    color: '#ffffff',
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontFamily: typography.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  schoolBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  schoolBadgeText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 11,
  },
  timestamp: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  content: {
    fontFamily: typography.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 24,
  },
  actionButton: {
    paddingVertical: 2,
  },
  actionText: {
    fontFamily: typography.mono,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
