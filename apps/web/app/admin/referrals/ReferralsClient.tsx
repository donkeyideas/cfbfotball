'use client';

import { useState, useEffect } from 'react';

interface ReferralTierConfig {
  name: string;
  minReferrals: number;
  charLimit: number;
}

interface Stats {
  totalCodes: number;
  totalReferrals: number;
  activatedReferrals: number;
  pendingReferrals: number;
}

interface Recruiter {
  id: string;
  username: string;
  display_name: string | null;
  referral_count: number;
  referral_code: string | null;
}

interface ReferralEntry {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  activated_at: string | null;
  created_at: string;
}

interface UserRow {
  id: string;
  username: string | null;
  display_name: string | null;
  referral_code: string | null;
  referral_count: number;
  referred_by: string | null;
  char_limit: number;
  created_at: string;
}

export function ReferralsClient() {
  const [activeTab, setActiveTab] = useState<'settings' | 'stats' | 'users' | 'log'>('settings');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings
  const [enabled, setEnabled] = useState(false);
  const [charLimitsEnabled, setCharLimitsEnabled] = useState(false);
  const [baseCharLimit, setBaseCharLimit] = useState(500);
  const [xpReward, setXpReward] = useState(25);
  const [tiers, setTiers] = useState<ReferralTierConfig[]>([]);

  // Stats
  const [stats, setStats] = useState<Stats>({ totalCodes: 0, totalReferrals: 0, activatedReferrals: 0, pendingReferrals: 0 });
  const [topRecruiters, setTopRecruiters] = useState<Recruiter[]>([]);
  const [recentReferrals, setRecentReferrals] = useState<ReferralEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'PENDING' | 'ACTIVATED'>('all');

  // Users
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch('/api/admin/referral-settings');
      if (!res.ok) return;
      const data = await res.json();

      const s = data.settings || {};
      setEnabled(s.referral_system_enabled === 'true');
      setCharLimitsEnabled(s.referral_char_limits_enabled === 'true');
      setBaseCharLimit(parseInt(s.referral_base_char_limit || '500', 10));
      setXpReward(parseInt(s.referral_xp_reward || '25', 10));

      try {
        const parsed = JSON.parse(s.referral_tiers || '[]');
        setTiers(Array.isArray(parsed) ? parsed : []);
      } catch {
        setTiers([]);
      }

      setStats(data.stats || { totalCodes: 0, totalReferrals: 0, activatedReferrals: 0, pendingReferrals: 0 });
      setTopRecruiters(data.topRecruiters || []);
      setRecentReferrals(data.recentReferrals || []);
      setAllUsers(data.allUsers || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/referral-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            referral_system_enabled: String(enabled),
            referral_char_limits_enabled: String(charLimitsEnabled),
            referral_base_char_limit: String(baseCharLimit),
            referral_xp_reward: String(xpReward),
            referral_tiers: JSON.stringify(tiers),
          },
        }),
      });

      if (res.ok) {
        setMessage('Settings saved.');
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setSaving(false);
    }
  }

  function addTier() {
    const lastTier = tiers[tiers.length - 1];
    setTiers([...tiers, {
      name: 'New Tier',
      minReferrals: (lastTier?.minReferrals ?? 0) + 10,
      charLimit: (lastTier?.charLimit ?? 500) + 500,
    }]);
  }

  function removeTier(index: number) {
    setTiers(tiers.filter((_, i) => i !== index));
  }

  function updateTier(index: number, field: keyof ReferralTierConfig, value: string | number) {
    const updated = [...tiers];
    if (field === 'name') {
      updated[index] = { ...updated[index]!, name: value as string };
    } else {
      updated[index] = { ...updated[index]!, [field]: Number(value) || 0 };
    }
    setTiers(updated);
  }

  const tabs = [
    { key: 'settings' as const, label: 'Settings' },
    { key: 'stats' as const, label: 'Stats' },
    { key: 'users' as const, label: 'Users' },
    { key: 'log' as const, label: 'Referral Log' },
  ];

  function getTierName(referralCount: number): string {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (referralCount >= tiers[i]!.minReferrals) return tiers[i]!.name;
    }
    return tiers[0]?.name ?? 'Walk-On';
  }

  const filteredUsers = userSearch.trim()
    ? allUsers.filter((u) => {
        const q = userSearch.toLowerCase();
        return (
          (u.username?.toLowerCase().includes(q)) ||
          (u.display_name?.toLowerCase().includes(q)) ||
          (u.referral_code?.toLowerCase().includes(q))
        );
      })
    : allUsers;

  const filteredLog = logFilter === 'all'
    ? recentReferrals
    : recentReferrals.filter((r) => r.status === logFilter);

  if (loading) return <div className="admin-card p-6">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="btn-admin"
            style={{
              opacity: activeTab === t.key ? 1 : 0.5,
              borderBottom: activeTab === t.key ? '2px solid var(--admin-accent)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="admin-card p-6 space-y-6">
          {message && (
            <div
              className="rounded-md p-3 text-sm"
              style={{
                background: message.startsWith('Error') ? 'rgba(180,40,40,0.1)' : 'rgba(40,140,40,0.1)',
                color: message.startsWith('Error') ? 'var(--admin-error)' : 'var(--admin-success)',
              }}
            >
              {message}
            </div>
          )}

          {/* Master Toggle */}
          <section>
            <h2 className="admin-subsection-title">Referral System</h2>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded"
              />
              Enable referral system (users can share codes and invite friends)
            </label>
          </section>

          <hr className="border-[var(--admin-border)]" />

          {/* Character Limit Toggle */}
          <section>
            <h2 className="admin-subsection-title">Character Limit Restrictions</h2>
            <p className="mb-3 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
              When enabled, post character limits scale based on referral count. When disabled, everyone gets 3000 characters.
            </p>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
              <input
                type="checkbox"
                checked={charLimitsEnabled}
                onChange={(e) => setCharLimitsEnabled(e.target.checked)}
                className="rounded"
              />
              Enable character limit tiers based on referrals
            </label>
            {charLimitsEnabled && (
              <div className="mt-3">
                <label className="mb-1 block text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                  Base character limit (for users with 0 referrals)
                </label>
                <input
                  type="number"
                  value={baseCharLimit}
                  onChange={(e) => setBaseCharLimit(parseInt(e.target.value, 10) || 100)}
                  min={100}
                  max={3000}
                  className="admin-input w-32"
                />
              </div>
            )}
          </section>

          <hr className="border-[var(--admin-border)]" />

          {/* XP Reward */}
          <section>
            <h2 className="admin-subsection-title">XP Reward</h2>
            <div>
              <label className="mb-1 block text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
                XP awarded per activated referral
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value, 10) || 0)}
                min={0}
                max={500}
                className="admin-input w-32"
              />
            </div>
          </section>

          <hr className="border-[var(--admin-border)]" />

          {/* Tier Configuration */}
          <section>
            <h2 className="admin-subsection-title">Recruiting Tiers</h2>
            <p className="mb-3 text-sm" style={{ color: 'var(--admin-text-secondary)' }}>
              Configure the tier names, referral thresholds, and character limits.
            </p>
            <div className="overflow-x-auto">
              <table className="admin-table" style={{ minWidth: 500 }}>
                <thead>
                  <tr>
                    <th>Tier Name</th>
                    <th>Min Referrals</th>
                    <th>Char Limit</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => updateTier(i, 'name', e.target.value)}
                          className="admin-input"
                          style={{ width: 150 }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={tier.minReferrals}
                          onChange={(e) => updateTier(i, 'minReferrals', e.target.value)}
                          min={0}
                          className="admin-input w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={tier.charLimit}
                          onChange={(e) => updateTier(i, 'charLimit', e.target.value)}
                          min={100}
                          max={10000}
                          className="admin-input w-24"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeTier(i)}
                          className="text-sm"
                          style={{ color: 'var(--admin-text-muted)' }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="btn-admin mt-3"
              style={{ fontSize: '0.85rem' }}
            >
              + Add Tier
            </button>
          </section>

          <button onClick={handleSave} disabled={saving} className="btn-admin">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {/* Metrics */}
          <div className="admin-metrics-strip">
            <div className="admin-card p-4 text-center">
              <div className="text-2xl" style={{ fontFamily: 'var(--admin-serif)', color: 'var(--admin-text)' }}>
                {stats.totalCodes.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Referral Codes</div>
            </div>
            <div className="admin-card p-4 text-center">
              <div className="text-2xl" style={{ fontFamily: 'var(--admin-serif)', color: 'var(--admin-text)' }}>
                {stats.totalReferrals.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Total Referrals</div>
            </div>
            <div className="admin-card p-4 text-center">
              <div className="text-2xl" style={{ fontFamily: 'var(--admin-serif)', color: 'var(--admin-success)' }}>
                {stats.activatedReferrals.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Activated</div>
            </div>
            <div className="admin-card p-4 text-center">
              <div className="text-2xl" style={{ fontFamily: 'var(--admin-serif)', color: 'var(--admin-warning)' }}>
                {stats.pendingReferrals.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Pending</div>
            </div>
          </div>

          {/* Top Recruiters */}
          <div className="admin-card p-4">
            <h3 className="admin-subsection-title">Top Recruiters</h3>
            {topRecruiters.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>No recruiters yet.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Code</th>
                    <th>Recruits</th>
                  </tr>
                </thead>
                <tbody>
                  {topRecruiters.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td>{r.display_name || r.username}</td>
                      <td style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.75rem' }}>{r.referral_code}</td>
                      <td>{r.referral_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-card p-4">
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <h3 className="admin-subsection-title" style={{ marginBottom: 0 }}>User Referral Status</h3>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by username, name, or code..."
              className="admin-input"
              style={{ fontSize: '0.85rem', width: 280 }}
            />
            <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
          {filteredUsers.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table" style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Referral Code</th>
                    <th>Recruits</th>
                    <th>Current Tier</th>
                    <th>Char Limit</th>
                    <th>Referred By</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div>
                          <span style={{ fontWeight: 600 }}>{u.display_name || u.username || 'Anonymous'}</span>
                          {u.username && u.display_name && (
                            <span className="ml-1 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                              @{u.username}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.75rem' }}>
                        {u.referral_code || '--'}
                      </td>
                      <td style={{ fontWeight: 600 }}>{u.referral_count}</td>
                      <td style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        {tiers.length > 0 ? getTierName(u.referral_count) : 'N/A'}
                      </td>
                      <td>{u.char_limit.toLocaleString()}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {u.referred_by || '--'}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Referral Log Tab */}
      {activeTab === 'log' && (
        <div className="admin-card p-4">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="admin-subsection-title" style={{ marginBottom: 0 }}>Referral Log</h3>
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value as 'all' | 'PENDING' | 'ACTIVATED')}
              className="admin-input"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVATED">Activated</option>
            </select>
          </div>
          {filteredLog.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--admin-text-muted)' }}>No referrals found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Activated</th>
                </tr>
              </thead>
              <tbody>
                {filteredLog.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.75rem' }}>{r.referral_code}</td>
                    <td style={{ fontFamily: 'var(--admin-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      {r.status}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {r.activated_at ? new Date(r.activated_at).toLocaleDateString() : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
