import { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface TickerEntry {
  id: string;
  name: string;
  position: string;
  status: string | null;
  previous_school_name: string | null;
}

interface PortalTickerProps {
  entries: TickerEntry[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function PortalTicker({ entries }: PortalTickerProps) {
  const colors = useColors();
  const translateX = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.ink,
      height: 32,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    ticker: {
      flexDirection: 'row',
      position: 'absolute',
    },
    text: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.secondary,
      letterSpacing: 0.5,
    },
  }), [colors]);

  useEffect(() => {
    if (entries.length === 0) return;

    // Estimate total width: ~200px per entry
    const totalWidth = entries.length * 220;
    translateX.setValue(SCREEN_WIDTH);

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration: entries.length * 4000,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [entries, translateX]);

  if (entries.length === 0) return null;

  const tickerText = entries
    .map((e) => {
      const school = e.previous_school_name ?? 'Unknown';
      const statusLabel =
        e.status === 'COMMITTED' ? 'COMMITTED' :
        e.status === 'WITHDRAWN' ? 'WITHDRAWN' :
        'IN PORTAL';
      return `${e.name} (${e.position}) -- ${school} -- ${statusLabel}`;
    })
    .join('     ///     ');

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ticker, { transform: [{ translateX }] }]}>
        <Text style={styles.text} numberOfLines={1}>
          {tickerText}
        </Text>
      </Animated.View>
    </View>
  );
}
