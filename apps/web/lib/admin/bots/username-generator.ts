// ============================================================
// Bot Username Generator
// Generates realistic college football fan usernames that
// look like they were created by actual humans, not bots.
// ============================================================

export interface SchoolInfo {
  name: string;
  mascot: string;
  abbreviation: string;
}

// ============================================================
// Name pools
// ============================================================

const FIRST_NAMES = [
  'Jake', 'Marcus', 'Drew', 'Chris', 'Mike', 'Dave', 'Rob', 'Sarah', 'Terri', 'Ashley',
  'Brandon', 'Tyler', 'Kevin', 'Matt', 'Ryan', 'Josh', 'Nick', 'Zach', 'Kyle', 'Dan',
  'Steve', 'Alex', 'Ben', 'Tom', 'Eric', 'Brian', 'Derek', 'Travis', 'Cody', 'Luke',
  'Clay', 'Grant', 'Trey', 'Cole', 'Hunter', 'Jordan', 'Sean', 'Blake', 'Chad', 'Brett',
  'Jess', 'Megan', 'Katie', 'Lauren', 'Brooke', 'Haley', 'Taylor', 'Morgan', 'Kelsey', 'Paige',
];

const ADJECTIVES = [
  'Angry', 'Loyal', 'Proud', 'Real', 'True', 'Big', 'Old', 'Young',
  'Loud', 'Wild', 'Bold', 'Pure', 'Raw', 'Honest', 'Rowdy', 'Fired',
  'Diehard', 'Crazy', 'Mad', 'Legit', 'Solid', 'Chief', 'Major', 'All',
];

const CFB_WORDS = [
  'Gridiron', 'Saturday', 'Gameday', 'Tailgate', 'Endzone', 'Redzone',
  'Pigskin', 'Sideline', 'Huddle', 'Blitz', 'Kickoff', 'Overtime',
  'Halftime', 'FourthDown', 'GoalLine', 'Trenches', 'TwoDeep',
  'PlayAction', 'Shotgun', 'Wildcat', 'TDrive', 'TurnoverChain',
  'PickSix', 'Heisman', 'FrontSeven',
];

const TAKE_SUFFIXES = [
  'takes', 'cfb', 'szn', 'tape', 'film', 'scout',
];

const CASUAL_WORDS = [
  'Scorched', 'Wired', 'Loaded', 'Junkie', 'Addict', 'Fiend',
  'Obsessed', 'AllDay', 'NoFilter', 'NoChill', 'Uncut', 'LiveWire',
];

const YEAR_POOL = [
  '23', '24', '22', '21', '99', '98', '97', '96', '94', '93',
  '91', '88', '87', '85', '84', '82', '76', '03', '04', '05',
  '06', '07', '08', '09', '11', '12', '13', '14', '15', '17',
];

// ============================================================
// School-specific mascot slang / fan shorthand
// Maps school name fragments or abbreviations to fan-style refs
// ============================================================

