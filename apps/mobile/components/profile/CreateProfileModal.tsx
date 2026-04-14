import { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useThemedAlert } from '@/lib/AlertProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface SchoolOption {
  id: string;
  name: string;
  abbreviation: string;
  primary_color: string;
}

interface CreateProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateProfileModal({ visible, onClose }: CreateProfileModalProps) {
  const { session, refreshProfile, switchProfile } = useAuth();
  const { showAlert } = useThemedAlert();
  const { dark } = useSchoolTheme();
  const colors = useColors();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState('');
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchSchools = useCallback(async (query: string) => {
    setSchoolSearch(query);
    if (query.length < 2) {
      setSchools([]);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('schools')
        .select('id, name, abbreviation, primary_color')
        .ilike('name', `%${query}%`)
        .limit(20);
      if (data) setSchools(data as SchoolOption[]);
    }, 300);
  }, []);

  async function handleCreate() {
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3 || cleanUsername.length > 24) {
      setError('Username must be 3-24 characters');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setError('Letters, numbers, and underscores only');
      return;
    }

    if (!session?.user) return;
    setSubmitting(true);

    // Check username uniqueness
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (existing) {
      setError('Username already taken');
      setSubmitting(false);
      return;
    }

    // Check profile count limit
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', session.user.id);

    if ((count ?? 0) >= 5) {
      setError('Maximum 5 profiles per account');
      setSubmitting(false);
      return;
    }

    const newId = crypto.randomUUID();
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: newId,
        owner_id: session.user.id,
        username: cleanUsername,
        display_name: displayName.trim() || null,
        school_id: schoolId,
      })
      .select('id')
      .single();

    if (insertError || !newProfile) {
      setError(insertError?.message ?? 'Failed to create profile');
      setSubmitting(false);
      return;
    }

    await refreshProfile();
    switchProfile(newProfile.id);

    // Reset and close
    setUsername('');
    setDisplayName('');
    setSchoolId(null);
    setSelectedSchoolName('');
    setError('');
    setSubmitting(false);
    onClose();
    showAlert('Touchdown', `Profile @${cleanUsername} created!`);
  }

  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    container: {
      backgroundColor: colors.paper,
      borderRadius: 12,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: typography.serifBold,
      fontSize: 20,
      color: colors.ink,
    },
    closeText: {
      fontFamily: typography.sansBold,
      fontSize: 18,
      color: colors.textMuted,
    },
    body: {
      padding: 20,
      gap: 16,
    },
    errorBox: {
      backgroundColor: `${colors.crimson}15`,
      borderWidth: 1,
      borderColor: colors.crimson,
      borderRadius: 6,
      padding: 10,
    },
    errorText: {
      fontFamily: typography.sans,
      fontSize: 13,
      color: colors.crimson,
    },
    label: {
      fontFamily: typography.sansSemiBold,
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
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
    hint: {
      fontFamily: typography.sans,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },
    schoolSelector: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    schoolSelectorText: {
      fontFamily: typography.sans,
      fontSize: 16,
      color: colors.ink,
    },
    schoolPickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surfaceRaised,
      maxHeight: 200,
      overflow: 'hidden',
      marginTop: 4,
    },
    schoolSearchInput: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.ink,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    schoolItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border}80`,
    },
    schoolDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    schoolItemText: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textPrimary,
      flex: 1,
    },
    noResults: {
      fontFamily: typography.sans,
      fontSize: 13,
      color: colors.textMuted,
      textAlign: 'center',
      padding: 16,
    },
    createButton: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    createButtonText: {
      fontFamily: typography.sansBold,
      fontSize: 16,
      color: '#f4efe4',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  }), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>New Profile</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Username */}
            <View>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                maxLength={24}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="my_alt_account"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.hint}>3-24 characters, letters/numbers/underscores</Text>
            </View>

            {/* Display Name */}
            <View>
              <Text style={styles.label}>Display Name (optional)</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                maxLength={50}
                placeholder="Your display name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* School */}
            <View>
              <Text style={styles.label}>School Affiliation</Text>
              <Pressable
                style={styles.schoolSelector}
                onPress={() => setShowSchoolPicker(!showSchoolPicker)}
              >
                <Text
                  style={[
                    styles.schoolSelectorText,
                    !selectedSchoolName && { color: colors.textMuted },
                  ]}
                >
                  {selectedSchoolName || 'Select a school (optional)'}
                </Text>
              </Pressable>

              {showSchoolPicker && (
                <View style={styles.schoolPickerContainer}>
                  <TextInput
                    style={styles.schoolSearchInput}
                    value={schoolSearch}
                    onChangeText={searchSchools}
                    placeholder="Search schools..."
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                  />
                  <ScrollView
                    style={{ maxHeight: 150 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {schools.length === 0 ? (
                      <Text style={styles.noResults}>
                        {schoolSearch.length >= 2
                          ? 'No schools found'
                          : 'Type at least 2 characters'}
                      </Text>
                    ) : (
                      schools.map((item) => (
                        <Pressable
                          key={item.id}
                          style={styles.schoolItem}
                          onPress={() => {
                            setSchoolId(item.id);
                            setSelectedSchoolName(item.name);
                            setShowSchoolPicker(false);
                            setSchoolSearch('');
                            setSchools([]);
                          }}
                        >
                          <View
                            style={[styles.schoolDot, { backgroundColor: item.primary_color }]}
                          />
                          <Text style={styles.schoolItemText}>
                            {item.name} ({item.abbreviation})
                          </Text>
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Create Button */}
            <Pressable
              style={[
                styles.createButton,
                { backgroundColor: dark },
                (submitting || !username.trim()) && styles.buttonDisabled,
              ]}
              onPress={handleCreate}
              disabled={submitting || !username.trim()}
            >
              {submitting ? (
                <ActivityIndicator color="#f4efe4" />
              ) : (
                <Text style={styles.createButtonText}>Create Profile</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
