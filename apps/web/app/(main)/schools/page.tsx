import Link from 'next/link';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata = {
  title: 'All 653 College Football Schools | CFB Social',
  description:
    'Browse every FBS and FCS college football school on CFB Social. Find your team, join the fan community, debate rivals, and track the transfer portal.',
  openGraph: {
    title: 'All 653 College Football Schools | CFB Social',
    description:
      'Browse every FBS and FCS college football school on CFB Social. Find your team, join the fan community, debate rivals, and track the transfer portal.',
  },
  alternates: {
    canonical: 'https://www.cfbsocial.com/schools',
  },
};

/* Canonical ordering for conference groups */
const CONFERENCE_ORDER = [
  'SEC',
  'Big Ten',
  'Big 12',
  'ACC',
  'Pac-12',
  'American Athletic',
  'Sun Belt',
  'Conference USA',
  'Mid-American',
  'Mountain West',
  'FBS Independent',
];

/* Slug mapping for conference hub links */
const CONFERENCE_SLUG: Record<string, string> = {
  'SEC': 'sec',
  'Big Ten': 'big-ten',
  'Big 12': 'big-12',
  'ACC': 'acc',
  'Pac-12': 'pac-12',
  'American Athletic': 'american',
  'Sun Belt': 'sun-belt',
  'Conference USA': 'conference-usa',
  'Mid-American': 'mac',
  'Mountain West': 'mountain-west',
  'FBS Independent': 'independents',
};

/* Short display names for conference headings */
const CONFERENCE_DISPLAY: Record<string, string> = {
  'SEC': 'SEC',
  'Big Ten': 'Big Ten',
  'Big 12': 'Big 12',
  'ACC': 'ACC',
  'Pac-12': 'Pac-12',
  'American Athletic': 'American Athletic Conference',
  'Sun Belt': 'Sun Belt Conference',
  'Conference USA': 'Conference USA',
  'Mid-American': 'Mid-American Conference (MAC)',
  'Mountain West': 'Mountain West Conference',
  'FBS Independent': 'Independents',
};

interface School {
  id: string;
  name: string;
  slug: string;
  abbreviation: string | null;
  conference: string | null;
  mascot: string | null;
  primary_color: string | null;
}

export default async function SchoolsPage() {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, slug, abbreviation, conference, mascot, primary_color')
    .not('slug', 'is', null)
    .order('name');

  /* Group schools by conference */
  const grouped: Record<string, School[]> = {};
  for (const school of (schools ?? []) as School[]) {
    const conf = school.conference || 'Other';
    if (!grouped[conf]) grouped[conf] = [];
    grouped[conf].push(school);
  }

  /* Build ordered list of conferences (known first, then any extras alphabetically) */
  const knownConfs = CONFERENCE_ORDER.filter((c) => grouped[c]);
  const extraConfs = Object.keys(grouped)
    .filter((c) => !CONFERENCE_ORDER.includes(c))
    .sort();
  const orderedConfs = [...knownConfs, ...extraConfs];

  const totalSchools = (schools ?? []).length;

  return (
    <>
      <CollectionPageJsonLd
        name="All College Football Schools"
        description={`Browse all ${totalSchools} college football schools on CFB Social. Find your team, debate rivals, and track the transfer portal.`}
        url="https://www.cfbsocial.com/schools"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.cfbsocial.com' },
          { name: 'Schools', url: 'https://www.cfbsocial.com/schools' },
        ]}
      />

      <h1
        style={{
          fontFamily: 'var(--serif)',
          color: 'var(--ink-dark)',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: '1.5rem 0 0.5rem',
          lineHeight: 1.25,
        }}
      >
        Every College Football School on CFB Social
      </h1>

      <p
        style={{
          color: 'var(--faded-ink)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          margin: '0 0 1.5rem',
          maxWidth: '52rem',
        }}
      >
        All {totalSchools} college football programs, organized by conference.
        Pick your school, join the fan community, post hot takes, track the
        transfer portal, and debate rivals across the country.
      </p>

      {orderedConfs.map((conf) => {
        const confSchools = grouped[conf];
        const display = CONFERENCE_DISPLAY[conf] || conf;
        const slug = CONFERENCE_SLUG[conf];

        const schools = confSchools ?? [];
        return (
          <section key={conf} style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontFamily: 'var(--serif)',
                color: 'var(--ink-dark)',
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: '0 0 0.35rem',
                lineHeight: 1.3,
                borderBottom: '2px solid var(--crimson)',
                paddingBottom: '0.35rem',
              }}
            >
              {slug ? (
                <Link
                  href={`/conferences/${slug}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {display}
                </Link>
              ) : (
                display
              )}
            </h2>

            <p
              style={{
                color: 'var(--faded-ink)',
                fontSize: '0.85rem',
                lineHeight: 1.55,
                margin: '0 0 0.75rem',
              }}
            >
              Debate {display} fans, post takes, and track the transfer portal
              for every {display} program.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {schools.map((school) => (
                <Link
                  key={school.id}
                  href={`/school/${school.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--rule-light, #ddd)',
                    textDecoration: 'none',
                    color: 'var(--ink-dark)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--sans)',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: school.primary_color || 'var(--crimson)',
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    {school.name}
                    {school.mascot ? (
                      <span style={{ color: 'var(--faded-ink)', marginLeft: 4 }}>
                        {school.mascot}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