const SCHOOL_SLANG: Record<string, string[]> = {
  // SEC
  'Alabama': ['RollTide', 'BamaNation', 'Tide', 'CrimsonTide', 'RTR'],
  'Georgia': ['GoDawgs', 'Dawg', 'DawgNation', 'Bulldog', 'UGA'],
  'LSU': ['GeauxTigers', 'Geaux', 'TigerBait', 'BatonRouge', 'Bayou'],
  'Florida': ['Gator', 'GatorNation', 'Chomp', 'Swamp', 'GoGators'],
  'Auburn': ['WarEagle', 'AuburnFam', 'TigerWalk', 'PlainsTiger'],
  'Tennessee': ['VolNation', 'GBO', 'RockyTop', 'VFL', 'BigOrange'],
  'Texas A&M': ['GigEm', 'Aggie', 'AggieNation', 'Maroon', 'TwelfthMan'],
  'Ole Miss': ['HottyToddy', 'Rebel', 'OleMissFan', 'GroveLife'],
  'Mississippi State': ['HailState', 'Bulldog', 'CowbellFan', 'Clanga'],
  'Missouri': ['MIZ', 'MizzouFan', 'Tiger', 'ZOU'],
  'South Carolina': ['Gamecock', 'Spurs', 'GoGamecocks', 'ColaFan'],
  'Arkansas': ['WPS', 'WoooPig', 'Razorback', 'HogFan', 'GoHogs'],
  'Kentucky': ['BBN', 'Wildcat', 'UKFan', 'BigBlueFan'],
  'Vanderbilt': ['AnchorDown', 'Commodore', 'VandyFan', 'Dore'],
  'Oklahoma': ['BoomerSooner', 'Boomer', 'Sooner', 'SoonerNation'],

  // Big Ten
  'Ohio State': ['Buckeye', 'GoBucks', 'BuckeyeNation', 'OhioSt', 'THE'],
  'Michigan': ['GoBlue', 'Wolverine', 'MaizeAndBlue', 'BigHouse'],
  'Penn State': ['WeAre', 'NittanyLion', 'PSUFan', 'HappyValley', 'WhiteOut'],
  'Wisconsin': ['OnWisconsin', 'Badger', 'BadgerNation', 'MadisonFan'],
  'Iowa': ['HawkeyeNation', 'Hawkeye', 'GoHawks', 'KinnickFan'],
  'Michigan State': ['GoGreen', 'Spartan', 'SpartanDawg', 'MSUFan'],
  'Minnesota': ['SkiUMah', 'Gopher', 'RowTheBoat', 'GoldGopher'],
  'Nebraska': ['GBR', 'Husker', 'CornNation', 'BigRed', 'GoHuskers'],
  'Oregon': ['GoDucks', 'Duck', 'DuckNation', 'Autzen', 'ScoDucks'],
  'USC': ['FightOn', 'Trojan', 'TrojanNation', 'SCFan'],
  'UCLA': ['GoBruins', 'Bruin', 'FourBruin', 'UCLAFan'],
  'Washington': ['GoDawgs', 'Husky', 'PurpleReign', 'UDub'],
  'Illinois': ['Illini', 'ILL', 'FightingIllini', 'IlliniNation'],
  'Indiana': ['GoHoosiers', 'Hoosier', 'IUFan', 'CreamCrimson'],
  'Purdue': ['BoilerUp', 'Boilermaker', 'PurduePete', 'BoilerFan'],
  'Rutgers': ['RUIT', 'ScarletKnight', 'BanksRU', 'ChopFan'],
  'Maryland': ['FearTheTurtle', 'Terp', 'TerpNation', 'GoTerps'],
  'Northwestern': ['GoCats', 'Wildcat', 'NUFan', 'CatsNation'],

  // Big 12
  'Texas': ['HookEm', 'Longhorn', 'HornsUp', 'HookEmHorns', 'BurntOrange'],
  'Oklahoma State': ['GoPokes', 'Cowboy', 'PistolsFiring', 'OkState'],
  'TCU': ['GoFrogs', 'HornedFrog', 'FrogNation', 'TCUFan'],
  'Baylor': ['SicEm', 'Bear', 'BaylorBear', 'SicEmBears'],
  'Kansas State': ['EMAW', 'Wildcat', 'KStateFan', 'PurplePride'],
  'Iowa State': ['CyclONE', 'Cyclone', 'CycloneNation', 'ISUFan'],
  'West Virginia': ['LetsGo', 'Mountaineer', 'WVUFan', 'MountaineerNation'],
  'Kansas': ['RockChalk', 'Jayhawk', 'RCJH', 'KUFan'],
  'BYU': ['GoCougs', 'Cougar', 'BYUFan', 'CougarNation'],
  'Cincinnati': ['GoBearcats', 'Bearcat', 'CincyFan', 'NippertFan'],
  'Houston': ['GoCoogs', 'Coog', 'CoogNation', 'UHFan'],
  'UCF': ['ChargeOn', 'Knight', 'KnightNation', 'UCFFan'],
  'Colorado': ['SkoBufss', 'Buff', 'GoBuffs', 'CUFan'],
  'Arizona': ['BearDown', 'Wildcat', 'ZonaFan', 'AZCats'],
  'Arizona State': ['ForksUp', 'SunDevil', 'ASUFan', 'DevilNation'],
  'Utah': ['GoUtes', 'Ute', 'UteNation', 'RedRocks'],

  // ACC
  'Clemson': ['AllIn', 'Tiger', 'ClemsonFam', 'DeathValley', 'TigerTown'],
  'Florida State': ['GoNoles', 'Nole', 'NoleNation', 'Seminole', 'FSUFan'],
  'Miami': ['ItsAllAboutTheU', 'Cane', 'CaneGang', 'TheU', 'MiamiFan'],
  'North Carolina': ['GoHeels', 'TarHeel', 'CarolinaFan', 'UNCFan'],
  'NC State': ['GoPack', 'Wolfpack', 'WolfpackFan', 'PackNation'],
  'Virginia': ['Wahoo', 'Hoo', 'GoHoos', 'CavalierFan'],
  'Virginia Tech': ['GoHokies', 'Hokie', 'HokieNation', 'VTFan'],
  'Duke': ['GoDuke', 'BlueDevil', 'DukeFan', 'BlueDev'],
  'Louisville': ['GoCards', 'Cardinal', 'CardNation', 'LouFan'],
  'Pittsburgh': ['H2P', 'Panther', 'HailToPitt', 'PittFan'],
  'Syracuse': ['CuseNation', 'Orange', 'GoOrange', 'CuseFan'],
  'Boston College': ['ForBoston', 'Eagle', 'BCEagle', 'BCFan'],
  'Wake Forest': ['GoDeacs', 'DemonDeacon', 'DeacNation', 'WakeFan'],
  'Georgia Tech': ['ToHellWithGeorgia', 'Jacket', 'GoJackets', 'GTFan'],
  'Notre Dame': ['GoIrish', 'Irish', 'NDFan', 'IrishNation', 'Touchdown'],
  'SMU': ['PonyUp', 'Mustang', 'SMUFan', 'PonyExpress'],
  'Stanford': ['GoCard', 'Cardinal', 'StanfordFan', 'OnTheFarm'],
  'California': ['GoBears', 'GoldenBear', 'CalFan', 'CalBears'],

  // Pac-12 remnants / others
  'Oregon State': ['GoBeavs', 'Beaver', 'BeavNation', 'OSUFan'],
  'Washington State': ['GoCougs', 'Coug', 'CougNation', 'WSUFan'],
};

