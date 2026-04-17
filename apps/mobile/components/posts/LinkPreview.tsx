import { memo, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

interface OgData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  url: string;
}

const URL_REGEX = /https?:\/\/[^\s<>"\])}]+/gi;

// In-memory cache — only stores successful results
const ogCache = new Map<string, OgData>();

export function extractFirstUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  return match ? match[0] : null;
}

/**
 * Strip the first URL from post content so it doesn't show as raw text
 * when a link preview card is rendered below.
 */
export function stripFirstUrl(text: string): string {
  const url = extractFirstUrl(text);
  if (!url) return text;
  return text.replace(url, '').replace(/\n{2,}$/g, '').trimEnd();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function extractOgFromHtml(html: string, baseUrl: URL): OgData {
  function getMeta(property: string): string | null {
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`, 'i'),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) return decodeHtmlEntities(m[1]);
    }
    return null;
  }

  let title = getMeta('og:title') ?? getMeta('twitter:title');
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch?.[1]) title = decodeHtmlEntities(titleMatch[1].trim());
  }

  const description = getMeta('og:description') ?? getMeta('twitter:description') ?? getMeta('description');

  let image = getMeta('og:image') ?? getMeta('twitter:image');
  if (image && !image.startsWith('http')) {
    try {
      image = new URL(image, baseUrl.origin).href;
    } catch {
      image = null;
    }
  }

  const siteName = getMeta('og:site_name');

  let favicon: string | null = null;
  const iconMatch = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']*)["']/i)
    ?? html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);
  if (iconMatch?.[1]) {
    favicon = iconMatch[1];
    if (!favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, baseUrl.origin).href;
      } catch {
        favicon = `${baseUrl.origin}/favicon.ico`;
      }
    }
  } else {
    favicon = `${baseUrl.origin}/favicon.ico`;
  }

  return {
    title: title || null,
    description: description || null,
    image: image || null,
    siteName: siteName || null,
    favicon,
    url: baseUrl.href,
  };
}

// ---- YouTube helpers ----

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if ((u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com' || u.hostname === 'm.youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v');
    }
    const pathMatch = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?&]+)/);
    if (pathMatch && u.hostname.includes('youtube.com')) {
      return pathMatch[2];
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split(/[?/]/)[0] || null;
    }
  } catch { /* ignore */ }
  return null;
}

async function fetchYouTubeOg(url: string, videoId: string): Promise<OgData | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;

    const data = await res.json() as { title?: string; author_name?: string; thumbnail_url?: string };
    return {
      title: data.title || null,
      description: data.author_name ? `Video by ${data.author_name}` : null,
      image: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      siteName: 'YouTube',
      favicon: 'https://www.youtube.com/favicon.ico',
      url,
    };
  } catch {
    return {
      title: null,
      description: null,
      image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      siteName: 'YouTube',
      favicon: 'https://www.youtube.com/favicon.ico',
      url,
    };
  }
}

function isTwitterUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname;
    return h === 'twitter.com' || h === 'www.twitter.com' || h === 'x.com' || h === 'www.x.com';
  } catch { return false; }
}

async function fetchOgData(url: string): Promise<OgData | null> {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;

    // YouTube: use oEmbed API (YouTube blocks HTML scraping)
    const ytId = extractYouTubeId(url);
    if (ytId) return fetchYouTubeOg(url, ytId);

    // Twitter/X: blocks scraping, return minimal card
    if (isTwitterUrl(url)) {
      return {
        title: 'Post on X',
        description: null,
        image: null,
        siteName: 'X (Twitter)',
        favicon: 'https://abs.twimg.com/favicons/twitter.3.ico',
        url,
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CFBSocialBot/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) return null;

    // Read limited HTML (first 50KB)
    const text = await res.text();
    const html = text.slice(0, 50 * 1024);

    const og = extractOgFromHtml(html, parsed);
    return og.title || og.description || og.image ? og : null;
  } catch {
    return null;
  }
}

// ---- Video embed detection ----

interface VideoEmbed {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitch';
  embedUrl: string;
}

function detectVideoEmbed(url: string): VideoEmbed | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&playsinline=1` };

  try {
    const u = new URL(url);
    // TikTok
    const tiktokMatch = u.pathname.match(/\/@[^/]+\/video\/(\d+)/);
    if (u.hostname.includes('tiktok.com') && tiktokMatch) {
      return { platform: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };
    }
    // Instagram
    const instaMatch = u.pathname.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (u.hostname.includes('instagram.com') && instaMatch) {
      return { platform: 'instagram', embedUrl: `https://www.instagram.com/p/${instaMatch[1]}/embed` };
    }
    // Twitch clips
    const twitchClip = url.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/) || u.pathname.match(/\/clip\/([A-Za-z0-9_-]+)/);
    if (u.hostname.includes('twitch.tv') && twitchClip) {
      return { platform: 'twitch', embedUrl: `https://clips.twitch.tv/embed?clip=${twitchClip[1]}&parent=localhost` };
    }
  } catch { /* ignore */ }
  return null;
}

