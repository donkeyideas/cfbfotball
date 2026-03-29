// ============================================================
// Penalty Mapping - Football-themed penalty names for "Flag on the Play" UI
// ============================================================

interface PenaltyInfo {
  /** Football penalty name displayed in the UI */
  name: string;
  /** Explanation shown to the user */
  description: string;
  /** Severity: how many "yards" this penalty costs (used for gamification) */
  yards: number;
}

/**
 * Map moderation labels to football-themed penalty names.
 * Used in the "Flag on the Play" notification UI when content is flagged or rejected.
 */
const PENALTY_MAP: Record<string, PenaltyInfo> = {
  toxicity: {
    name: 'Unsportsmanlike Conduct',
    description: 'Personal attacks and toxic behavior are not tolerated. Keep the trash talk about the game, not the person.',
    yards: 15,
  },
  off_topic_sports: {
    name: 'Illegal Formation',
    description: 'This content appears to be about a different sport. CFB Social is all about college football.',
    yards: 5,
  },
  politics: {
    name: 'False Start',
    description: 'Political discussion is out of bounds here. Keep the focus on college football.',
    yards: 5,
  },
  harassment: {
    name: 'Pass Interference',
    description: 'Targeting or harassing other users disrupts fair play for everyone.',
    yards: 15,
  },
  spam: {
    name: 'Delay of Game',
    description: 'Repetitive, promotional, or spam-like content slows down the game for everyone.',
    yards: 5,
  },
  hate_speech: {
    name: 'Targeting',
    description: 'Hate speech and discriminatory language result in automatic ejection. This is a zero-tolerance violation.',
    yards: 15,
  },
  misinformation: {
    name: 'Intentional Grounding',
    description: 'Presenting false information as fact undermines the community. Verify before you post.',
    yards: 10,
  },
};

/** Default penalty for unrecognized labels */
const DEFAULT_PENALTY: PenaltyInfo = {
  name: 'Personal Foul',
  description: 'This content was flagged for review by our moderation system.',
  yards: 10,
};

/**
 * Get the football penalty info for a set of moderation labels.
 * Returns the penalty for the highest-scoring violation label.
 */
export function getPenaltyType(labels: Record<string, number>): PenaltyInfo {
  // Find the label with the highest score (excluding college_football)
  let highestLabel = '';
  let highestScore = 0;

  for (const [label, score] of Object.entries(labels)) {
    if (label === 'college_football') continue;
    if (score > highestScore) {
      highestScore = score;
      highestLabel = label;
    }
  }

  if (!highestLabel || highestScore < 0.3) {
    return DEFAULT_PENALTY;
  }

  return PENALTY_MAP[highestLabel] ?? DEFAULT_PENALTY;
}

/**
 * Get all applicable penalties for a set of labels (for multi-violation display).
 * Returns penalties for all labels that exceed the threshold score.
 */
export function getAllPenalties(
  labels: Record<string, number>,
  threshold = 0.4
): PenaltyInfo[] {
  const penalties: PenaltyInfo[] = [];

  for (const [label, score] of Object.entries(labels)) {
    if (label === 'college_football') continue;
    if (score >= threshold) {
      penalties.push(PENALTY_MAP[label] ?? DEFAULT_PENALTY);
    }
  }

  // Sort by yards (severity) descending
  return penalties.sort((a, b) => b.yards - a.yards);
}

/**
 * Calculate total penalty yards for gamification (XP deduction).
 */
export function getTotalPenaltyYards(labels: Record<string, number>, threshold = 0.4): number {
  return getAllPenalties(labels, threshold).reduce((sum, p) => sum + p.yards, 0);
}

export type { PenaltyInfo };