// ============================================================
// Utility helpers
// ============================================================

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function coinFlip(probability: number): boolean {
  return Math.random() < probability;
}

/** Random 3-5 digit numeric suffix for extra uniqueness */
function randomDigits(len: number): string {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/** Get school slang terms, falling back to mascot-based refs */
function getSchoolRefs(school: SchoolInfo): string[] {
  // Try matching by school name
  for (const [key, slang] of Object.entries(SCHOOL_SLANG)) {
    if (school.name.includes(key) || key === school.abbreviation) {
      return slang;
    }
  }
  // Fallback: use mascot directly
  const mascot = school.mascot.replace(/\s+/g, '');
  return [mascot, `Go${mascot}`, `${mascot}Fan`, `${mascot}Nation`];
}

/** Sanitize username: remove spaces, limit special chars */
function sanitize(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 30);
}

// ============================================================
// Username generation strategies
// ============================================================

type Strategy = (school: SchoolInfo | null) => string;

/**
 * Pattern: {MascotRef}{Year} -- e.g. GatorDave94, BuckeyeBob_23
 * Used when school is known.
 */
function mascotRefYear(school: SchoolInfo): string {
  const refs = getSchoolRefs(school);
  const ref = pickRandom(refs);
  const name = pickRandom(FIRST_NAMES);
  const sep = pickRandom(['', '_']);

  if (coinFlip(0.5)) {
    // MascotName + optional year
    const base = `${ref}${sep}${name}`;
    return coinFlip(0.4) ? `${base}${pickRandom(YEAR_POOL)}` : base;
  } else {
    // NameMascot + optional year
    const base = `${name}${sep}${ref}`;
    return coinFlip(0.4) ? `${base}${pickRandom(YEAR_POOL)}` : base;
  }
}

/**
 * Pattern: {TeamSlang} -- e.g. RollTideForever, HookEmDaily, GoBlue_MI
 * Used when school is known.
 */
