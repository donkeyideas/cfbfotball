import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface PostEngagementProps {
  touchdownCount: number;
  fumbleCount: number;
}

export const PostEngagement = memo(function PostEngagement({ touchdownCount, fumbleCount }: PostEngagementProps) {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    td: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.success,
      letterSpacing: 0.5,
    },
    separator: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textMuted,
    },
    fmb: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.crimson,
      letterSpacing: 0.5,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.td}>{touchdownCount} TD</Text>
      <Text style={styles.separator}>*</Text>
      <Text style={styles.fmb}>{fumbleCount} FMB</Text>
    </View>
  );
});
