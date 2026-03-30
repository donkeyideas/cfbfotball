import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface AppealFormProps {
  postId: string;
}

export function AppealForm({ postId }: AppealFormProps) {
  const colors = useColors();
  const { userId } = useAuth();
  const { dark } = useSchoolTheme();
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginTop: 8,
    },
    appealButton: {
      marginTop: 8,
      padding: 10,
      alignItems: 'center',
    },
    appealButtonText: {
      fontFamily: typography.mono,
      fontSize: 12,
      color: colors.warning,
      textDecorationLine: 'underline',
      letterSpacing: 1,
    },
    title: {
      fontFamily: typography.serifBold,
      fontSize: 16,
      color: colors.ink,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      padding: 10,
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.ink,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    submitButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 6,
    },
    submitText: {
      fontFamily: typography.sansBold,
      fontSize: 14,
      color: '#fff',
    },
    cancelText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textMuted,
      textDecorationLine: 'underline',
    },
    successText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.success,
      fontStyle: 'italic',
    },
  }), [colors]);

  if (!userId) return null;

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>
          Appeal submitted. You will be notified of the decision.
        </Text>
      </View>
    );
  }

  if (!expanded) {
    return (
      <Pressable style={styles.appealButton} onPress={() => setExpanded(true)}>
        <Text style={styles.appealButtonText}>Appeal to the Booth</Text>
      </Pressable>
    );
  }

  async function handleSubmit() {
    if (!reason.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('appeals').insert({
      post_id: postId,
      user_id: userId,
      reason: reason.trim(),
    });
    setLoading(false);
    if (!error) {
      setSubmitted(true);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appeal to the Booth</Text>
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        multiline
        maxLength={500}
        placeholder="Explain why this flag should be overturned..."
        placeholderTextColor={colors.textMuted}
      />
      <View style={styles.actions}>
        <Pressable
          style={[styles.submitButton, { backgroundColor: dark }, loading && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={loading || !reason.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Appeal</Text>
          )}
        </Pressable>
        <Pressable onPress={() => setExpanded(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
