'use client';

import { useState, useEffect } from 'react';

interface FactCheck {
  id: string;
  claim: string;
  verdict: string;
  evidence: string | null;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
}

interface FactCheckPanelProps {
  postId: string;
  onClose: () => void;
}

const VERDICT_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  VERIFIED: { label: 'Verified', color: '#1a7a1a', bg: '#e6f5e6' },
  FALSE: { label: 'False', color: '#8b1a1a', bg: '#fce6e6' },
  UNVERIFIABLE: { label: 'Opinion / Unverifiable', color: '#6b5a1a', bg: '#fdf5e6' },
  PENDING: { label: 'Pending Review', color: '#4a4a4a', bg: '#f0f0f0' },
};

export function FactCheckPanel({ postId, onClose }: FactCheckPanelProps) {
  const [factCheck, setFactCheck] = useState<FactCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing fact check
  useEffect(() => {
    fetch(`/api/fact-check?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.factCheck) setFactCheck(data.factCheck);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postId]);

  async function requestFactCheck() {
    setRequesting(true);
    setError(null);
    try {
      const res = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to run fact check');
      } else {
        setFactCheck(data.factCheck);
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setRequesting(false);
    }
  }

  const verdict = factCheck?.verdict ? VERDICT_STYLES[factCheck.verdict] : null;

  return (
    <div className="fact-check-panel">
      <div className="fact-check-header">
        <span className="fact-check-title">Fact Check</span>
        <button className="fact-check-close" onClick={onClose}>X</button>
      </div>

      {loading && (
        <div className="fact-check-loading">Checking...</div>
      )}

      {!loading && !factCheck && !requesting && (
        <div className="fact-check-empty">
          <p className="fact-check-desc">
            Run an AI-powered fact check on this post. Claims will be analyzed for accuracy.
          </p>
          <button className="fact-check-btn" onClick={requestFactCheck}>
            Run Fact Check
          </button>
        </div>
      )}

      {requesting && (
        <div className="fact-check-loading">
          Analyzing claims...
        </div>
      )}

      {error && (
        <div className="fact-check-error">{error}</div>
      )}

      {factCheck && verdict && (
        <div className="fact-check-result">
          <div
            className="fact-check-verdict"
            style={{ color: verdict.color, backgroundColor: verdict.bg }}
          >
            {verdict.label}
          </div>
          {factCheck.claim && (
            <div className="fact-check-claim">
              <span className="fact-check-label">Claim:</span> {factCheck.claim}
            </div>
          )}
          {factCheck.evidence && (
            <div className="fact-check-evidence">
              {factCheck.evidence}
            </div>
          )}
          <div className="fact-check-meta">
            Checked {new Date(factCheck.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </div>
        </div>
      )}
    </div>
  );
}
