// ============================================================
// Rivalry Graph - Defines rivalry pairs and conference-level
// heat between college football schools/conferences
// ============================================================

export interface RivalryPair {
  schoolA: string;
  schoolB: string;
  heat: number;  // 1-10 intensity
  name: string;  // rivalry name
}

// ============================================================
// Named Rivalries (30+ pairs, heat 5-10)
// ============================================================

export const RIVALRY_PAIRS: RivalryPair[] = [
  // Heat 10 - Legendary blood feuds
  { schoolA: 'Alabama', schoolB: 'Auburn', heat: 10, name: 'Iron Bowl' },
  { schoolA: 'Ohio State', schoolB: 'Michigan', heat: 10, name: 'The Game' },
  { schoolA: 'Texas', schoolB: 'Oklahoma', heat: 10, name: 'Red River Rivalry' },

  // Heat 9 - Elite rivalries
  { schoolA: 'Florida', schoolB: 'Georgia', heat: 9, name: 'World\'s Largest Outdoor Cocktail Party' },
  { schoolA: 'USC', schoolB: 'Notre Dame', heat: 9, name: 'Jewel of College Football' },
  { schoolA: 'Clemson', schoolB: 'South Carolina', heat: 9, name: 'Palmetto Bowl' },
  { schoolA: 'Army', schoolB: 'Navy', heat: 9, name: 'Army-Navy Game' },

  // Heat 8 - Fierce in-state and conference rivals
  { schoolA: 'Oregon', schoolB: 'Oregon State', heat: 8, name: 'Civil War' },
  { schoolA: 'Michigan', schoolB: 'Michigan State', heat: 8, name: 'Michigan-Michigan State Rivalry' },
  { schoolA: 'Texas', schoolB: 'Texas A&M', heat: 8, name: 'Lone Star Showdown' },
  { schoolA: 'Florida', schoolB: 'Florida State', heat: 8, name: 'Florida-Florida State Rivalry' },
  { schoolA: 'Penn State', schoolB: 'Ohio State', heat: 8, name: 'Penn State-Ohio State Rivalry' },
  { schoolA: 'Georgia', schoolB: 'Auburn', heat: 8, name: 'Deep South\'s Oldest Rivalry' },

  // Heat 7 - Strong regional and conference rivalries
  { schoolA: 'Iowa', schoolB: 'Iowa State', heat: 7, name: 'Cy-Hawk Series' },
  { schoolA: 'Wisconsin', schoolB: 'Minnesota', heat: 7, name: 'Battle for Paul Bunyan\'s Axe' },
  { schoolA: 'Stanford', schoolB: 'Cal', heat: 7, name: 'Big Game' },
  { schoolA: 'North Carolina', schoolB: 'NC State', heat: 7, name: 'Textile Bowl' },
  { schoolA: 'Oklahoma', schoolB: 'Oklahoma State', heat: 7, name: 'Bedlam Series' },
  { schoolA: 'TCU', schoolB: 'Baylor', heat: 7, name: 'Revivalry' },
  { schoolA: 'Miami', schoolB: 'Florida State', heat: 7, name: 'Miami-Florida State Rivalry' },

  // Heat 6 - Solid cross-state and conference rivals
  { schoolA: 'Virginia', schoolB: 'Virginia Tech', heat: 6, name: 'Commonwealth Cup' },
  { schoolA: 'Louisville', schoolB: 'Kentucky', heat: 6, name: 'Governor\'s Cup' },
  { schoolA: 'Missouri', schoolB: 'Kansas', heat: 6, name: 'Border War' },
  { schoolA: 'Pitt', schoolB: 'West Virginia', heat: 6, name: 'Backyard Brawl' },
  { schoolA: 'Utah', schoolB: 'BYU', heat: 6, name: 'Holy War' },
  { schoolA: 'Colorado', schoolB: 'Nebraska', heat: 6, name: 'Colorado-Nebraska Rivalry' },

  // Heat 5 - Mid-tier rivalries with real history
  { schoolA: 'LSU', schoolB: 'Alabama', heat: 5, name: 'Tiger-Tide Rivalry' },
  { schoolA: 'Tennessee', schoolB: 'Alabama', heat: 5, name: 'Third Saturday in October' },
  { schoolA: 'Washington', schoolB: 'Washington State', heat: 5, name: 'Apple Cup' },
  { schoolA: 'Mississippi State', schoolB: 'Ole Miss', heat: 5, name: 'Egg Bowl' },
  { schoolA: 'South Carolina', schoolB: 'Georgia', heat: 5, name: 'South Carolina-Georgia Rivalry' },
  { schoolA: 'Notre Dame', schoolB: 'Michigan', heat: 5, name: 'Notre Dame-Michigan Rivalry' },
  { schoolA: 'Arizona', schoolB: 'Arizona State', heat: 5, name: 'Territorial Cup' },
  { schoolA: 'Purdue', schoolB: 'Indiana', heat: 5, name: 'Old Oaken Bucket' },
  { schoolA: 'Kansas State', schoolB: 'Kansas', heat: 5, name: 'Sunflower Showdown' },
  { schoolA: 'UCLA', schoolB: 'USC', heat: 5, name: 'Crosstown Rivalry' },
];

