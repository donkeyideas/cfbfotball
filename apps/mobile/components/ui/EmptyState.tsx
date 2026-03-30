import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      padding: 40,
      alignItems: 'center',
    },
    title: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
