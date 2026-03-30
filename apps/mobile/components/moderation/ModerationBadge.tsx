import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';
import { withAlpha } from '@/lib/theme/utils';

interface ModerationBadgeProps {
  status: 'FLAGGED' | 'REMOVED';
}

export function ModerationBadge({ status }: ModerationBadgeProps) {
  const colors = useColors();
  const isRemoved = status === 'REMOVED';

  const styles = useMemo(() => StyleSheet.create({
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    flagged: {
      backgroundColor: withAlpha(colors.warning, 0.13),
      borderWidth: 1,
      borderColor: colors.warning,
    },
    removed: {
      backgroundColor: withAlpha(colors.crimson, 0.13),
      borderWidth: 1,
      borderColor: colors.crimson,
    },
    text: {
      fontFamily: typography.mono,
      fontSize: 9,
      letterSpacing: 1,
    },
    flaggedText: {
      color: colors.warning,
    },
    removedText: {
      color: colors.crimson,
    },
  }), [colors]);

  return (
    <View style={[styles.badge, isRemoved ? styles.removed : styles.flagged]}>
      <Text style={[styles.text, isRemoved ? styles.removedText : styles.flaggedText]}>
        {status}
      </Text>
    </View>
  );
}
