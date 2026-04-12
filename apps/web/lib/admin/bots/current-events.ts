/**
 * Current CFB context for bot prompt injection.
 * Keeps bots grounded in real-world college football events so their posts
 * feel timely rather than generic. Update this file each month during the
 * off-season and weekly during the season.
 *
 * IMPORTANT: Every fact here must be accurate as of the lastUpdated date.
 * Players who have declared for the NFL Draft or graduated MUST be removed.
 * The AI will parrot whatever is in this file.
 */

export const CURRENT_CFB_CONTEXT = {
  /**
   * Timeline awareness block - injected at the TOP of every prompt
   * so the AI knows exactly what time period it's operating in.
   */
  timelineReminder: `
TODAY IS APRIL 2026. The 2025 college football season is OVER. The 2026 NFL Draft is happening RIGHT NOW (April 24-26, 2026).
Spring practice is underway at most programs. The 2026 season does not start until late August.
DO NOT reference any current games, scores, or "this weekend's game" -- there are NO games right now.
DO NOT mention players who left for the NFL Draft -- they are GONE. If you are unsure whether a player is still on a team, DO NOT name them.
Talk about: spring practice, the portal, recruiting classes, coaching changes, offseason storylines, and predictions for 2026.
`.trim(),

  transferPortalHighlights: [
    'Dylan Raiola transferred from Nebraska to Oregon -- competing with Dante Moore for the starting QB job this spring',
    'Darian Mensah left Tulane for Miami -- 2026 Heisman dark horse after throwing for 3,973 yards and 34 TDs',
    'Oklahoma State brought in 50 portal transfers under new HC Eric Morris in one of the biggest roster overhauls ever',
    'DJ Lagway entered the portal from Florida after a rough sophomore season -- destination still unknown',
    'Colorado under Deion Sanders assembled a 43-man transfer class, the most in CFB history',
    'Alabama used the portal aggressively to revamp its offensive line ahead of 2026',
    'Indiana is hunting portal reinforcements to replace production lost after their 2025 title run',
    'The spring transfer portal window was eliminated starting 2026 -- all moves happen in the winter window now',
  ],
  recruitingHeadlines: [
    "Oregon's 2026 class features five 5-star recruits -- the best haul in program history",
    'Georgia landed 5-star TE Kaiden Prothro to anchor the next generation of Bulldog pass-catchers',
    'Texas stacked its 2026 haul with 5-star QB Dia Bell and Edge Richard Wesley',
    "Miami's Jackson Cantwell, the #2 overall prospect (5-star OT), headlines the Hurricanes' 2026 class",
    'Notre Dame sits at #4 nationally in 2026 recruiting with 18 top-300 prospects',
    "Texas A&M secured 5-star CB Brandon Arrington for the Aggies' 2026 secondary",
    'The SEC and Big Ten are once again dominating the top of the 2026 team recruiting rankings',
    'NIL is leveling the playing field -- five-star prospects are spread across more programs than ever',
  ],
  springPracticeStories: [
    'Ohio State is working in six new defensive starters this spring after heavy departures to the NFL',
    'Alabama is using spring ball to gel a portal-heavy offensive line with returning skill players',
    "Indiana faces the challenge of replacing key contributors from their 2025 national championship squad",
    "Colorado's 43-man transfer class is the most talked-about spring storyline -- can Sanders finally make it work?",
    'Oregon has a genuine QB competition between Dante Moore and portal arrival Dylan Raiola',
    'Oklahoma State is essentially installing a brand-new program under Eric Morris with 50 new faces',
  ],
  hotTopics: [
    'Is the SEC still the best conference or has parity finally arrived across the Power Four?',
    'The new NIL revenue-sharing model caps at $20.5M per school -- will it create parity or just shift the arms race?',
    "Is Indiana a true dynasty in the making or a one-year wonder after their 2025 national title?",
    'Oregon vs Georgia: who is the real favorite for the 2026 CFP?',
    "Deion Sanders and Colorado assembled the biggest portal class ever -- is this finally the year it clicks?",
    'Oklahoma State went scorched-earth with 50 portal players under Eric Morris -- bold rebuild or recipe for disaster?',
    'The 2026 NFL Draft is happening this week -- which programs lost the most talent?',
    'Spring practice takeaways: which teams look the most improved heading into summer?',
  ],
  /** Reference links bots can share in posts. Diverse sources -- do NOT favor any single outlet. */
  referenceLinks: {
    // Team pages -- spread across ESPN, CBS, 247Sports, and official sites
    teams: {
      Oregon: 'https://247sports.com/college/oregon/',
      Alabama: 'https://www.cbssports.com/college-football/teams/ALA/alabama-crimson-tide/',
      Georgia: 'https://www.on3.com/teams/georgia-bulldogs/',
      'Ohio State': 'https://247sports.com/college/ohio-state/',
      Texas: 'https://www.on3.com/teams/texas-longhorns/',
      Miami: 'https://247sports.com/college/miami/',
      Colorado: 'https://www.cbssports.com/college-football/teams/COLO/colorado-buffaloes/',
      'Oklahoma State': 'https://www.on3.com/teams/oklahoma-state-cowboys/',
      Indiana: 'https://247sports.com/college/indiana/',
      'Notre Dame': 'https://www.cbssports.com/college-football/teams/ND/notre-dame-fighting-irish/',
      'Texas A&M': 'https://247sports.com/college/texas-am/',
      Clemson: 'https://www.on3.com/teams/clemson-tigers/',
      Michigan: 'https://www.cbssports.com/college-football/teams/MICH/michigan-wolverines/',
      LSU: 'https://247sports.com/college/lsu/',
      USC: 'https://www.on3.com/teams/usc-trojans/',
      Florida: 'https://247sports.com/college/florida/',
      Auburn: 'https://www.cbssports.com/college-football/teams/AUB/auburn-tigers/',
      Tennessee: 'https://www.on3.com/teams/tennessee-volunteers/',
      Penn_State: 'https://247sports.com/college/penn-state/',
      Oklahoma: 'https://www.cbssports.com/college-football/teams/OKLA/oklahoma-sooners/',
    } as Record<string, string>,
    // Recruiting / portal resources -- multiple outlets
    recruiting: [
      { label: '247Sports Team Rankings 2026', url: 'https://247sports.com/season/2026-football/compositeteamrankings/' },
      { label: 'On3 Transfer Portal', url: 'https://www.on3.com/transfer-portal/football/' },
      { label: 'Rivals Recruiting', url: 'https://n.rivals.com/team_rankings/2026/all-teams/football' },
      { label: 'CBS Sports Recruiting', url: 'https://www.cbssports.com/college-football/news/college-football-recruiting-rankings/' },
      { label: 'Yahoo Sports CFB', url: 'https://sports.yahoo.com/college-football/' },
    ],
    // Draft -- multiple outlets
    draft: [
      { label: 'NFL Draft Tracker', url: 'https://www.nfl.com/draft/' },
      { label: 'CBS Sports NFL Draft', url: 'https://www.cbssports.com/nfl/draft/' },
      { label: 'The Athletic NFL Draft', url: 'https://www.nytimes.com/athletic/nfl/draft/' },
    ],
    // General CFB news -- multiple outlets for variety
    general: [
      { label: 'CBS Sports College Football', url: 'https://www.cbssports.com/college-football/' },
      { label: 'Yahoo Sports College Football', url: 'https://sports.yahoo.com/college-football/' },
      { label: 'Sports Illustrated CFB', url: 'https://www.si.com/college-football' },
      { label: 'FOX Sports College Football', url: 'https://www.foxsports.com/college-football' },
      { label: '247Sports News', url: 'https://247sports.com/college/football/' },
      { label: 'On3 College Football', url: 'https://www.on3.com/college-football/' },
      { label: 'The Athletic CFB', url: 'https://www.nytimes.com/athletic/college-football/' },
    ],
  },
  seasonYear: '2026',
  lastUpdated: '2026-04-12',
};

