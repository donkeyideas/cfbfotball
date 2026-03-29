import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { colors } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user) return;

      const { data } = await supabase
        .from('profiles')
        .select('display_name, bio')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name ?? '');
        setBio(data.bio ?? '');
      }
      setLoading(false);
    }

    loadProfile();
  }, [session]);

  async function handleSave() {
    if (!session?.user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        bio: bio || null,
      })
      .eq('id', session.user.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Settings saved.');
      router.back();
    }

    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={50}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            maxLength={280}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.charCount}>{bio.length}/280</Text>
        </View>

        <Pressable
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: typography.serifBold,
    fontSize: 20,
    color: colors.ink,
  },
  field: {
    gap: 4,
  },
  label: {
    fontFamily: typography.sansSemiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: typography.sans,
    fontSize: 16,
    color: colors.ink,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: colors.crimson,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: typography.sansBold,
    fontSize: 16,
    color: '#ffffff',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: colors.crimson,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: typography.sansSemiBold,
    fontSize: 16,
    color: colors.crimson,
  },
});
