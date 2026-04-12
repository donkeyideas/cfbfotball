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
  /** Reference links bots can share in posts. ONLY real, verified URLs. */
  referenceLinks: {
    // Team pages
    teams: {
      Oregon: 'https://www.espn.com/college-football/team/_/id/2483/oregon-ducks',
      Alabama: 'https://www.espn.com/college-football/team/_/id/333/alabama-crimson-tide',
      Georgia: 'https://www.espn.com/college-football/team/_/id/61/georgia-bulldogs',
      'Ohio State': 'https://www.espn.com/college-football/team/_/id/194/ohio-state-buckeyes',
      Texas: 'https://www.espn.com/college-football/team/_/id/251/texas-longhorns',
      Miami: 'https://www.espn.com/college-football/team/_/id/2390/miami-hurricanes',
      Colorado: 'https://www.espn.com/college-football/team/_/id/38/colorado-buffaloes',
      'Oklahoma State': 'https://www.espn.com/college-football/team/_/id/197/oklahoma-state-cowboys',
      Indiana: 'https://www.espn.com/college-football/team/_/id/84/indiana-hoosiers',
      'Notre Dame': 'https://www.espn.com/college-football/team/_/id/87/notre-dame-fighting-irish',
      'Texas A&M': 'https://www.espn.com/college-football/team/_/id/245/texas-am-aggies',
      Clemson: 'https://www.espn.com/college-football/team/_/id/228/clemson-tigers',
      Michigan: 'https://www.espn.com/college-football/team/_/id/130/michigan-wolverines',
      LSU: 'https://www.espn.com/college-football/team/_/id/99/lsu-tigers',
      USC: 'https://www.espn.com/college-football/team/_/id/30/usc-trojans',
      Florida: 'https://www.espn.com/college-football/team/_/id/57/florida-gators',
      Auburn: 'https://www.espn.com/college-football/team/_/id/2/auburn-tigers',
      Tennessee: 'https://www.espn.com/college-football/team/_/id/2633/tennessee-volunteers',
      Penn_State: 'https://www.espn.com/college-football/team/_/id/213/penn-state-nittany-lions',
      Oklahoma: 'https://www.espn.com/college-football/team/_/id/201/oklahoma-sooners',
    } as Record<string, string>,
    // Recruiting / portal resources
    recruiting: [
      { label: '247Sports Team Rankings 2026', url: 'https://247sports.com/season/2026-football/compositeteamrankings/' },
      { label: 'On3 Transfer Portal', url: 'https://www.on3.com/transfer-portal/football/' },
      { label: 'ESPN Recruiting Rankings', url: 'https://www.espn.com/college-sports/football/recruiting/rankings/_/class/2026' },
      { label: 'Rivals Recruiting', url: 'https://n.rivals.com/team_rankings/2026/all-teams/football' },
    ],
    // Draft
    draft: [
      { label: 'ESPN 2026 NFL Draft', url: 'https://www.espn.com/nfl/draft/rounds/_/round/1' },
      { label: 'NFL Draft Tracker', url: 'https://www.nfl.com/draft/' },
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

  // Build a compact links section the AI can pick from
  const refs = CURRENT_CFB_CONTEXT.referenceLinks;
  const teamLinks = Object.entries(refs.teams).map(([name, url]) => `${name}: ${url}`).join(' | ');
  const recruitLinks = refs.recruiting.map(r => `${r.label}: ${r.url}`).join(' | ');
  const draftLinks = refs.draft.map(r => `${r.label}: ${r.url}`).join(' | ');

  return [
    timeline,
    '',
    `CURRENT CFB NEWS YOU KNOW ABOUT (as of ${CURRENT_CFB_CONTEXT.lastUpdated}):`,
    `Transfer portal: ${portal}`,
    `Recruiting: ${recruiting}`,
    `Spring practice: ${spring}`,
    `Hot topics: ${topics}`,
    '',
    'LINKS YOU CAN SHARE (use sparingly, only when relevant to your post):',
    `Team pages: ${teamLinks}`,
    `Recruiting/Portal: ${recruitLinks}`,
    `NFL Draft: ${draftLinks}`,
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
