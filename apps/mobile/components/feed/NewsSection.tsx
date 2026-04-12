import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/lib/theme/ThemeProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { typography } from '@/lib/theme/typography';
import { WEB_API_URL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { NewsModal, type NewsArticle } from './NewsModal';

type NewsTab = 'trending' | 'recruiting' | 'portal' | 'hallOfFame';

interface LeaderEntry {
  username: string;
  xp: number;
  dynasty_tier: string;
  school: { abbreviation: string } | null;
}

export function NewsSection() {
  const colors = useColors();
  const { dark, accent } = useSchoolTheme();
  const [activeTab, setActiveTab] = useState<NewsTab>('trending');
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [recruiting, setRecruiting] = useState<NewsArticle[]>([]);
  const [portal, setPortal] = useState<NewsArticle[]>([]);
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch news feeds + Hall of Fame leaderboard in parallel
    Promise.allSettled([
      fetch(`${WEB_API_URL}/api/news-feeds`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.trending?.length > 0) setTrending(data.trending);
            if (data.recruiting?.length > 0) setRecruiting(data.recruiting);
            if (data.portal?.length > 0) setPortal(data.portal);
          }
        }),
      supabase
        .from('profiles')
        .select('username, xp, dynasty_tier, school:schools!profiles_school_id_fkey(abbreviation)')
        .order('xp', { ascending: false })
        .limit(5)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setLeaders(data as unknown as LeaderEntry[]);
          }
        }),
    ])
      .catch(() => {})
      .finally(() => setLoaded(true));

    return () => controller.abort();
  }, []);

  const articles =
    activeTab === 'trending'
      ? trending
      : activeTab === 'recruiting'
        ? recruiting
        : activeTab === 'portal'
          ? portal
          : [];

  const handlePress = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginHorizontal: 12,
          marginVertical: 8,
          borderRadius: 6,
          borderWidth: 2,
          overflow: 'hidden',
          backgroundColor: colors.surfaceRaised,
        },
        header: {
          paddingVertical: 10,
          paddingHorizontal: 14,
          alignItems: 'center',
        },
        headerText: {
          fontFamily: typography.mono,
          fontSize: 13,
          letterSpacing: 3,
        },
        tabs: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        tab: {
          flex: 1,
          paddingVertical: 8,
          alignItems: 'center',
        },
        tabText: {
          fontFamily: typography.sansSemiBold,
          fontSize: 11,
          letterSpacing: 0.3,
        },
        tabActive: {
          borderBottomWidth: 2,
        },
        body: {
          padding: 12,
        },
        articleRow: {
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        articleRowLast: {
          borderBottomWidth: 0,
        },
        articleNumber: {
          fontFamily: typography.serifBold,
          fontSize: 14,
          color: colors.crimson,
          marginRight: 6,
        },
        articleHeadline: {
          fontFamily: typography.serif,
          fontSize: 14,
          color: colors.ink,
          lineHeight: 19,
        },
        articleMeta: {
          fontFamily: typography.sans,
          fontSize: 11,
          color: colors.textMuted,
          marginTop: 3,
        },
        emptyText: {
          fontFamily: typography.sans,
          fontSize: 13,
          color: colors.textMuted,
          textAlign: 'center',
          paddingVertical: 16,
        },
        // Hall of Fame styles
        leaderRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        leaderRank: {
          fontFamily: typography.serifBold,
          fontSize: 16,
          color: colors.crimson,
          width: 24,
        },
        leaderName: {
          fontFamily: typography.sansSemiBold,
          fontSize: 14,
          color: colors.ink,
          flex: 1,
        },
        leaderSchool: {
          fontFamily: typography.sans,
          fontSize: 12,
          color: colors.textMuted,
          marginRight: 8,
        },
        leaderXp: {
          fontFamily: typography.mono,
          fontSize: 12,
          color: colors.secondary,
        },
      }),
    [colors]
  );

  // Don't render if nothing loaded at all
  if (loaded && trending.length === 0 && recruiting.length === 0 && portal.length === 0 && leaders.length === 0) {
    return null;
  }

  const tabs: { key: NewsTab; label: string }[] = [
    { key: 'trending', label: 'TRENDING' },
    { key: 'recruiting', label: 'RECRUITING' },
    { key: 'portal', label: 'PORTAL' },
    { key: 'hallOfFame', label: 'HALL OF FAME' },
  ];

  return (
    <>
      <View style={[styles.container, { borderColor: dark }]}>
        <View style={[styles.header, { backgroundColor: dark }]}>
          <Text style={[styles.headerText, { color: accent }]}>PRESS BOX</Text>
        </View>

        <View style={styles.tabs}>
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              style={[
                styles.tab,
                activeTab === t.key && styles.tabActive,
                activeTab === t.key && { borderBottomColor: dark },
              ]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === t.key ? dark : colors.textMuted },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.body}>
          {activeTab === 'hallOfFame' ? (
            leaders.length > 0 ? (
              leaders.map((leader, i) => (
                <View
                  key={leader.username}
                  style={[
                    styles.leaderRow,
                    i === leaders.length - 1 && styles.articleRowLast,
                  ]}
                >
                  <Text style={styles.leaderRank}>{i + 1}</Text>
                  <Text style={styles.leaderName}>@{leader.username}</Text>
                  {leader.school && (
                    <Text style={styles.leaderSchool}>
                      {leader.school.abbreviation}
                    </Text>
                  )}
                  <Text style={styles.leaderXp}>
                    {leader.xp?.toLocaleString() ?? 0} XP
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No leaders yet</Text>
            )
          ) : articles.length > 0 ? (
            articles.slice(0, 5).map((article, i) => {
              const dateLabel = article.published
                ? new Date(article.published).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : '';
              return (
                <Pressable
                  key={article.id}
                  style={[
                    styles.articleRow,
                    i === Math.min(articles.length, 5) - 1 && styles.articleRowLast,
                  ]}
                  onPress={() => handlePress(article)}
                >
                  <Text style={styles.articleHeadline}>
                    <Text style={styles.articleNumber}>{i + 1}. </Text>
                    {article.headline.length > 80
                      ? article.headline.slice(0, 80) + '...'
                      : article.headline}
                  </Text>
                  <Text style={styles.articleMeta}>
                    {article.source}
                    {dateLabel ? ` · ${dateLabel}` : ''}
                    {article.byline ? ` · ${article.byline}` : ''}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text style={styles.emptyText}>
              {loaded ? 'No stories available' : 'Loading stories...'}
            </Text>
          )}
        </View>
      </View>

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}
