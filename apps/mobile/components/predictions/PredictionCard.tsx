import { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { SchoolBadge } from '@/components/ui/SchoolBadge';
import { DynastyBadge } from '@/components/ui/DynastyBadge';
import { PredictionBadge } from './PredictionBadge';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

export interface PredictionData {
  id: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  post: {
    id: string;
    content: string;
    author_id: string;
    created_at: string;
    author: {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
      dynasty_tier: string | null;
      school: {
        abbreviation: string;
        primary_color: string;
        slug: string | null;
      } | null;
    } | null;
  } | null;
}

interface PredictionCardProps {
  prediction: PredictionData;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const colors = useColors();
  const router = useRouter();
  const post = prediction.post;
  const author = post?.author;

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      gap: 10,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    authorInfo: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    displayName: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textPrimary,
      flexShrink: 1,
    },
    username: {
      fontFamily: typography.sans,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 1,
    },
    content: {
      fontFamily: typography.sans,
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    date: {
      fontFamily: typography.sans,
      fontSize: 12,
      color: colors.textMuted,
    },
  }), [colors]);

  const handlePress = () => {
    if (post?.id) {
      router.push(`/post/${post.id}` as never);
    }
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* Author row */}
      {author && (
        <View style={styles.authorRow}>
          <Avatar
            url={author.avatar_url}
            name={author.display_name || author.username}
            size={36}
          />
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.displayName} numberOfLines={1}>
                {author.display_name || author.username || 'Anonymous'}
              </Text>
              <DynastyBadge tier={author.dynasty_tier} />
            </View>
            {author.username && (
              <Text style={styles.username}>@{author.username}</Text>
            )}
          </View>
          {author.school && (
            <SchoolBadge
              abbreviation={author.school.abbreviation}
              color={author.school.primary_color}
              slug={author.school.slug}
              small
            />
          )}
        </View>
      )}

      {/* Prediction content */}
      {post?.content && (
        <Text style={styles.content} numberOfLines={4}>
          {post.content}
        </Text>
      )}

      {/* Footer: badge + date */}
      <View style={styles.footer}>
        <PredictionBadge status={prediction.status} />
        <Text style={styles.date}>{formatDate(prediction.created_at)}</Text>
      </View>
    </Pressable>
  );
}
