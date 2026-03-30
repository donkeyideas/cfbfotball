import { Tabs } from 'expo-router';
import { useColors } from '@/lib/theme/ThemeProvider';

export default function TabsLayout() {
  const colors = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="rivalry" />
      <Tabs.Screen name="portal" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
