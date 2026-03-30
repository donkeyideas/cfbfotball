import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';

interface OrnamentDividerProps {
  color?: string;
  width?: number;
}

export function OrnamentDivider({ color, width = 30 }: OrnamentDividerProps) {
  const colors = useColors();
  const resolvedColor = color ?? colors.secondary;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
    },
    line: {
      height: 1,
    },
    diamond: {
      width: 6,
      height: 6,
      transform: [{ rotate: '45deg' }],
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: resolvedColor, width }]} />
      <View style={[styles.diamond, { backgroundColor: resolvedColor }]} />
      <View style={[styles.line, { backgroundColor: resolvedColor, width }]} />
    </View>
  );
}
