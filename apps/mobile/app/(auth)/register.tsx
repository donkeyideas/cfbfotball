import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';
import { withAlpha } from '@/lib/theme/utils';
import type { SchoolRow } from '@cfb-social/types';

export default function RegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.paper,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    title: {
      fontFamily: typography.serifBold,
      fontSize: 36,
      color: colors.ink,
      textAlign: 'center',
    },
    divider: {
      width: 60,
      height: 1,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginVertical: 12,
    },
    subtitle: {
      fontFamily: typography.serif,
      fontSize: 22,
      color: colors.ink,
      textAlign: 'center',
      marginBottom: 24,
    },
    errorContainer: {
      backgroundColor: withAlpha(colors.crimson, 0.08),
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    errorText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.crimson,
    },
    form: {
      gap: 16,
    },
    label: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    hint: {
      fontFamily: typography.sans,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 4,
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
    pickerContainer: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    picker: {
      color: colors.ink,
    },
    button: {
      backgroundColor: colors.crimson,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontFamily: typography.sansBold,
      fontSize: 16,
      color: colors.textInverse,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    footerText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textMuted,
    },
    footerLink: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.crimson,
    },
  }), [colors]);

  useEffect(() => {
    async function fetchSchools() {
      const { data } = await supabase
        .from('schools')
        .select('id, name, mascot')
        .eq('is_active', true)
        .order('name');
      if (data) setSchools(data as unknown as SchoolRow[]);
    }
    fetchSchools();
  }, []);

  async function handleRegister() {
    if (!username || !email || !password || !schoolId) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }
    setLoading(true);
    setError(null);

    // Check username availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (existing) {
      setError('That username is already taken.');
      setLoading(false);
      return;
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          school_id: schoolId,
        },
      },
    });

    if (signUpError) {
      const friendlyMessages: Record<string, string> = {
        'User already registered': 'An account with this email already exists.',
      };
      setError(friendlyMessages[signUpError.message] || signUpError.message);
      setLoading(false);
      return;
    }

    if (authData.session) {
      router.replace('/(tabs)/feed');
    } else if (authData.user) {
      // Email confirmation required
      setError('Check your email to confirm your account before signing in.');
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.title}>CFB Social</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Join CFB Social</Text>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="your_handle"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={24}
            />
          </View>

          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.hint}>Minimum 8 characters</Text>
          </View>

          <View>
            <Text style={styles.label}>Your School</Text>
            <View style={styles.pickerContainer}>
              {Platform.OS === 'ios' || Platform.OS === 'android' ? (
                <Picker
                  selectedValue={schoolId}
                  onValueChange={setSchoolId}
                  style={styles.picker}
                >
                  <Picker.Item label="Select your school..." value="" />
                  {schools.map((school) => (
                    <Picker.Item
                      key={school.id}
                      label={`${school.name} ${school.mascot}`}
                      value={school.id}
                    />
                  ))}
                </Picker>
              ) : (
                <TextInput
                  style={styles.input}
                  value={schoolId}
                  onChangeText={setSchoolId}
                  placeholder="Enter school ID"
                  placeholderTextColor={colors.textMuted}
                />
              )}
            </View>
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>
        </View>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
