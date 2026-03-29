import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Newspaper, Swords, ArrowRightLeft, Trophy } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

export default function TabsLayout() {
  const { session } = useAuth();
  const [schoolColors, setSchoolColors] = useState({
    primary: colors.crimson,
    secondary: colors.secondary,
  });

  useEffect(() => {
    if (!session?.user) return;

    async function loadSchoolColors() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', session!.user.id)
        .single();

      if (!profile?.school_id) return;

      const { data: school } = await supabase
        .from('schools')
        .select('primary_color, secondary_color')
        .eq('id', profile.school_id)
        .single();

      if (school) {
        setSchoolColors({
          primary: school.primary_color,
          secondary: school.secondary_color,
        });
      }
    }

    loadSchoolColors();
  }, [session]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.paper,
        },
        headerTintColor: colors.ink,
        headerTitleStyle: {
          fontFamily: typography.serifBold,
        },
        tabBarStyle: {
          backgroundColor: colors.surfaceRaised,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: schoolColors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: typography.sansSemiBold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerTitle: 'The Gridiron',
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rivalry"
        options={{
          title: 'Rivalry',
          headerTitle: 'Rivalry Ring',
          tabBarIcon: ({ color, size }) => (
            <Swords color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="portal"
        options={{
          title: 'Portal',
          headerTitle: 'Portal Wire',
          tabBarIcon: ({ color, size }) => (
            <ArrowRightLeft color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Hall of Fame',
          tabBarIcon: ({ color, size }) => (
            <Trophy color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