/**
 * Formats the current CFB context into a single string suitable for
 * injection into an LLM system/user prompt.
 */
export function buildNewsContextString(): string {
  const timeline = CURRENT_CFB_CONTEXT.timelineReminder;
  const portal = CURRENT_CFB_CONTEXT.transferPortalHighlights.join(' | ');
  const recruiting = CURRENT_CFB_CONTEXT.recruitingHeadlines.join(' | ');
  const spring = CURRENT_CFB_CONTEXT.springPracticeStories.join(' | ');
  const topics = CURRENT_CFB_CONTEXT.hotTopics.join(' | ');

  // Build a compact links section the AI can pick from — diverse sources
  const refs = CURRENT_CFB_CONTEXT.referenceLinks;
  // Shuffle team links so no single source always appears first
  const teamEntries = Object.entries(refs.teams);
  for (let i = teamEntries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teamEntries[i], teamEntries[j]] = [teamEntries[j]!, teamEntries[i]!];
  }
  const teamLinks = teamEntries.map(([name, url]) => `${name}: ${url}`).join(' | ');
  const recruitLinks = refs.recruiting.map(r => `${r.label}: ${r.url}`).join(' | ');
  const draftLinks = refs.draft.map(r => `${r.label}: ${r.url}`).join(' | ');
  const generalLinks = refs.general.map(r => `${r.label}: ${r.url}`).join(' | ');

  return [
    timeline,
    '',
    `CURRENT CFB NEWS YOU KNOW ABOUT (as of ${CURRENT_CFB_CONTEXT.lastUpdated}):`,
    `Transfer portal: ${portal}`,
    `Recruiting: ${recruiting}`,
    `Spring practice: ${spring}`,
    `Hot topics: ${topics}`,
    '',
    'LINKS YOU CAN SHARE (use sparingly, only when relevant to your post -- use a VARIETY of sources, do NOT always use the same site):',
    `Team pages: ${teamLinks}`,
    `Recruiting/Portal: ${recruitLinks}`,
    `NFL Draft: ${draftLinks}`,
    `General CFB news: ${generalLinks}`,
  ].join('\n');
}

/**
 * Get a team ESPN page URL by school name (fuzzy match).
 */
export function getTeamLink(schoolName: string): string | null {
  const teams = CURRENT_CFB_CONTEXT.referenceLinks.teams;
  // Exact match
  if (teams[schoolName]) return teams[schoolName];
  // Fuzzy
  const lower = schoolName.toLowerCase();
  for (const [name, url] of Object.entries(teams)) {
    if (name.toLowerCase().includes(lower) || lower.includes(name.toLowerCase())) return url;
  }
  return null;
}

/**
 * Returns a random hot topic string for bot post generation.
 */
export function getRandomHotTopic(): string {
  const topics = CURRENT_CFB_CONTEXT.hotTopics;
  return topics[Math.floor(Math.random() * topics.length)] ?? topics[0]!;
}

/**
 * Returns a random transfer portal highlight for bot post generation.
 */
export function getRandomPortalMove(): string {
  const moves = CURRENT_CFB_CONTEXT.transferPortalHighlights;
  return moves[Math.floor(Math.random() * moves.length)] ?? moves[0]!;
}
