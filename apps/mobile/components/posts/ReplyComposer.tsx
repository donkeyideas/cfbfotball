import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useThemedAlert } from '@/lib/AlertProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { supabase } from '@/lib/supabase';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface ReplyComposerProps {
  postId: string;
  onReplySent: () => void;
}

export function ReplyComposer({ postId, onReplySent }: ReplyComposerProps) {
  const colors = useColors();
  const { session, userId, profile } = useAuth();
  const { dark } = useSchoolTheme();
  const router = useRouter();
  const { showAlert } = useThemedAlert();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    input: {
      flex: 1,
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      maxHeight: 100,
    },
    sendButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendDisabled: {
      opacity: 0.5,
    },
    sendText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textInverse,
    },
    loginPrompt: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.crimson,
      textAlign: 'center',
      paddingVertical: 4,
    },
  }), [colors]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Pressable onPress={() => router.push('/(auth)/login' as never)}>
          <Text style={[styles.loginPrompt, { color: dark }]}>Log in to reply</Text>
        </Pressable>
      </View>
    );
  }

  const handleSend = async () => {
    if (!content.trim() || !userId) return;

    setSubmitting(true);
    const { error } = await supabase.from('posts').insert({
      content: content.trim(),
      post_type: 'STANDARD',
      author_id: userId,
      school_id: profile?.school_id ?? null,
      parent_id: postId,
      status: 'PUBLISHED',
    });

    setSubmitting(false);

    if (error) {
      showAlert('Incomplete Pass', 'Failed to send reply. Please try again.');
      return;
    }

    setContent('');
    onReplySent();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a reply..."
        placeholderTextColor={colors.textMuted}
        value={content}
        onChangeText={setContent}
        maxLength={500}
        multiline
      />
      <Pressable
        style={[
          styles.sendButton,
          { backgroundColor: dark },
          (!content.trim() || submitting) && styles.sendDisabled,
        ]}
        onPress={handleSend}
        disabled={!content.trim() || submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={colors.textInverse} />
        ) : (
          <Text style={styles.sendText}>Send</Text>
        )}
      </Pressable>
    </View>
  );
}