function teamSlang(school: SchoolInfo): string {
  const refs = getSchoolRefs(school);
  const ref = pickRandom(refs);
  const endings = ['Forever', 'Daily', 'Always', 'AllDay', 'Nation', 'Faithful', 'Fam', 'Gang', 'Crew', 'Or Die'];
  const stateAbbrs = ['TX', 'FL', 'OH', 'GA', 'MI', 'PA', 'CA', 'AL', 'LA', 'TN', 'SC', 'NC', 'VA', 'OK'];

  const roll = Math.random();
  if (roll < 0.4) {
    return `${ref}${pickRandom(endings).replace(/\s/g, '')}`;
  } else if (roll < 0.7) {
    return `${ref}_${pickRandom(stateAbbrs)}`;
  } else {
    return coinFlip(0.5)
      ? `${ref}${pickRandom(YEAR_POOL)}`
      : `${ref}${randomDigits(2)}`;
  }
}

/**
 * Pattern: {Name}_{TeamRef} -- e.g. Jake_Dawgs, Marcus_Noles
 * Used when school is known.
 */
function nameTeamRef(school: SchoolInfo): string {
  const refs = getSchoolRefs(school);
  const name = pickRandom(FIRST_NAMES);
  const ref = pickRandom(refs);
  const sep = pickRandom(['_', '']);

  const base = `${name}${sep}${ref}`;
  return coinFlip(0.25) ? `${base}${pickRandom(YEAR_POOL)}` : base;
}

/**
 * Pattern: {Adjective}_{MascotRef} -- e.g. AngryBulldog, LoyalHoosier
 * Used when school is known.
 */
function adjectiveMascotRef(school: SchoolInfo): string {
  const refs = getSchoolRefs(school);
  const adj = pickRandom(ADJECTIVES);
  const ref = pickRandom(refs);
  const sep = pickRandom(['', '_']);

  const base = `${adj}${sep}${ref}`;
  return coinFlip(0.2) ? `${base}${pickRandom(YEAR_POOL)}` : base;
}

/**
 * Pattern: {CasualRef} -- e.g. SaturdayScorched, GridironMike, CFBtapeJunkie
 * Used for any bot, especially no-school neutrals.
 */
function casualRef(): string {
  const roll = Math.random();

  if (roll < 0.3) {
    // CFBword + Name
    const word = pickRandom(CFB_WORDS);
    const name = pickRandom(FIRST_NAMES);
    return `${word}${name}`;
  } else if (roll < 0.5) {
    // Name + CFBword
    const name = pickRandom(FIRST_NAMES);
    const word = pickRandom(CFB_WORDS);
    return `${name}${pickRandom(['_', ''])}${word}`;
  } else if (roll < 0.7) {
    // CFBword + CasualWord
    const word = pickRandom(CFB_WORDS);
    const casual = pickRandom(CASUAL_WORDS);
    return `${word}${casual}`;
  } else if (roll < 0.85) {
    // Adjective + CFBword
    const adj = pickRandom(ADJECTIVES);
    const word = pickRandom(CFB_WORDS);
    return `${adj}${pickRandom(['', '_'])}${word}`;
  } else {
    // CFB + casual + digits
    const word = pickRandom(CFB_WORDS);
    return `${word}${randomDigits(2)}`;
  }
}

/**
 * Pattern: {Name}_takes / {Name}_cfb -- e.g. Brandon_takes, Drew_cfb
 * Used for any bot.
 */
function nameTakeSuffix(): string {
  const name = pickRandom(FIRST_NAMES);
  const suffix = pickRandom(TAKE_SUFFIXES);
  const sep = pickRandom(['_', '']);

  const base = `${name}${sep}${suffix}`;
  return coinFlip(0.2) ? `${base}${pickRandom(YEAR_POOL)}` : base;
}

// ============================================================
// School-affiliated strategies (when we have a school)
// ============================================================

const SCHOOL_STRATEGIES: Strategy[] = [
  (school) => mascotRefYear(school!),
  (school) => teamSlang(school!),
  (school) => nameTeamRef(school!),
  (school) => adjectiveMascotRef(school!),
  () => casualRef(),
  () => nameTakeSuffix(),
];

