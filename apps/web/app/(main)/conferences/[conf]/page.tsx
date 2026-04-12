import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

/* Slug-to-DB-value mapping */
const CONF_MAP: Record<string, { dbValue: string; display: string; intro: string }> = {
  sec: {
    dbValue: 'SEC',
    display: 'SEC',
    intro:
      'The Southeastern Conference is college football royalty. From the plains of Auburn to the swamp in Gainesville, SEC fans bring an intensity that defines Saturday in the South. Join the debate over who rules the toughest conference in America -- argue recruiting battles, rivalry week predictions, and transfer portal shockwaves with the most passionate fanbases on Earth.',
  },
  'big-ten': {
    dbValue: 'Big Ten',
    display: 'Big Ten',
    intro:
      'The Big Ten is tradition, toughness, and the biggest stadiums in the sport. From the Horseshoe to the Big House, Big Ten football is about hard-nosed play and fanbases that pack 100,000-seat cathedrals every Saturday. Post your takes on conference realignment, rivalry trophies, and which program owns the league this year.',
  },
  'big-12': {
    dbValue: 'Big 12',
    display: 'Big 12',
    intro:
      'The Big 12 is where offense meets chaos. High-scoring shootouts, stunning upsets, and some of the loudest fanbases in the country make this conference a powder keg every weekend. Debate the transfer portal moves, coaching hires, and which team rises from the pack to crash the playoff party.',
  },
  acc: {
    dbValue: 'ACC',
    display: 'ACC',
    intro:
      'The Atlantic Coast Conference blends football tradition with academic prestige. From Death Valley in Clemson to the hills of Chapel Hill, ACC football delivers iconic rivalries, passionate fanbases, and a conference race that always has a twist. Stake your claims and debate which ACC program is building a dynasty.',
  },
  'pac-12': {
    dbValue: 'Pac-12',
    display: 'Pac-12',
    intro:
      'The Pac-12 is where football meets the West Coast. Late-night kickoffs, Pac-12 After Dark chaos, and a conference steeped in innovation have produced some of college football\'s greatest moments. Rally your fellow fans, debate the conference\'s future, and track the portal moves reshaping the league.',
  },
  american: {
    dbValue: 'American Athletic',
    display: 'American Athletic Conference',
    intro:
      'The American Athletic Conference has become one of the most competitive leagues outside the Power conferences. With programs hungry to prove they belong on the national stage, AAC football delivers upsets, rising stars, and fanbases with something to prove every single Saturday.',
  },
  'sun-belt': {
    dbValue: 'Sun Belt',
    display: 'Sun Belt Conference',
    intro:
      'The Sun Belt Conference is the most dangerous Group of Five league in college football. Giant-killers, Cinderella stories, and programs on the rise define the Sun Belt experience. Debate which team is the next mid-major darling and track the recruiting pipelines that keep surprising the sport.',
  },
  'conference-usa': {
    dbValue: 'Conference USA',
    display: 'Conference USA',
    intro:
      'Conference USA is a proving ground for programs building toward bigger things. With a mix of tradition and ambition, C-USA teams bring heart and grit every week. Join the community to debate coaching moves, recruiting wins, and the players making their mark before the next level.',
  },
  mac: {
    dbValue: 'Mid-American',
    display: 'Mid-American Conference (MAC)',
    intro:
      'MACtion is a way of life. The Mid-American Conference delivers midweek magic, Tuesday and Wednesday night football that has become a cult phenomenon. From coaching pipelines to NFL draft sleepers, the MAC punches above its weight. Join the debate and rep your MACtion squad.',
  },
  'mountain-west': {
    dbValue: 'Mountain West',
    display: 'Mountain West Conference',
    intro:
      'The Mountain West Conference is built on altitude, attitude, and programs that regularly crash the national conversation. From Boise State\'s blue turf to the Air Force Academy, the Mountain West produces some of the most exciting football in the country. Debate the conference race and track the talent shaping the league.',
  },
  independents: {
    dbValue: 'FBS Independent',
    display: 'Independents',
    intro:
      'College football\'s independents chart their own course. Whether it is Notre Dame\'s national schedule, Army\'s triple option, or UConn\'s quest for a conference home, independent programs carry unique traditions and loyal fanbases. Debate where the independents fit in the college football landscape.',
  },
};

interface ConferencePageProps {
  params: Promise<{ conf: string }>;
}

export async function generateMetadata({ params }: ConferencePageProps) {
  const { conf } = await params;
  const entry = CONF_MAP[conf];
  if (!entry) return { title: 'Conference' };

  const title = `${entry.display} Football Fan Community | CFB Social`;
  const description = `Join the ${entry.display} fan community on CFB Social. Debate rivals, post takes, track the transfer portal, and follow every ${entry.display} school.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://www.cfbsocial.com/conferences/${conf}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CONF_MAP).map((conf) => ({ conf }));
}

interface School {
  id: string;
  name: string;
  slug: string;
  abbreviation: string | null;
  mascot: string | null;
  primary_color: string | null;
}

export default async function ConferencePage({ params }: ConferencePageProps) {
  const { conf } = await params;
  const entry = CONF_MAP[conf];
  if (!entry) notFound();

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from('schools')
    .select('id, name, slug, abbreviation, mascot, primary_color')
    .eq('conference', entry.dbValue)
    .not('slug', 'is', null)
    .order('name');

  const schoolList = (schools ?? []) as School[];

  return (
    <>
      <CollectionPageJsonLd
        name={`${entry.display} Football Schools`}
        description={`All ${entry.display} college football schools on CFB Social. Fan community, takes, predictions, and transfer portal tracking.`}
        url={`https://www.cfbsocial.com/conferences/${conf}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.cfbsocial.com' },
          { name: 'Schools', url: 'https://www.cfbsocial.com/schools' },
          { name: entry.display, url: `https://www.cfbsocial.com/conferences/${conf}` },
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
        {entry.display} Football Fan Community
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
        {entry.intro}
      </p>

      <h2
        style={{
          fontFamily: 'var(--serif)',
          color: 'var(--ink-dark)',
          fontSize: '1.15rem',
          fontWeight: 700,
          margin: '0 0 0.75rem',
          borderBottom: '2px solid var(--crimson)',
          paddingBottom: '0.35rem',
        }}
      >
        {entry.display} Schools ({schoolList.length})
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.6rem',
          marginBottom: '2rem',
        }}
      >
        {schoolList.map((school) => (
          <Link
            key={school.id}
            href={`/school/${school.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--rule-light, #ddd)',
              textDecoration: 'none',
              color: 'var(--ink-dark)',
              fontSize: '0.88rem',
              fontFamily: 'var(--sans)',
              transition: 'border-color 0.15s',
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
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

      {schoolList.length === 0 && (
        <p
          style={{
            color: 'var(--faded-ink)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
          }}
        >
          No schools found for this conference.
        </p>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Link
          href="/schools"
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.85rem',
            color: 'var(--crimson)',
            textDecoration: 'none',
          }}
        >
          &larr; View all schools
        </Link>
      </div>
    </>
  );
}
