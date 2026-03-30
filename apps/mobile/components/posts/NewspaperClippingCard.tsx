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

interface NewspaperClippingCardProps {
  post: PostData;
}

export function NewspaperClippingCard({ post }: NewspaperClippingCardProps) {
  const colors = useColors();
  const router = useRouter();
  const isReceipt = post.post_type === 'RECEIPT';

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: 14,
      marginHorizontal: 12,
      marginVertical: 6,
    },
    sectionLabelWrap: {
      marginVertical: 10,
      gap: 4,
    },
    ruleLine: {
      height: 1,
      backgroundColor: colors.borderStrong,
    },
    sectionLabel: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 2,
      textAlign: 'center',
      paddingVertical: 2,
    },
    headline: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      lineHeight: 24,
      color: colors.ink,
      marginBottom: 6,
    },
    content: {
      fontFamily: typography.sans,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    stampWrap: {
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 4,
    },
    stamp: {
      backgroundColor: colors.ink,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 3,
    },
    stampText: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.paper,
      letterSpacing: 2,
    },
  }), [colors]);

  const handleContentPress = () => {
    router.push(`/post/${post.id}` as never);
  };

  // Split content into headline (first sentence) and body
  const dotIdx = post.content.indexOf('.');
  const headline = dotIdx > 0 && dotIdx < 80 ? post.content.slice(0, dotIdx + 1) : null;
  const body = headline ? post.content.slice(dotIdx + 1).trim() : post.content;

  return (
    <View style={styles.card}>
      <PostHeader
        author={post.author ?? null}
        createdAt={post.created_at}
      />

      {/* Section label with rules */}
      <View style={styles.sectionLabelWrap}>
        <View style={styles.ruleLine} />
        <Text style={styles.sectionLabel}>THE SATURDAY EDITION</Text>
        <View style={[styles.ruleLine, { backgroundColor: colors.crimson, height: 2 }]} />
      </View>

      <Pressable onPress={handleContentPress}>
        {headline && (
          <Text style={styles.headline}>{headline}</Text>
        )}
        {body ? (
          <Text style={styles.content}>{body}</Text>
        ) : null}
      </Pressable>

      {/* Receipt stamp at bottom */}
      {isReceipt && (
        <View style={styles.stampWrap}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>RECEIPT FILED</Text>
          </View>
        </View>
      )}

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
