import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/lib/theme/ThemeProvider';

const MENTION_REGEX = /@([a-zA-Z0-9_]{1,30})/g;

interface PostContentProps {
  content: string;
  style?: any;
}

export function PostContent({ content, style }: PostContentProps) {
  const router = useRouter();
  const colors = useColors();
  const parts = content.split(MENTION_REGEX);

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <Text
              key={i}
              style={{ color: colors.crimson, fontWeight: '600' }}
              onPress={() => router.push(`/profile/${part}` as never)}
            >
              @{part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}
