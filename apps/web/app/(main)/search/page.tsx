'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PostCard } from '@/components/feed/PostCard';

type SearchTab = 'posts' | 'users' | 'schools';

interface UserResult {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  dynasty_tier: string | null;
  school_id: string | null;
  school?: {
    abbreviation: string;
    primary_color: string;
    slug: string | null;
  } | null;
}

interface SchoolResult {
  id: string;
  name: string;
  abbreviation: string;
  mascot: string | null;
  slug: string;
  primary_color: string | null;
}

const TABS: { key: SearchTab; label: string }[] = [
  { key: 'posts', label: 'Posts' },
  { key: 'users', label: 'Users' },
  { key: 'schools', label: 'Schools' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('posts');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [schools, setSchools] = useState<SchoolResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const performSearch = useCallback(async (term: string, tab: SearchTab) => {
    if (term.trim().length < 2) {
      setPosts([]);
      setUsers([]);
      setSchools([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const searchTerm = `%${term.trim()}%`;

    try {
      if (tab === 'posts') {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            author:author_id (
              id,
              username,
              display_name,
              avatar_url,
              school_id,
              dynasty_tier
            ),
            school:school_id (
              id,
              name,
              abbreviation,
              slug,
              primary_color,
              logo_url
            )
          `)
          .eq('status', 'PUBLISHED')
          .is('parent_id', null)
          .ilike('content', searchTerm)
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && data) setPosts(data);
      } else if (tab === 'users') {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            display_name,
            avatar_url,
            dynasty_tier,
            school_id,
            school:schools!profiles_school_id_fkey(abbreviation, primary_color, slug)
          `)
          .eq('status', 'ACTIVE')
          .or(`username.ilike.${searchTerm},display_name.ilike.${searchTerm}`)
          .order('follower_count', { ascending: false })
          .limit(30);

        if (!error && data) setUsers(data as unknown as UserResult[]);
      } else if (tab === 'schools') {
        const { data, error } = await supabase
          .from('schools')
          .select('id, name, abbreviation, mascot, slug, primary_color')
          .eq('is_active', true)
          .or(`name.ilike.${searchTerm},abbreviation.ilike.${searchTerm},mascot.ilike.${searchTerm}`)
          .order('name')
          .limit(30);

        if (!error && data) setSchools(data as SchoolResult[]);
      }
    } catch {
      // Silently handle search errors
    }

    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setPosts([]);
      setUsers([]);
      setSchools([]);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      performSearch(query, activeTab);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTab, performSearch]);

  const handleClear = () => {
    setQuery('');
    setPosts([]);
    setUsers([]);
    setSchools([]);
    inputRef.current?.focus();
  };

  const hasSearched = query.trim().length >= 2;

  return (
    <div>
      <div className="feed-header">
        <h1 className="feed-title">Search</h1>
      </div>

      {/* Search input */}
      <div className="search-input-wrapper">
        <Search className="search-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search posts, users, schools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {query.length > 0 && (
          <button onClick={handleClear} className="search-clear-btn" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tab pills */}
      <div className="search-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`search-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="search-results">
        {!hasSearched ? (
          <div className="search-prompt">
            <p>Enter at least 2 characters to search.</p>
          </div>
        ) : loading ? (
          <div className="search-loading">
            <div className="search-spinner" />
            <p>Searching...</p>
          </div>
        ) : (
          <>
            {/* Posts results */}
            {activeTab === 'posts' && (
              posts.length > 0 ? (
                <div className="search-posts-list">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  <p className="search-empty-title">No posts found</p>
                  <p className="search-empty-subtitle">No posts matching &ldquo;{query}&rdquo;.</p>
                </div>
              )
            )}

            {/* Users results */}
            {activeTab === 'users' && (
              users.length > 0 ? (
                <div className="search-users-list">
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      className="search-user-row"
                    >
                      <div className="search-user-avatar">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.username || ''}
                            width={40}
                            height={40}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          <span className="search-user-avatar-fallback">
                            {(user.username || '?').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="search-user-info">
                        <span className="search-user-username">@{user.username}</span>
                        {user.display_name && (
                          <span className="search-user-display">{user.display_name}</span>
                        )}
                      </div>
                      {user.school && (
                        <span
                          className="search-user-school-badge"
                          style={{ backgroundColor: user.school.primary_color || 'var(--crimson)' }}
                        >
                          {user.school.abbreviation}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  <p className="search-empty-title">No users found</p>
                  <p className="search-empty-subtitle">No users matching &ldquo;{query}&rdquo;.</p>
                </div>
              )
            )}

            {/* Schools results */}
            {activeTab === 'schools' && (
              schools.length > 0 ? (
                <div className="search-schools-list">
                  {schools.map((school) => (
                    <Link
                      key={school.id}
                      href={`/school/${school.slug}`}
                      className="search-school-row"
                    >
                      <div
                        className="search-school-dot"
                        style={{ backgroundColor: school.primary_color || 'var(--crimson)' }}
                      >
                        <span className="search-school-dot-text">{school.abbreviation}</span>
                      </div>
                      <div className="search-school-info">
                        <span className="search-school-name">{school.name}</span>
                        {school.mascot && (
                          <span className="search-school-mascot">{school.mascot}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  <p className="search-empty-title">No schools found</p>
                  <p className="search-empty-subtitle">No schools matching &ldquo;{query}&rdquo;.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
