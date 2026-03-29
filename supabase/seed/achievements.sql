-- =============================================================================
-- CFBSocial Achievement Definitions
-- All achievements use football-themed names and descriptions
-- =============================================================================

-- Truncate existing achievements (safe for re-seeding)
TRUNCATE TABLE achievements CASCADE;

INSERT INTO achievements (slug, name, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES

-- =============================================================================
-- SOCIAL Achievements
-- =============================================================================
('first-post', 'First Down', 'Create your first post', 'football', 'SOCIAL', 25, 'post_count', 1),
('ten-posts', 'Drive Leader', 'Create 10 posts and keep the chains moving', 'trophy', 'SOCIAL', 100, 'post_count', 10),
('fifty-posts', 'Offensive Coordinator', 'Create 50 posts and call the plays', 'clipboard', 'SOCIAL', 250, 'post_count', 50),
('hundred-posts', 'Quarterback', 'Create 100 posts and lead the offense', 'star', 'SOCIAL', 500, 'post_count', 100),
('first-td-received', 'First Touchdown', 'Receive your first TD (like) on a post', 'football', 'SOCIAL', 25, 'td_received_count', 1),
('hundred-tds-received', 'Touchdown Machine', 'Receive 100 TDs across your posts', 'fire', 'SOCIAL', 500, 'td_received_count', 100),

-- =============================================================================
-- PREDICTION Achievements
-- =============================================================================
('first-prediction', 'Coin Toss', 'Make your first game prediction', 'coin', 'PREDICTION', 25, 'prediction_count', 1),
('five-correct-predictions', 'Sharp Bettor', 'Get 5 predictions correct', 'chart', 'PREDICTION', 150, 'correct_prediction_count', 5),
('ten-correct-predictions', 'Oracle of the Gridiron', 'Get 10 predictions correct', 'crystal-ball', 'PREDICTION', 300, 'correct_prediction_count', 10),
('first-receipt-verified', 'Receipt Keeper', 'Have your first prediction receipt verified', 'receipt', 'PREDICTION', 50, 'receipt_verified_count', 1),

-- =============================================================================
-- RIVALRY Achievements
-- =============================================================================
('first-rivalry-vote', 'Pick a Side', 'Cast your first rivalry vote', 'versus', 'RIVALRY', 25, 'rivalry_vote_count', 1),
('enter-the-ring', 'Enter the Ring', 'Participate in your first rivalry matchup', 'ring', 'RIVALRY', 50, 'rivalry_participation_count', 1),
('first-challenge-won', 'Upset Special', 'Win your first rivalry challenge', 'medal', 'RIVALRY', 100, 'challenge_win_count', 1),
('five-challenges-won', 'Rivalry Dominator', 'Win 5 rivalry challenges', 'crown', 'RIVALRY', 300, 'challenge_win_count', 5),

-- =============================================================================
-- RECRUITING Achievements
-- =============================================================================
('first-portal-claim', 'Transfer Portal Scout', 'Make your first transfer portal claim', 'magnifying-glass', 'RECRUITING', 25, 'portal_claim_count', 1),
('correct-portal-claim', 'Good Eye', 'Get a transfer portal prediction correct', 'eye', 'RECRUITING', 75, 'correct_portal_count', 1),
('five-correct-claims', 'Recruiting Coordinator', 'Get 5 transfer portal predictions correct', 'clipboard', 'RECRUITING', 250, 'correct_portal_count', 5),
('scout-master', 'Scout Master', 'Get 10 transfer portal predictions correct', 'binoculars', 'RECRUITING', 500, 'correct_portal_count', 10),

-- =============================================================================
-- ENGAGEMENT Achievements
-- =============================================================================
('first-fact-check', 'Film Room Analyst', 'Submit your first fact check on a post', 'film', 'ENGAGEMENT', 25, 'fact_check_count', 1),
('first-challenge-issued', 'Throw the Flag', 'Issue your first challenge to another user', 'flag', 'ENGAGEMENT', 25, 'challenge_issued_count', 1),
('aging-take-creator', 'Aging Like Fine Wine', 'Create a take that gets revisited after the season', 'wine', 'ENGAGEMENT', 100, 'aging_take_count', 1),

-- =============================================================================
-- MILESTONE Achievements (Level & Tier-based)
-- =============================================================================
('level-5', 'Varsity Letter', 'Reach Level 5', 'badge', 'MILESTONE', 100, 'level', 5),
('level-10', 'Team Captain', 'Reach Level 10', 'captain', 'MILESTONE', 250, 'level', 10),
('level-15', 'Conference Champion', 'Reach Level 15', 'trophy', 'MILESTONE', 400, 'level', 15),
('level-20', 'National Champion', 'Reach Level 20', 'championship', 'MILESTONE', 600, 'level', 20),
('all-conference-tier', 'All-Conference', 'Reach the All-Conference tier', 'ribbon', 'MILESTONE', 300, 'tier', 1),
('all-american-tier', 'All-American', 'Reach the All-American tier', 'shield', 'MILESTONE', 500, 'tier', 2),
('heisman-tier', 'Heisman Contender', 'Reach the Heisman tier', 'heisman', 'MILESTONE', 750, 'tier', 3),
('hall-of-fame-tier', 'Hall of Famer', 'Reach the Hall of Fame tier', 'hall-of-fame', 'MILESTONE', 1000, 'tier', 4);
