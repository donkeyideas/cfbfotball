import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { PostHeader } from './PostHeader';
import { PostEngagement } from './PostEngagement';
import { BallotButtons } from './BallotButtons';
import { PostActions } from './PostActions';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';
import type { PostData } from './PostCard';

interface SidelineReportCardProps {
  post: PostData;
}

export const SidelineReportCard = memo(function SidelineReportCard({ post }: SidelineReportCardProps) {
  const colors = useColors();
  const router = useRouter();
  const [dotVisible, setDotVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Blinking green dot
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDotVisible((v) => !v);
    }, 800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const styles = useMemo(() => StyleSheet.create({
    card: {
      borderRadius: 6,
      overflow: 'hidden',
      marginHorizontal: 12,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    headerBar: {
      backgroundColor: colors.ink,
      paddingHorizontal: 12,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    liveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
    },
    liveText: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.success,
      letterSpacing: 2,
    },
    body: {
      backgroundColor: colors.paper,
      padding: 12,
    },
    content: {
      fontFamily: typography.sans,
      fontSize: 15,
      lineHeight: 22,
      color: colors.ink,
    },
  }), [colors]);

  const handleContentPress = () => {
    router.push(`/post/${post.id}` as never);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerBar}>
        <View style={styles.liveIndicator}>
          <View
            style={[styles.liveDot, { opacity: dotVisible ? 1 : 0.2 }]}
          />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.body}>
        <PostHeader
          author={post.author ?? null}
          createdAt={post.created_at}
        />

        <Pressable onPress={handleContentPress}>
          <Text style={styles.content}>{post.content}</Text>
        </Pressable>

        <PostEngagement
          touchdownCount={post.touchdown_count}
          fumbleCount={post.fumble_count}
        />

        <BallotButtons
          postId={post.id}
          authorId={post.author_id}
          initialTdCount={post.touchdown_count}
          initialFmCount={post.fumble_count}
          prefetchedVote={post._userVote}
        />

        <PostActions postId={post.id} postAuthorId={post.author_id} prefetchedReposted={post._userReposted} prefetchedSaved={post._userSaved} />
      </View>
    </View>
  );
});