// Weight distribution: mascotRef 25%, teamSlang 25%, nameTeamRef 20%,
// adjectiveMascot 15%, casual 10%, nameTake 5%
const SCHOOL_WEIGHTS = [25, 25, 20, 15, 10, 5];

// ============================================================
// Neutral strategies (no school)
// ============================================================

const NEUTRAL_STRATEGIES: Strategy[] = [
  () => casualRef(),
  () => nameTakeSuffix(),
];

const NEUTRAL_WEIGHTS = [70, 30];

// ============================================================
// Weighted random selection
// ============================================================

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

// ============================================================
// Collision avoidance set (per-process)
// ============================================================

const usedUsernames = new Set<string>();

// ============================================================
// Public API
// ============================================================

/**
 * Generate a realistic-looking bot username.
 *
 * Uses school context when available to produce team-flavored names.
 * For neutral/no-school bots, generates generic CFB fan names.
 * The personalityType is intentionally NOT embedded in the username.
 *
 * Guarantees uniqueness within the same process by appending random
 * digits if a collision is detected (up to 20 attempts).
 */
export function generateBotUsername(
  school: SchoolInfo | null,
  _personalityType: string
): string {
  // personalityType is accepted for API compatibility but intentionally unused
  // to avoid leaking bot personality into the username

  for (let attempt = 0; attempt < 20; attempt++) {
    let raw: string;

    if (school) {
      const strategy = weightedPick(SCHOOL_STRATEGIES, SCHOOL_WEIGHTS);
      raw = strategy(school);
    } else {
      const strategy = weightedPick(NEUTRAL_STRATEGIES, NEUTRAL_WEIGHTS);
      raw = strategy(null);
    }

    const username = sanitize(raw);

    // Skip too-short results
    if (username.length < 5) continue;

    // Check collision
    const lower = username.toLowerCase();
    if (!usedUsernames.has(lower)) {
      usedUsernames.add(lower);
      return username;
    }

    // On collision, try appending random digits
    if (attempt > 5) {
      const withDigits = `${username}${randomDigits(3)}`;
      const sanitized = sanitize(withDigits);
      const lowerD = sanitized.toLowerCase();
      if (!usedUsernames.has(lowerD)) {
        usedUsernames.add(lowerD);
        return sanitized;
      }
    }
  }

  // Absolute fallback: fully random
  const fallback = `cfbfan${Date.now().toString(36)}${randomDigits(3)}`;
  usedUsernames.add(fallback);
  return fallback;
}

/**
 * Generate a natural-looking display name for a bot.
 *
 * Display names are more readable than usernames and look like
 * what a real person would set as their profile name.
 */
export function generateBotDisplayName(
  school: SchoolInfo | null,
  _personalityType: string
): string {
  const name = pickRandom(FIRST_NAMES);

  if (school) {
    const refs = getSchoolRefs(school);
    const ref = pickRandom(refs);
    const mascot = school.mascot.replace(/\s+/g, ' ').trim();

    const templates = [
      // "Jake from Bama"
      () => `${name} from ${school.name.replace('University of ', '').replace(' University', '')}`,
      // "Drew | Roll Tide"
      () => `${name} | ${ref}`,
      // "Marcus the Bulldog"
      () => `${name} the ${mascot}`,
      // Just "Tyler" with a mascot ref
      () => `${ref} ${name}`,
      // "Chris (Dawgs)"
      () => `${name} (${ref})`,
      // Simple first name + last initial
      () => {
        const lastInitials = 'ABCDEFGHJKLMNPRSTW';
        return `${name} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}.`;
      },
      // "Brandon - Go Dawgs"
      () => `${name} - Go ${mascot}`,
      // Just the slang
      () => ref.replace(/([A-Z])/g, ' $1').trim(),
    ];

    return pickRandom(templates)();
  }

  // Neutral display names
  const neutralTemplates = [
    () => `${name} ${pickRandom(TAKE_SUFFIXES).toUpperCase()}`,
    () => `${name} | CFB`,
    () => {
      const lastInitials = 'ABCDEFGHJKLMNPRSTW';
      return `${name} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}.`;
    },
    () => `${pickRandom(CFB_WORDS)} ${name}`,
    () => `${name} (${pickRandom(CFB_WORDS)})`,
  ];

  return pickRandom(neutralTemplates)();
}
