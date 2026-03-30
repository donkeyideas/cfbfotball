import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

interface AvatarProps {
  url?: string | null;
  name?: string | null;
  size?: number;
  borderColor?: string;
}

export function Avatar({ url, name, size = 40, borderColor }: AvatarProps) {
  const initial = (name || '?')[0].toUpperCase();
  const borderStyle = borderColor ? { borderWidth: 2, borderColor } : {};

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
          borderStyle,
        ]}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
        borderStyle,
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surface,
  },
  fallback: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontFamily: typography.serifBold,
    color: colors.textSecondary,
  },
});
