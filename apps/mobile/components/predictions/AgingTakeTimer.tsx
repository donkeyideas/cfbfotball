import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/lib/theme/typography';
import { useColors } from '@/lib/theme/ThemeProvider';

interface AgingTakeTimerProps {
  revisitDate: string;
}

function getTimeRemaining(target: Date): { days: number; hours: number; expired: boolean } {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days, hours, expired: false };
}

export function AgingTakeTimer({ revisitDate }: AgingTakeTimerProps) {
  const colors = useColors();
  const target = new Date(revisitDate);
  const [remaining, setRemaining] = useState(() => getTimeRemaining(target));

  const styles = useMemo(() => StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
    ready: {
      borderColor: colors.success,
    },
    text: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
  }), [colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(target));
    }, 60_000);

    return () => clearInterval(interval);
  }, [revisitDate]);

  if (remaining.expired) {
    return (
      <View style={[styles.container, styles.ready]}>
        <Text style={[styles.text, { color: colors.success }]}>Ready for Review</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {remaining.days}d {remaining.hours}h remaining
      </Text>
    </View>
  );
}
