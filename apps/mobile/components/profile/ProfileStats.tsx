import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface ProfileStatsProps {
  touchdownCount: number;
  fumbleCount: number;
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export function ProfileStats({
  touchdownCount,
  fumbleCount,
  followerCount,
  followingCount,
  postCount,
}: ProfileStatsProps) {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 14,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    column: {
      alignItems: 'center',
      gap: 2,
    },
    value: {
      fontFamily: typography.sansBold,
      fontSize: 17,
      color: colors.textPrimary,
    },
    label: {
      fontFamily: typography.sans,
      fontSize: 11,
      color: colors.textMuted,
    },
  }), [colors]);

  const stats = [
    { value: touchdownCount, label: 'TD' },
    { value: fumbleCount, label: 'FMB' },
    { value: followerCount, label: 'Followers' },
    { value: followingCount, label: 'Following' },
    { value: postCount, label: 'Posts' },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.column}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
