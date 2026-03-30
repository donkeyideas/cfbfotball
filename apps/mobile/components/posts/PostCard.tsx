import { memo } from 'react';
import { TicketStubCard } from './TicketStubCard';
import { NewspaperClippingCard } from './NewspaperClippingCard';
import { PenaltyFlagCard } from './PenaltyFlagCard';
import { SidelineReportCard } from './SidelineReportCard';

export interface PostData {
  id: string;
  content: string;
  post_type: string;
  status: string;
  author_id: string;
  school_id: string | null;
  touchdown_count: number;
  fumble_count: number;
  reply_count: number;
  repost_count: number;
  created_at: string;
  moderation_reason: string | null;
  moderation_labels: string[] | null;
  /** Pre-fetched user interaction status (set by batch query in feed) */
  _userVote?: 'TD' | 'FUMBLE' | null;
  _userReposted?: boolean;
  _userSaved?: boolean;
  author?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    dynasty_tier: string | null;
    school?: {
      abbreviation: string;
      primary_color: string;
      slug: string | null;
    } | null;
  } | null;
}

interface PostCardProps {
  post: PostData;
}

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  // Flagged posts always render as penalty flag card
  if (post.status === 'FLAGGED') {
    return <PenaltyFlagCard post={post} />;
  }

  // Receipt and prediction posts render as newspaper clippings
  if (post.post_type === 'RECEIPT' || post.post_type === 'PREDICTION') {
    return <NewspaperClippingCard post={post} />;
  }

  // Sideline reports for live game posts
  if (post.post_type === 'SIDELINE') {
    return <SidelineReportCard post={post} />;
  }

  // Default: standard ticket stub card
  return <TicketStubCard post={post} />;
});
