import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useRealtimeFeed } from '@/lib/hooks/useRealtimeFeed';
import { AppHeader } from '@/components/navigation/AppHeader';
import { ScoresBanner } from '@/components/feed/ScoresBanner';
import { FeedTabs, type FeedTab } from '@/components/feed/FeedTabs';
import { NewPostsBanner } from '@/components/feed/NewPostsBanner';
import { DynastyWidget } from '@/components/feed/DynastyWidget';
import { PostCard, type PostData } from '@/components/posts/PostCard';
import { PostComposer } from '@/components/posts/PostComposer';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

const PAGE_SIZE = 20;

const POST_SELECT = `
  *,
  author:profiles!posts_author_id_fkey(
    id, username, display_name, avatar_url, dynasty_tier,
    school:schools!profiles_school_id_fkey(abbreviation, primary_color, slug)
  )
`;

// Sentinel item injected into the FlatList data to render the DynastyWidget inline
const DYNASTY_SENTINEL = '__DYNASTY_WIDGET__';
type FeedItem = PostData | typeof DYNASTY_SENTINEL;

export default function FeedScreen() {
  const colors = useColors();
  const { session, userId, profile } = useAuth();
  const { dark } = useSchoolTheme();
  const { newPostCount, resetCount } = useRealtimeFeed(profile?.school_id ?? undefined);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FeedTab>('latest');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [composerVisible, setComposerVisible] = useState(false);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const offsetRef = useRef(0);

  const styles = useMemo(() => StyleSheet.create({
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
      paddingBottom: 80,
    },
    loadingMore: {
      paddingVertical: 16,
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
    authGate: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 16,
    },
    authGateTitle: {
      fontFamily: typography.serif,
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    authGateButton: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 6,
    },
    authGateButtonText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textInverse,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    fabText: {
      fontFamily: typography.sansBold,
      fontSize: 28,
      color: colors.textInverse,
      marginTop: -2,
    },
  }), [colors]);

  // ------------------------------------------------------------------
  // Fetch followed user IDs (needed for the Following tab)
  // ------------------------------------------------------------------
  const fetchFollowing = useCallback(async () => {
    if (!userId) {
      setFollowedIds([]);
      return;
    }
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    if (data) {
      setFollowedIds(data.map((f: { following_id: string }) => f.following_id));
    }
  }, [userId]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  // ------------------------------------------------------------------
  // Build query for the active tab
  // ------------------------------------------------------------------
  const buildQuery = useCallback(
    (offset: number) => {
      let query = supabase
        .from('posts')
        .select(POST_SELECT)
        .in('status', ['PUBLISHED', 'FLAGGED'])
        .is('parent_id', null);

      switch (activeTab) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'top':
          query = query.order('touchdown_count', { ascending: false });
          break;
        case 'receipts':
          query = query.in('post_type', ['RECEIPT', 'PREDICTION']);
          query = query.order('created_at', { ascending: false });
          break;
        case 'following':
          if (followedIds.length > 0) {
            query = query.in('author_id', followedIds);
          } else {
            // Return impossible filter to get empty result
            query = query.eq('author_id', 'no-results');
          }
          query = query.order('created_at', { ascending: false });
          break;
        case 'mySchool':
          if (profile?.school_id) {
            query = query.eq('school_id', profile.school_id);
          } else {
            query = query.eq('school_id', 'no-results');
          }
          query = query.order('created_at', { ascending: false });
          break;
      }

      query = query.range(offset, offset + PAGE_SIZE - 1);
      return query;
    },
    [activeTab, followedIds, profile?.school_id]
  );

  // ------------------------------------------------------------------
  // Fetch posts
  // ------------------------------------------------------------------
  const fetchPosts = useCallback(
    async (reset = true) => {
      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      }

      const { data, error } = await buildQuery(offsetRef.current);

      if (!error && data) {
        const typed = data as unknown as PostData[];
        if (reset) {
          setPosts(typed);
        } else {
          setPosts((prev) => [...prev, ...typed]);
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
    fetchPosts(true);
  }, [fetchPosts]);

  // ------------------------------------------------------------------
  // Tab change
  // ------------------------------------------------------------------
  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    // fetchPosts will be triggered by the useEffect on fetchPosts changing
  };

  // ------------------------------------------------------------------
  // Pull to refresh
  // ------------------------------------------------------------------
  const handleRefresh = () => {
    setRefreshing(true);
    resetCount();
    fetchPosts(true);
  };

  // ------------------------------------------------------------------
  // New posts banner tap
  // ------------------------------------------------------------------
  const handleNewPostsBannerPress = () => {
    resetCount();
    fetchPosts(true);
  };

  // ------------------------------------------------------------------
  // Load more
  // ------------------------------------------------------------------
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchPosts(false);
  };

  // ------------------------------------------------------------------
  // Post created callback
  // ------------------------------------------------------------------
  const handlePostCreated = () => {
    fetchPosts(true);
  };

  // ------------------------------------------------------------------
  // Auth gate for Following / My School
  // ------------------------------------------------------------------
  const needsAuth = (activeTab === 'following' || activeTab === 'mySchool') && !session;

  // ------------------------------------------------------------------
  // Build FlatList data with dynasty widget sentinel after 3rd post
  // ------------------------------------------------------------------
  const feedData: FeedItem[] = [];
  for (let i = 0; i < posts.length; i++) {
    feedData.push(posts[i]);
    if (i === 2) {
      feedData.push(DYNASTY_SENTINEL);
    }
  }
  // If fewer than 3 posts, still add dynasty widget at the end
  if (posts.length > 0 && posts.length <= 3 && !feedData.includes(DYNASTY_SENTINEL)) {
    feedData.push(DYNASTY_SENTINEL);
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const renderItem = ({ item }: { item: FeedItem }) => {
    if (item === DYNASTY_SENTINEL) {
      return <DynastyWidget />;
    }
    return <PostCard post={item} />;
  };

  const keyExtractor = (item: FeedItem, index: number) => {
    if (item === DYNASTY_SENTINEL) return 'dynasty-widget';
    return item.id;
  };

  const ListFooter = loadingMore ? (
    <ActivityIndicator
      size="small"
      color={dark}
      style={styles.loadingMore}
    />
  ) : null;

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScoresBanner />
      <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {newPostCount > 0 && (
        <NewPostsBanner count={newPostCount} onPress={handleNewPostsBannerPress} />
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={dark} />
        </View>
      ) : needsAuth ? (
        <View style={styles.authGate}>
          <Text style={styles.authGateTitle}>
            {activeTab === 'following' ? 'Follow fans to see their takes' : 'Pick a school to see its takes'}
          </Text>
          <Pressable
            style={[styles.authGateButton, { backgroundColor: dark }]}
            onPress={() => router.push('/(auth)/login' as never)}
          >
            <Text style={styles.authGateButtonText}>Log In</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
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
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>CFB Social is quiet...</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to post and stake your claim.
              </Text>
            </View>
          }
        />
      )}

      {/* Floating compose button - bottom left */}
      <Pressable
        style={[styles.fab, { backgroundColor: dark }]}
        onPress={() => setComposerVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <PostComposer
        visible={composerVisible}
        onClose={() => setComposerVisible(false)}
        onPostCreated={handlePostCreated}
      />
    </View>
  );
}

