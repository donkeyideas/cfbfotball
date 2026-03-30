import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    label: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 2,
      textAlign: 'center',
      paddingVertical: 10,
    },
  }), [colors]);

  return (
    <Text style={styles.label}>~~ {text.toUpperCase()} ~~</Text>
  );
}
