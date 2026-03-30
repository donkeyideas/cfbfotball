import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface SchoolInterest {
  school_id: string;
  school_name: string;
  abbreviation: string;
  primary_color: string;
  count: number;
}

interface SchoolInterestBarProps {
  interests: SchoolInterest[];
  totalClaims: number;
}

export function SchoolInterestBar({ interests, totalClaims }: SchoolInterestBarProps) {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      padding: 14,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
    },
    emptyContainer: {
      padding: 14,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      alignItems: 'center',
    },
    emptyText: {
      fontFamily: typography.sans,
      fontSize: 13,
      color: colors.textMuted,
    },
    title: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.textMuted,
      letterSpacing: 1.5,
      marginBottom: 10,
    },
    bar: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    segment: {
      height: '100%',
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontFamily: typography.sansSemiBold,
      fontSize: 11,
      color: colors.textSecondary,
    },
  }), [colors]);

  if (interests.length === 0 || totalClaims === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No claims yet</Text>
      </View>
    );
  }

  // Sort by count descending
  const sorted = [...interests].sort((a, b) => b.count - a.count);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCHOOL INTEREST</Text>

      {/* Visual bar */}
      <View style={styles.bar}>
        {sorted.map((school) => {
          const pct = (school.count / totalClaims) * 100;
          if (pct < 1) return null;
          return (
            <View
              key={school.school_id}
              style={[
                styles.segment,
                {
                  backgroundColor: school.primary_color,
                  width: `${pct}%`,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {sorted.map((school) => {
          const pct = Math.round((school.count / totalClaims) * 100);
          return (
            <View key={school.school_id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: school.primary_color }]}
              />
              <Text style={styles.legendText}>
                {school.abbreviation} {pct}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