interface LinkPreviewProps {
  content: string;
}

export const LinkPreview = memo(function LinkPreview({ content }: LinkPreviewProps) {
  const colors = useColors();
  const [ogData, setOgData] = useState<OgData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const shimmerAnim = useMemo(() => new Animated.Value(0), []);

  const url = extractFirstUrl(content);

  // Shimmer animation
  useEffect(() => {
    if (!loading) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [loading, shimmerAnim]);

  useEffect(() => {
    if (!url) return;

    const cached = ogCache.get(url);
    if (cached) {
      setOgData(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchOgData(url).then((data) => {
      if (cancelled) return;
      if (data) {
        ogCache.set(url, data);
        setOgData(data);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [url]);

  const styles = useMemo(() => StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      overflow: 'hidden',
      marginTop: 10,
      marginBottom: 8,
      backgroundColor: colors.surfaceRaised,
    },
    image: {
      width: '100%',
      height: 160,
      backgroundColor: colors.surface,
    },
    info: {
      padding: 12,
    },
    siteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    favicon: {
      width: 14,
      height: 14,
      borderRadius: 2,
    },
    siteName: {
      fontFamily: typography.mono,
      fontSize: 10,
      letterSpacing: 1,
      color: colors.textMuted,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: typography.serifBold,
      fontSize: 15,
      lineHeight: 20,
      color: colors.ink,
      marginBottom: 4,
    },
    desc: {
      fontFamily: typography.sans,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    skeleton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      overflow: 'hidden',
      marginTop: 10,
      marginBottom: 8,
    },
    skeletonImg: {
      width: '100%',
      height: 80,
      backgroundColor: colors.surface,
    },
    skeletonLine: {
      height: 10,
      borderRadius: 2,
      backgroundColor: colors.surface,
      marginBottom: 6,
    },
    skeletonInfo: {
      padding: 12,
    },
    videoContainer: {
      marginTop: 10,
      marginBottom: 8,
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    videoWebView: {
      height: 220,
      backgroundColor: '#000',
    },
    videoWebViewVertical: {
      height: 400,
    },
    playOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    playButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playTriangle: {
      width: 0,
      height: 0,
      borderLeftWidth: 18,
      borderTopWidth: 11,
      borderBottomWidth: 11,
      borderLeftColor: '#fff',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      marginLeft: 4,
    },
  }), [colors]);

  if (!url || error) return null;

  if (loading) {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });
    return (
      <View style={styles.skeleton}>
        <Animated.View style={[styles.skeletonImg, { opacity }]} />
        <View style={styles.skeletonInfo}>
          <Animated.View style={[styles.skeletonLine, { width: '60%', opacity }]} />
          <Animated.View style={[styles.skeletonLine, { width: '80%', opacity }]} />
          <Animated.View style={[styles.skeletonLine, { width: '40%', opacity }]} />
        </View>
      </View>
    );
  }

  if (!ogData) return null;

  const videoEmbed = url ? detectVideoEmbed(url) : null;

  // If playing, show embedded video
  if (videoEmbed && playing) {
    const isVertical = videoEmbed.platform === 'tiktok';
    return (
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: videoEmbed.embedUrl }}
          style={[styles.videoWebView, isVertical && styles.videoWebViewVertical]}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
        />
      </View>
    );
  }

  const displayDomain = (() => {
    try {
      return new URL(ogData.url).hostname.replace(/^www\./, '');
    } catch {
      return ogData.url;
    }
  })();

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        if (videoEmbed) {
          setPlaying(true);
        } else {
          Linking.openURL(ogData.url);
        }
      }}
    >
      {ogData.image && !imgError && (
        <View>
          <Image
            source={{ uri: ogData.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
          {videoEmbed && (
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <View style={styles.playTriangle} />
              </View>
            </View>
          )}
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.siteRow}>
          {ogData.favicon && (
            <Image
              source={{ uri: ogData.favicon }}
              style={styles.favicon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.siteName} numberOfLines={1}>
            {ogData.siteName || displayDomain}
          </Text>
        </View>
        {ogData.title && (
          <Text style={styles.title} numberOfLines={2}>
            {ogData.title}
          </Text>
        )}
        {ogData.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {ogData.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
});
