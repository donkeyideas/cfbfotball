import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PostHeader } from './PostHeader';
import { PostEngagement } from './PostEngagement';
import { BallotButtons } from './BallotButtons';
import { PostActions } from './PostActions';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';
import type { PostData } from './PostCard';

interface TicketStubCardProps {
  post: PostData;
}

export function TicketStubCard({ post }: TicketStubCardProps) {
  const colors = useColors();
  const router = useRouter();
  const schoolColor = post.author?.school?.primary_color || colors.crimson;

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceRaised,
      borderRadius: 6,
      borderLeftWidth: 4,
      padding: 12,
      marginHorizontal: 12,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    content: {
      fontFamily: typography.sans,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
    },
  }), [colors]);

  const handleContentPress = () => {
    router.push(`/post/${post.id}` as never);
  };

  return (
    <View style={[styles.card, { borderLeftColor: schoolColor }]}>
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
      />

      <PostActions postId={post.id} postAuthorId={post.author_id} />
    </View>
  );
}
