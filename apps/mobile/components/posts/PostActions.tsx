import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useThemedAlert } from '@/lib/AlertProvider';
import { supabase } from '@/lib/supabase';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface PostActionsProps {
  postId: string;
  postAuthorId: string;
  onReport?: () => void;
  /** Pre-fetched status to avoid per-post queries. undefined = not pre-fetched (will query). */
  prefetchedReposted?: boolean;
  prefetchedSaved?: boolean;
}

export function PostActions({ postId, postAuthorId, onReport, prefetchedReposted, prefetchedSaved }: PostActionsProps) {
  const colors = useColors();
  const { userId } = useAuth();
  const { dark } = useSchoolTheme();
  const router = useRouter();
  const { showAlert } = useThemedAlert();
  const [reposted, setReposted] = useState(prefetchedReposted ?? false);
  const [saved, setSaved] = useState(prefetchedSaved ?? false);
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    action: {
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
    actionText: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.textMuted,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    activeText: {
      color: colors.crimson,
    },
    separator: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.border,
      marginHorizontal: 2,
    },
  }), [colors]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Check existing repost/save status on mount (skip if pre-fetched)
  useEffect(() => {
    if (!userId) return;
    if (prefetchedReposted !== undefined && prefetchedSaved !== undefined) return;

    if (prefetchedReposted === undefined) {
      supabase
        .from('reposts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle()
        .then(({ data }) => {
          if (mountedRef.current && data) setReposted(true);
        });
    }

    if (prefetchedSaved === undefined) {
      supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle()
        .then(({ data }) => {
          if (mountedRef.current && data) setSaved(true);
        });
    }
  }, [userId, postId, prefetchedReposted, prefetchedSaved]);

  const requireAuth = useCallback(
    (action: string): boolean => {
      if (!userId) {
        showAlert('Bench Warmer', `You must be signed in to ${action}.`);
        return false;
      }
      return true;
    },
    [userId]
  );

  const handleReply = useCallback(() => {
    router.push(`/post/${postId}` as never);
  }, [postId, router]);

  const handleRepost = useCallback(async () => {
    if (!requireAuth('repost') || busy) return;
    setBusy(true);

    const previousReposted = reposted;

    try {
      if (reposted) {
        setReposted(false);
        const { error } = await supabase
          .from('reposts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId!);
        if (error) throw error;
      } else {
        setReposted(true);
        const { error } = await supabase.from('reposts').insert({
          post_id: postId,
          user_id: userId!,
        });
        if (error) throw error;
      }
    } catch {
      if (mountedRef.current) {
        setReposted(previousReposted);
      }
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }, [reposted, postId, userId, busy, requireAuth]);

  const handleSave = useCallback(async () => {
    if (!requireAuth('save') || busy) return;
    setBusy(true);

    const previousSaved = saved;

    try {
      if (saved) {
        setSaved(false);
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId!);
        if (error) throw error;
      } else {
        setSaved(true);
        const { error } = await supabase.from('bookmarks').insert({
          post_id: postId,
          user_id: userId!,
        });
        if (error) throw error;
      }
    } catch {
      if (mountedRef.current) {
        setSaved(previousSaved);
      }
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }, [saved, postId, userId, busy, requireAuth]);

  const handleFlag = useCallback(() => {
    if (!requireAuth('flag')) return;
    if (onReport) {
      onReport();
    } else {
      showAlert('Flag', 'Report functionality coming soon.');
    }
  }, [requireAuth, onReport]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleReply} style={styles.action}>
        <Text style={styles.actionText}>REPLY</Text>
      </Pressable>

      <Text style={styles.separator}>|</Text>

      <Pressable onPress={handleRepost} style={styles.action}>
        <Text style={[styles.actionText, reposted && [styles.activeText, { color: dark }]]}>
          {reposted ? 'REPOSTED' : 'REPOST'}
        </Text>
      </Pressable>

      <Text style={styles.separator}>|</Text>

      <Pressable onPress={handleSave} style={styles.action}>
        <Text style={[styles.actionText, saved && [styles.activeText, { color: dark }]]}>
          {saved ? 'SAVED' : 'SAVE'}
        </Text>
      </Pressable>

      <Text style={styles.separator}>|</Text>

      <Pressable onPress={handleFlag} style={styles.action}>
        <Text style={styles.actionText}>FLAG</Text>
      </Pressable>
    </View>
  );
}
