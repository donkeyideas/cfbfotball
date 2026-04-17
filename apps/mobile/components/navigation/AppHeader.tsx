import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors, useTheme } from '@/lib/theme/ThemeProvider';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useMenu } from '@/lib/MenuProvider';
import { typography } from '@/lib/theme/typography';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Ionicons } from '@expo/vector-icons';

export function AppHeader() {
  const colors = useColors();
  const { isDark, toggleColorMode } = useTheme();
  const { dark, accent, school } = useSchoolTheme();
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const { openMenu } = useMenu();
  const router = useRouter();

  const headerName = profile?.display_name || school?.name || 'CFB Social';

  // Header always sits on the school's dark color, so text/icons must always be white
  const headerFg = '#ffffff';

  const styles = useMemo(() => StyleSheet.create({
    container: {
      paddingBottom: 6,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bars: {
      gap: 4,
    },
    bar: {
      width: 18,
      height: 2,
      backgroundColor: headerFg,
      borderRadius: 1,
    },
    teamName: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      color: headerFg,
      letterSpacing: 1,
      textAlign: 'center',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeToggle: {
      padding: 4,
    },
  }), []);

  return (
    <View style={[styles.container, { backgroundColor: dark, paddingTop: insets.top + 4 }]}>
      <View style={styles.row}>
        <Pressable onPress={openMenu} style={[styles.menuButton, { backgroundColor: accent }]} hitSlop={8}>
          <View style={styles.bars}>
            <View style={styles.bar} />
            <View style={styles.bar} />
            <View style={styles.bar} />
          </View>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/feed' as never)} style={{ flex: 1 }} hitSlop={4}>
          <Text style={styles.teamName} numberOfLines={1}>{headerName}</Text>
        </Pressable>
        <View style={styles.rightSection}>
          <Pressable onPress={() => router.push('/search' as never)} style={styles.themeToggle} hitSlop={8}>
            <Ionicons name="search-outline" size={20} color={headerFg} />
          </Pressable>
          <Pressable onPress={toggleColorMode} style={styles.themeToggle} hitSlop={8}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={headerFg} />
          </Pressable>
          <NotificationBell />
        </View>
      </View>
    </View>
  );
}
