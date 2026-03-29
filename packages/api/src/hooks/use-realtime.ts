// ============================================================
// Realtime Hooks - Subscribe to live data changes
// ============================================================

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { createBrowserClient } from '../client';
import type { PostRow, NotificationRow } from '@cfb-social/types';

interface GameChatMessage {
  id: string;
  game_thread_id: string;
  user_id: string;
  content: string;
  message_type: string;
  created_at: string;
}

/**
 * Subscribe to real-time feed updates for published posts.
 * Optionally filter by school ID.
 * Returns new posts as they are inserted.
 */
export function useRealtimeFeed(schoolId?: string) {
  const [newPosts, setNewPosts] = useState<PostRow[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    const filter = schoolId
      ? `status=eq.PUBLISHED,school_id=eq.${schoolId}`
      : `status=eq.PUBLISHED`;

    channelRef.current = supabase
      .channel(`feed:${schoolId ?? 'global'}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter,
        },
        (payload) => {
          const newPost = payload.new as PostRow;
          // Only add top-level posts (not replies)
          if (!newPost.parent_id) {
            setNewPosts((prev) => [newPost, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [schoolId]);

  const clearNewPosts = useCallback(() => {
    setNewPosts([]);
  }, []);

  return { newPosts, clearNewPosts };
}

/**
 * Subscribe to real-time notifications for the current user.
 * Returns new notifications as they arrive.
 */
export function useRealtimeNotifications(userId?: string | null) {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createBrowserClient();

    channelRef.current = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as NotificationRow;
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId]);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAllRead };
}

/**
 * Subscribe to real-time game thread chat messages.
 * Returns new messages as they are inserted.
 */
export function useRealtimeGameChat(threadId: string) {
  const [messages, setMessages] = useState<GameChatMessage[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();

    channelRef.current = supabase
      .channel(`game-chat:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_thread_messages',
          filter: `game_thread_id=eq.${threadId}`,
        },
        (payload) => {
          const msg = payload.new as GameChatMessage;
          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [threadId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, clearMessages };
}
