import { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface VoteBarProps {
  school1Color: string;
  school2Color: string;
  school1Votes: number;
  school2Votes: number;
}

export function VoteBar({
  school1Color,
  school2Color,
  school1Votes,
  school2Votes,
}: VoteBarProps) {
  const colors = useColors();
  const total = school1Votes + school2Votes;
  const pct1 = total > 0 ? Math.round((school1Votes / total) * 100) : 50;
  const pct2 = total > 0 ? 100 - pct1 : 50;

  const animatedWidth1 = useRef(new Animated.Value(0)).current;
  const animatedWidth2 = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => StyleSheet.create({
    wrapper: {
      gap: 4,
    },
    barContainer: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    segment: {
      height: '100%',
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pctLabel: {
      fontFamily: typography.sansBold,
      fontSize: 12,
    },
    totalLabel: {
      fontFamily: typography.sans,
      fontSize: 10,
      color: colors.textMuted,
    },
  }), [colors]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth1, {
        toValue: pct1,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth2, {
        toValue: pct2,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [pct1, pct2, animatedWidth1, animatedWidth2]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.barContainer}>
        <Animated.View
          style={[
            styles.segment,
            {
              backgroundColor: school1Color,
              width: animatedWidth1.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.segment,
            {
              backgroundColor: school2Color,
              width: animatedWidth2.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          ]}
        />
      </View>
      <View style={styles.labelRow}>
        <Text style={[styles.pctLabel, { color: school1Color }]}>{pct1}%</Text>
        <Text style={styles.totalLabel}>{total} votes</Text>
        <Text style={[styles.pctLabel, { color: school2Color }]}>{pct2}%</Text>
      </View>
    </View>
  );
}
