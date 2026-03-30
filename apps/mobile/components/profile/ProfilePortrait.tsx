import { StyleSheet, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';

interface ProfilePortraitProps {
  avatarUrl?: string | null;
  name?: string | null;
  schoolColor?: string;
}

export function ProfilePortrait({ avatarUrl, name, schoolColor }: ProfilePortraitProps) {
  const borderColor = schoolColor || '#8b1a1a';

  return (
    <View style={[styles.outerBorder, { borderColor }]}>
      <View style={[styles.innerBorder, { borderColor }]}>
        <Avatar url={avatarUrl} name={name} size={100} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBorder: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
