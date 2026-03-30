import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors } from '@/lib/theme/ThemeProvider';

export function LoadingScreen() {
  const colors = useColors();
  const { dark } = useSchoolTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.paper,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={dark} />
    </View>
  );
}
