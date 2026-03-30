import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

type ActivityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export interface RecruitingSchool {
  id: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  slug: string;
  conference?: string | null;
  portalCount: number;
  claimsCount: number;
}

interface SchoolCardProps {
  school: RecruitingSchool;
}

function getActivityLevel(total: number): ActivityLevel {
  if (total >= 20) return 'VERY HIGH';
  if (total >= 10) return 'HIGH';
  if (total >= 4) return 'MODERATE';
  return 'LOW';
}

function getActivityColor(level: ActivityLevel, successColor: string): string {
  switch (level) {
    case 'VERY HIGH': return '#c0392b';
    case 'HIGH': return '#e67e22';
    case 'MODERATE': return '#f1c40f';
    case 'LOW': return successColor;
  }
}

function getActivityBarWidth(total: number): number {
  // Scale 0-30+ to 0-100%
  return Math.min((total / 30) * 100, 100);
}

export function SchoolCard({ school }: SchoolCardProps) {
  const colors = useColors();
  const router = useRouter();
  const total = school.portalCount + school.claimsCount;
  const level = getActivityLevel(total);
  const activityColor = getActivityColor(level, colors.success);
  const barWidth = getActivityBarWidth(total);

  const styles = useMemo(() => StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      overflow: 'hidden',
      margin: 4,
    },
    topBar: {
      height: 6,
    },
    content: {
      padding: 10,
      gap: 4,
    },
    schoolName: {
      fontFamily: typography.serifBold,
      fontSize: 13,
      color: colors.textPrimary,
    },
    abbreviation: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
      gap: 8,
    },
    statItem: {
      alignItems: 'center',
      gap: 1,
    },
    statValue: {
      fontFamily: typography.sansBold,
      fontSize: 16,
      color: colors.textPrimary,
    },
    statLabel: {
      fontFamily: typography.sans,
      fontSize: 9,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statDivider: {
      width: 1,
      height: 20,
      backgroundColor: colors.border,
    },
    activityBadge: {
      alignSelf: 'center',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 4,
    },
    activityBadgeText: {
      fontFamily: typography.mono,
      fontSize: 8,
      letterSpacing: 0.8,
    },
    activityBarBg: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      marginTop: 4,
    },
    activityBarFill: {
      height: '100%',
      borderRadius: 2,
    },
  }), [colors]);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/school/${school.slug}` as never)}
    >
      {/* Color top bar */}
      <View style={[styles.topBar, { backgroundColor: school.primary_color }]} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.schoolName} numberOfLines={1}>{school.name}</Text>
        <Text style={styles.abbreviation}>{school.abbreviation}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{school.portalCount}</Text>
            <Text style={styles.statLabel}>Portal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{school.claimsCount}</Text>
            <Text style={styles.statLabel}>Claims</Text>
          </View>
        </View>

        {/* Activity badge */}
        <View style={[styles.activityBadge, { backgroundColor: activityColor + '20' }]}>
          <Text style={[styles.activityBadgeText, { color: activityColor }]}>{level}</Text>
        </View>

        {/* Activity bar */}
        <View style={styles.activityBarBg}>
          <View
            style={[
              styles.activityBarFill,
              { width: `${barWidth}%`, backgroundColor: activityColor },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}
