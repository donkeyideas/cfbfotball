import { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';

interface RivalryVoteBarProps {
  school1Color: string;
  school2Color: string;
  school1Pct: number;
  school2Pct: number;
}

export function RivalryVoteBar({
  school1Color,
  school2Color,
  school1Pct,
  school2Pct,
}: RivalryVoteBarProps) {
  const colors = useColors();
  const animatedWidth1 = useRef(new Animated.Value(0)).current;
  const animatedWidth2 = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    segment: {
      height: '100%',
    },
  }), [colors]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedWidth1, {
        toValue: school1Pct,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.timing(animatedWidth2, {
        toValue: school2Pct,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [school1Pct, school2Pct, animatedWidth1, animatedWidth2]);

  return (
    <View style={styles.container}>
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
  );
}
