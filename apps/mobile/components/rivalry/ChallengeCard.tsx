import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/lib/theme/ThemeProvider';
import { withAlpha } from '@/lib/theme/utils';
import { typography } from '@/lib/theme/typography';
import { Avatar } from '@/components/ui/Avatar';
import type { ColorPalette } from '@/lib/theme/palettes';

export interface ChallengeProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  dynasty_tier: string | null;
}

export interface ChallengeData {
  id: string;
  topic: string;
  status: string | null;
  challenger_argument: string | null;
  challenged_argument: string | null;
  challenger_votes: number | null;
  challenged_votes: number | null;
  voting_ends_at: string | null;
  created_at: string | null;
  challenger: ChallengeProfile | null;
  challenged: ChallengeProfile | null;
  winner_id: string | null;
}

interface ChallengeCardProps {
  challenge: ChallengeData;
}

function getStatusStyle(status: string | null, colors: ColorPalette) {
  switch (status) {
    case 'ACTIVE':
    case 'VOTING':
      return { bg: withAlpha(colors.success, 0.13), text: colors.success, label: 'ACTIVE' };
    case 'COMPLETED':
      return { bg: withAlpha(colors.secondary, 0.13), text: colors.secondary, label: 'COMPLETED' };
    case 'PENDING':
      return { bg: withAlpha(colors.warning, 0.13), text: colors.warning, label: 'PENDING' };
    default:
      return { bg: withAlpha(colors.textMuted, 0.13), text: colors.textMuted, label: status ?? 'UNKNOWN' };
  }
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const colors = useColors();
  const router = useRouter();
  const statusStyle = getStatusStyle(challenge.status, colors);
  const challengerVotes = challenge.challenger_votes ?? 0;
  const challengedVotes = challenge.challenged_votes ?? 0;
  const totalVotes = challengerVotes + challengedVotes;

  const styles = useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 12,
      marginBottom: 8,
    },
    statusText: {
      fontFamily: typography.mono,
      fontSize: 9,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    topic: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      color: colors.ink,
      marginBottom: 14,
    },
    participants: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    participant: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    participantInfo: {
      flex: 1,
    },
    participantName: {
      fontFamily: typography.sansSemiBold,
      fontSize: 13,
      color: colors.ink,
    },
    participantRole: {
      fontFamily: typography.mono,
      fontSize: 9,
      color: colors.textMuted,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginTop: 1,
    },
    vsLabel: {
      fontFamily: typography.serifBold,
      fontSize: 14,
      color: colors.textMuted,
      paddingHorizontal: 8,
    },
    voteSummary: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    voteLabel: {
      fontFamily: typography.serifBold,
      fontSize: 16,
      color: colors.ink,
    },
    voteMeta: {
      fontFamily: typography.mono,
      fontSize: 10,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
  }), [colors]);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/rivalry/challenge/${challenge.id}` as never)}
    >
      {/* Status badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {statusStyle.label}
        </Text>
      </View>

      {/* Topic */}
      <Text style={styles.topic}>{challenge.topic}</Text>

      {/* Participants */}
      <View style={styles.participants}>
        <View style={styles.participant}>
          <Avatar
            url={challenge.challenger?.avatar_url}
            name={challenge.challenger?.display_name ?? challenge.challenger?.username}
            size={36}
          />
          <View style={styles.participantInfo}>
            <Text style={styles.participantName} numberOfLines={1}>
              {challenge.challenger?.display_name ?? challenge.challenger?.username ?? 'Unknown'}
            </Text>
            <Text style={styles.participantRole}>Challenger</Text>
          </View>
        </View>

        <Text style={styles.vsLabel}>VS</Text>

        <View style={styles.participant}>
          <Avatar
            url={challenge.challenged?.avatar_url}
            name={challenge.challenged?.display_name ?? challenge.challenged?.username}
            size={36}
          />
          <View style={styles.participantInfo}>
            <Text style={styles.participantName} numberOfLines={1}>
              {challenge.challenged?.display_name ?? challenge.challenged?.username ?? 'Unknown'}
            </Text>
            <Text style={styles.participantRole}>Challenged</Text>
          </View>
        </View>
      </View>

      {/* Vote counts (if active/completed) */}
      {totalVotes > 0 && (
        <View style={styles.voteSummary}>
          <Text style={styles.voteLabel}>
            {challengerVotes} - {challengedVotes}
          </Text>
          <Text style={styles.voteMeta}>
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
