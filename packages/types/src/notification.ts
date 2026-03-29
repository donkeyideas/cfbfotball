// ============================================================
// Notification Types
// ============================================================

import type { NotificationType } from './enums';

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  postId: string | null;
  challengeId: string | null;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationRow {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: string;
  post_id: string | null;
  challenge_id: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  followNotifications: boolean;
  reactionNotifications: boolean;
  replyNotifications: boolean;
  challengeNotifications: boolean;
  rivalryNotifications: boolean;
  moderationNotifications: boolean;
  marketingNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferencesRow {
  id: string;
  user_id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  follow_notifications: boolean;
  reaction_notifications: boolean;
  reply_notifications: boolean;
  challenge_notifications: boolean;
  rivalry_notifications: boolean;
  moderation_notifications: boolean;
  marketing_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    actorId: row.actor_id,
    type: row.type as NotificationType,
    postId: row.post_id,
    challengeId: row.challenge_id,
    data: row.data,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export function toNotificationPreferences(row: NotificationPreferencesRow): NotificationPreferences {
  return {
    id: row.id,
    userId: row.user_id,
    pushEnabled: row.push_enabled,
    emailEnabled: row.email_enabled,
    followNotifications: row.follow_notifications,
    reactionNotifications: row.reaction_notifications,
    replyNotifications: row.reply_notifications,
    challengeNotifications: row.challenge_notifications,
    rivalryNotifications: row.rivalry_notifications,
    moderationNotifications: row.moderation_notifications,
    marketingNotifications: row.marketing_notifications,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
