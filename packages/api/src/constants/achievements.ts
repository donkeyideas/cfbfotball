// ============================================================
// Achievement Definitions (for seeding)
// ============================================================

export interface AchievementDef {
  slug: string;
  name: string;
  description: string;
  category: 'SOCIAL' | 'PREDICTION' | 'RIVALRY' | 'RECRUITING' | 'ENGAGEMENT' | 'MILESTONE';
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ENGAGEMENT
  { slug: 'first_take', name: 'First Take', description: 'File your first post', category: 'ENGAGEMENT', xp_reward: 25, requirement_type: 'post_count', requirement_value: 1 },
  { slug: 'hot_take_artist', name: 'Hot Take Artist', description: 'File 10 posts', category: 'ENGAGEMENT', xp_reward: 50, requirement_type: 'post_count', requirement_value: 10 },
  { slug: 'columnist', name: 'Columnist', description: 'File 50 posts', category: 'ENGAGEMENT', xp_reward: 100, requirement_type: 'post_count', requirement_value: 50 },
  { slug: 'beat_writer', name: 'Beat Writer', description: 'File 100 posts', category: 'ENGAGEMENT', xp_reward: 200, requirement_type: 'post_count', requirement_value: 100 },

  // SOCIAL
  { slug: 'first_touchdown', name: 'First Touchdown', description: 'Receive your first Touchdown vote', category: 'SOCIAL', xp_reward: 25, requirement_type: 'touchdown_count', requirement_value: 1 },
  { slug: 'crowd_favorite', name: 'Crowd Favorite', description: 'Receive 50 Touchdown votes', category: 'SOCIAL', xp_reward: 100, requirement_type: 'touchdown_count', requirement_value: 50 },
  { slug: 'mvp', name: 'MVP', description: 'Receive 500 Touchdown votes', category: 'SOCIAL', xp_reward: 250, requirement_type: 'touchdown_count', requirement_value: 500 },
  { slug: 'first_follower', name: 'Press Pass', description: 'Get your first follower', category: 'SOCIAL', xp_reward: 25, requirement_type: 'follower_count', requirement_value: 1 },
  { slug: 'influencer', name: 'CFB Influencer', description: 'Reach 50 followers', category: 'SOCIAL', xp_reward: 150, requirement_type: 'follower_count', requirement_value: 50 },

  // PREDICTION
  { slug: 'crystal_ball', name: 'Crystal Ball', description: 'Make your first correct prediction', category: 'PREDICTION', xp_reward: 50, requirement_type: 'correct_predictions', requirement_value: 1 },
  { slug: 'prediction_guru', name: 'Prediction Guru', description: 'Make 10 correct predictions', category: 'PREDICTION', xp_reward: 200, requirement_type: 'correct_predictions', requirement_value: 10 },
  { slug: 'oracle', name: 'The Oracle', description: 'Make 25 correct predictions', category: 'PREDICTION', xp_reward: 500, requirement_type: 'correct_predictions', requirement_value: 25 },

  // RIVALRY
  { slug: 'first_challenge', name: 'Challenger', description: 'Win your first challenge', category: 'RIVALRY', xp_reward: 50, requirement_type: 'challenge_wins', requirement_value: 1 },
  { slug: 'rivalry_champion', name: 'Rivalry Champion', description: 'Win 10 challenges', category: 'RIVALRY', xp_reward: 200, requirement_type: 'challenge_wins', requirement_value: 10 },
  { slug: 'undefeated', name: 'Undefeated', description: 'Win 25 challenges', category: 'RIVALRY', xp_reward: 500, requirement_type: 'challenge_wins', requirement_value: 25 },

  // RECRUITING
  { slug: 'scout', name: 'Scout', description: 'File your first portal claim', category: 'RECRUITING', xp_reward: 25, requirement_type: 'portal_claims', requirement_value: 1 },
  { slug: 'insider', name: 'Insider', description: 'Get a portal claim correct', category: 'RECRUITING', xp_reward: 100, requirement_type: 'correct_claims', requirement_value: 1 },

  // MILESTONE
  { slug: 'starter', name: 'Starter', description: 'Reach Starter dynasty tier', category: 'MILESTONE', xp_reward: 50, requirement_type: 'level', requirement_value: 4 },
  { slug: 'all_conference', name: 'All-Conference', description: 'Reach All-Conference dynasty tier', category: 'MILESTONE', xp_reward: 100, requirement_type: 'level', requirement_value: 7 },
  { slug: 'all_american', name: 'All-American', description: 'Reach All-American dynasty tier', category: 'MILESTONE', xp_reward: 200, requirement_type: 'level', requirement_value: 10 },
  { slug: 'heisman', name: 'Heisman', description: 'Reach Heisman dynasty tier', category: 'MILESTONE', xp_reward: 500, requirement_type: 'level', requirement_value: 14 },
  { slug: 'hall_of_fame', name: 'Hall of Fame', description: 'Reach Hall of Fame dynasty tier', category: 'MILESTONE', xp_reward: 1000, requirement_type: 'level', requirement_value: 18 },
];
