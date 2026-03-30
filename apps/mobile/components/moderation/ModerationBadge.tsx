import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { colors } from '@/lib/theme/colors';

interface ModerationBadgeProps {
  status: 'FLAGGED' | 'REMOVED';
}

export function ModerationBadge({ status }: ModerationBadgeProps) {
  const isRemoved = status === 'REMOVED';

  return (
    <View style={[styles.badge, isRemoved ? styles.removed : styles.flagged]}>
      <Text style={[styles.text, isRemoved ? styles.removedText : styles.flaggedText]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  flagged: {
    backgroundColor: `${colors.warning}20`,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  removed: {
    backgroundColor: `${colors.crimson}20`,
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
});
