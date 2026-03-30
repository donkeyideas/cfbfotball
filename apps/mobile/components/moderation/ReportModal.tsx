import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';

const REASONS = [
  'Spam',
  'Harassment',
  'Hate Speech',
  'Off Topic',
  'Politics',
  'Misinformation',
  'Other',
];

interface ReportModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

export function ReportModal({ visible, postId, onClose }: ReportModalProps) {
  const { dark } = useSchoolTheme();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.EXPO_PUBLIC_WEB_URL || '';
      const res = await fetch(`${baseUrl}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reason, description }),
      });

      if (res.status === 409) {
        setError('You have already reported this post.');
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit report');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Failed to submit report');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setReason('');
    setDescription('');
    setError(null);
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {submitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Report Filed</Text>
              <Text style={styles.successText}>
                Thank you for helping keep CFB Social clean.
              </Text>
              <Pressable style={[styles.button, { backgroundColor: dark }]} onPress={handleClose}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView>
              <Text style={styles.flagLabel}>Flag on the Play</Text>
              <Text style={styles.title}>Report This Post</Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {REASONS.map((r) => (
                <Pressable
                  key={r}
                  style={styles.radioRow}
                  onPress={() => setReason(r)}
                >
                  <View style={[styles.radio, reason === r && { borderColor: dark }]}>
                    {reason === r && <View style={[styles.radioDot, { backgroundColor: dark }]} />}
                  </View>
                  <Text style={styles.radioLabel}>{r}</Text>
                </Pressable>
              ))}

              <Text style={styles.descLabel}>Additional details (optional)</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
                placeholder="Describe the issue..."
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.actions}>
                <Pressable
                  style={[styles.button, { backgroundColor: dark }, loading && { opacity: 0.5 }]}
                  onPress={handleSubmit}
                  disabled={loading || !reason}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit Report</Text>
                  )}
                </Pressable>
                <Pressable onPress={handleClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  flagLabel: {
    fontFamily: typography.mono,
    fontSize: 11,
    color: colors.crimson,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: typography.serifBold,
    fontSize: 20,
    color: colors.ink,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: `${colors.crimson}15`,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.crimson,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontFamily: typography.sans,
    fontSize: 15,
    color: colors.textPrimary,
  },
  descLabel: {
    fontFamily: typography.sansSemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontFamily: typography.sansBold,
    fontSize: 15,
    color: '#fff',
  },
  cancelText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  successTitle: {
    fontFamily: typography.serifBold,
    fontSize: 20,
    color: colors.ink,
  },
  successText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
