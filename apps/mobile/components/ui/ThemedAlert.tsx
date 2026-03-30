import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function ThemedAlert({
  visible,
  title,
  message,
  onDismiss,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: ThemedAlertProps) {
  const colors = useColors();
  const { dark, accent } = useSchoolTheme();
  const hasCancel = !!cancelLabel;

  const styles = useMemo(() => StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(26,24,20,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    card: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: colors.paper,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    headerText: {
      fontFamily: typography.mono,
      fontSize: 12,
      letterSpacing: 3,
    },
    body: {
      padding: 20,
    },
    message: {
      fontFamily: typography.serif,
      fontSize: 16,
      lineHeight: 24,
      color: colors.ink,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textSecondary,
      letterSpacing: 1,
    },
    confirmButton: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 4,
      minWidth: 80,
      alignItems: 'center',
    },
    confirmText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      letterSpacing: 1,
    },
  }), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Header bar */}
          <View style={[styles.header, { backgroundColor: dark }]}>
            <Text style={[styles.headerText, { color: accent }]}>
              {title.toUpperCase()}
            </Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              {hasCancel && (
                <Pressable style={styles.cancelButton} onPress={onDismiss}>
                  <Text style={styles.cancelText}>{cancelLabel}</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.confirmButton, { backgroundColor: dark }]}
                onPress={() => {
                  onConfirm?.();
                  onDismiss();
                }}
              >
                <Text style={[styles.confirmText, { color: accent }]}>
                  {confirmLabel || 'OK'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
