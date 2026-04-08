import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Strict hostname validation to prevent SSRF
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.espn.com') && parsed.hostname !== 'espn.com') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CFBSocial/1.0)',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ paragraphs: [] });
    }

    const html = await res.text();

    // Extract article body paragraphs from ESPN article HTML
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*class="[^"]*"[^>]*>(.*?)<\/p>/gs;
    let match;
    while ((match = pRegex.exec(html)) !== null) {
      // Strip HTML tags from paragraph content
      const text = match[1]!
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();

      // Only include meaningful paragraphs (skip short ones, ads, etc.)
      if (text.length > 60 && !text.includes('ESPN') && !text.includes('Subscribe')) {
        paragraphs.push(text);
      }
      if (paragraphs.length >= 3) break;
    }

    // If the class-based regex didn't find enough, try plain <p> tags
    if (paragraphs.length < 2) {
      const simplePRegex = /<p>(.*?)<\/p>/gs;
      while ((match = simplePRegex.exec(html)) !== null) {
        const text = match[1]!
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .trim();

        if (text.length > 60 && !paragraphs.includes(text)) {
          paragraphs.push(text);
        }
        if (paragraphs.length >= 3) break;
      }
    }

    return NextResponse.json({ paragraphs }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=120' },
    });
  } catch {
    return NextResponse.json({ paragraphs: [] });
  }
}
