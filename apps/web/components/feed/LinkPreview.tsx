'use client';

import { useEffect, useMemo, useState } from 'react';

// ---- Video embed detection ----

interface VideoEmbed {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitch';
  embedUrl: string;
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if ((u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com' || u.hostname === 'm.youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v');
    }
    const pathMatch = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?&]+)/);
    if (pathMatch && u.hostname.includes('youtube.com')) return pathMatch[2] ?? null;
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split(/[?/]/)[0] || null;
  } catch { /* ignore */ }
  return null;
}

function detectVideoEmbed(url: string): VideoEmbed | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1` };

  try {
    const u = new URL(url);
    const tiktokMatch = u.pathname.match(/\/@[^/]+\/video\/(\d+)/);
    if (u.hostname.includes('tiktok.com') && tiktokMatch) {
      return { platform: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };
    }
    const instaMatch = u.pathname.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (u.hostname.includes('instagram.com') && instaMatch) {
      return { platform: 'instagram', embedUrl: `https://www.instagram.com/p/${instaMatch[1]}/embed` };
    }
    const twitchClip = url.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/) || u.pathname.match(/\/clip\/([A-Za-z0-9_-]+)/);
    if (u.hostname.includes('twitch.tv') && twitchClip) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return { platform: 'twitch', embedUrl: `https://clips.twitch.tv/embed?clip=${twitchClip[1]}&parent=${host}` };
    }
  } catch { /* ignore */ }
  return null;
}

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  url: string;
}

// Simple URL regex for detecting links in post content
const URL_REGEX = /https?:\/\/[^\s<>"\])}]+/gi;

// In-memory cache — only stores successful results
const ogCache = new Map<string, OgData>();

export function extractFirstUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  return match ? match[0] : null;
}

/**
 * Strip the first URL from post content (LinkedIn-style).
 * Only removes the URL itself; keeps surrounding text intact.
 */
export function stripFirstUrl(text: string): string {
  const url = extractFirstUrl(text);
  if (!url) return text;
  return text.replace(url, '').replace(/\n{2,}$/g, '').trimEnd();
}

export function LinkPreview({ content }: { content: string }) {
  const [ogData, setOgData] = useState<OgData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);

  const url = extractFirstUrl(content);
  const videoEmbed = useMemo(() => url ? detectVideoEmbed(url) : null, [url]);

  useEffect(() => {
    if (!url) return;

    // Check cache first (only successes are cached)
    const cached = ogCache.get(url);
    if (cached) {
      setOgData(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data: OgData) => {
        if (cancelled) return;
        if (data.title || data.description || data.image) {
          ogCache.set(url, data);
          setOgData(data);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url]);

  if (!url || error) return null;

  if (loading) {
    return (
      <div className="link-preview link-preview-loading">
        <div className="link-preview-skeleton-img" />
        <div className="link-preview-info">
          <div className="link-preview-skeleton-line" style={{ width: '60%' }} />
          <div className="link-preview-skeleton-line" style={{ width: '80%' }} />
          <div className="link-preview-skeleton-line" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  if (!ogData) return null;

  // If playing, show embedded iframe
  if (videoEmbed && playing) {
    const isVertical = videoEmbed.platform === 'tiktok';
    return (
      <div
        className="link-preview link-preview-video-embed"
        onClick={(e) => e.stopPropagation()}
        style={{ aspectRatio: isVertical ? '9/16' : '16/9', maxHeight: isVertical ? 500 : undefined }}
      >
        <iframe
          src={videoEmbed.embedUrl}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }}
        />
      </div>
    );
  }

  const displayDomain = (() => {
    try {
      return new URL(ogData.url).hostname.replace(/^www\./, '');
    } catch {
      return ogData.url;
    }
  })();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoEmbed) {
      e.preventDefault();
      setPlaying(true);
    }
  };

  return (
    <a
      href={ogData.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-preview"
      onClick={handleClick}
    >
      {ogData.image && (
        <div className="link-preview-image" style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogData.image}
            alt={ogData.title || 'Link preview'}
            className="link-preview-img"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
          />
          {videoEmbed && (
            <div className="link-preview-play-overlay">
              <div className="link-preview-play-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="link-preview-info">
        <div className="link-preview-site">
          {ogData.favicon && (
            <img
              src={ogData.favicon}
              alt=""
              className="link-preview-favicon"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <span>{ogData.siteName || displayDomain}</span>
        </div>
        {ogData.title && (
          <div className="link-preview-title">{ogData.title}</div>
        )}
        {ogData.description && (
          <div className="link-preview-desc">{ogData.description}</div>
        )}
      </div>
    </a>
  );
}
