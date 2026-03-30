import { useRef, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo } from '@/lib/utils/timeAgo';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface ChatMessageData {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
  user?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface GameChatProps {
  messages: ChatMessageData[];
}

function ChatBubble({ message }: { message: ChatMessageData }) {
  const colors = useColors();
  const username = message.author?.display_name || message.author?.username || message.user?.username || message.username || 'Fan';
  const avatarUrl = message.author?.avatar_url || message.user?.avatar_url || message.avatar_url || null;

  const styles = useMemo(() => StyleSheet.create({
    bubbleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 6,
      gap: 8,
    },
    bubbleContent: {
      flex: 1,
      backgroundColor: colors.surfaceRaised,
      borderRadius: 10,
      borderTopLeftRadius: 2,
      padding: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    bubbleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    username: {
      fontFamily: typography.sansSemiBold,
      fontSize: 12,
      color: colors.textSecondary,
    },
    timestamp: {
      fontFamily: typography.sans,
      fontSize: 10,
      color: colors.textMuted,
    },
    messageText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
    },
  }), [colors]);

  return (
    <View style={styles.bubbleContainer}>
      <Avatar url={avatarUrl} name={username} size={30} />
      <View style={styles.bubbleContent}>
        <View style={styles.bubbleHeader}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timestamp}>{timeAgo(message.created_at)}</Text>
        </View>
        <Text style={styles.messageText}>{message.content}</Text>
      </View>
    </View>
  );
}

export function GameChat({ messages }: GameChatProps) {
  const colors = useColors();
  const flatListRef = useRef<FlatList>(null);

  const styles = useMemo(() => StyleSheet.create({
    listContent: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
    },
    emptyTitle: {
      fontFamily: typography.serif,
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    emptySubtitle: {
      fontFamily: typography.sans,
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
    },
  }), [colors]);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      // Small delay so FlatList has time to measure new content
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatBubble message={item} />}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>The stadium is quiet...</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to sound off in the War Room.
          </Text>
        </View>
      }
      onContentSizeChange={() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }}
    />
  );
}