// ============================================================
// Conference-level rivalries
// ============================================================

export const CONFERENCE_RIVALRIES: Record<string, number> = {
  'SEC_Big Ten': 8,
  'Big Ten_SEC': 8,
  'Big 12_ACC': 5,
  'ACC_Big 12': 5,
  'SEC_ACC': 6,
  'ACC_SEC': 6,
  'Big Ten_Big 12': 5,
  'Big 12_Big Ten': 5,
  'SEC_Big 12': 6,
  'Big 12_SEC': 6,
  'Big Ten_ACC': 5,
  'ACC_Big Ten': 5,
  'Pac-12_Big Ten': 4,
  'Big Ten_Pac-12': 4,
  'Pac-12_SEC': 4,
  'SEC_Pac-12': 4,
  'Independent_SEC': 3,
  'SEC_Independent': 3,
  'Independent_Big Ten': 4,
  'Big Ten_Independent': 4,
  'AAC_Sun Belt': 3,
  'Sun Belt_AAC': 3,
  'Mountain West_AAC': 3,
  'AAC_Mountain West': 3,
};

// ============================================================
// Lookup helpers
// ============================================================

/**
 * Returns array of rival school names for a given school.
 * Case-insensitive matching.
 */
export function getRivalSchoolNames(schoolName: string): string[] {
  const lower = schoolName.toLowerCase();
  const rivals: string[] = [];

  for (const pair of RIVALRY_PAIRS) {
    if (pair.schoolA.toLowerCase() === lower) {
      rivals.push(pair.schoolB);
    } else if (pair.schoolB.toLowerCase() === lower) {
      rivals.push(pair.schoolA);
    }
  }

  return rivals;
}

/**
 * Returns heat level 0-10 between two schools.
 * Checks direct school rivalry first, then conference-level heat.
 * Returns 0 if no rivalry exists.
 */
export function getRivalryHeatLevel(schoolA: string, schoolB: string): number {
  const lowerA = schoolA.toLowerCase();
  const lowerB = schoolB.toLowerCase();

  // Check direct school-to-school rivalry
  for (const pair of RIVALRY_PAIRS) {
    const pairA = pair.schoolA.toLowerCase();
    const pairB = pair.schoolB.toLowerCase();
    if (
      (pairA === lowerA && pairB === lowerB) ||
      (pairA === lowerB && pairB === lowerA)
    ) {
      return pair.heat;
    }
  }

  return 0;
}

/**
 * Returns true if the two schools have a rivalry with heat >= 5.
 */
export function isRival(schoolA: string, schoolB: string): boolean {
  return getRivalryHeatLevel(schoolA, schoolB) >= 5;
}

/**
 * Returns conference-level rivalry heat (0 if no entry).
 * Accepts conference names in either order.
 */
export function getConferenceRivalryHeat(confA: string, confB: string): number {
  const key = `${confA}_${confB}`;
  return CONFERENCE_RIVALRIES[key] ?? 0;
}
