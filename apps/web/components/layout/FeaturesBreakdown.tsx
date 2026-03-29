export function FeaturesBreakdown() {
  return (
    <div className="features-breakdown">
      <div className="features-title">Features</div>

      {/* Classic Take style — ticket perforations + crimson stripe */}
      <div className="fb-card post-classic">
        <div className="fb-name">The Feed</div>
        <div className="fb-desc">Main timeline of takes, receipts, and reports from the press box.</div>
      </div>

      {/* Rivalry style — crimson header */}
      <div className="fb-card post-rivalry">
        <div className="rivalry-header" style={{ padding: '6px 12px' }}>
          <span className="rivalry-label" style={{ fontSize: '0.55rem' }}>Feature</span>
          <span className="rivalry-title" style={{ fontSize: '0.8rem' }}>Rivalry Ring</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div className="fb-desc">Head-to-head challenges between fans. Prove your take is king.</div>
        </div>
      </div>

      {/* Prediction style — gold border */}
      <div className="fb-card post-prediction">
        <div className="prediction-header" style={{ padding: '6px 12px' }}>
          <span className="prediction-label" style={{ fontSize: '0.7rem' }}>Predictions</span>
          <span className="prediction-tag">Poll</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div className="fb-desc">File predictions on games and outcomes. Receipts or busts await.</div>
        </div>
      </div>

      {/* Aging Take style — crimson quote border */}
      <div className="fb-card post-aging">
        <div className="aging-header" style={{ padding: '6px 12px' }}>
          <span className="aging-label" style={{ fontSize: '0.7rem' }}>Aging Takes</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div className="fb-desc" style={{ borderLeft: '3px solid var(--crimson)', paddingLeft: 8, fontStyle: 'italic' }}>
            Lock in a take and let time be the judge. Receipt or bust.
          </div>
        </div>
      </div>

      {/* Receipt style — yellowed clipping */}
      <div className="fb-card post-receipt" style={{ transform: 'none' }}>
        <div className="fb-name">Receipts</div>
        <div className="fb-desc">Pull the receipts on old takes. The newsprint never forgets.</div>
        <div className="receipt-stamp" style={{ fontSize: '0.6rem', padding: '3px 6px', marginTop: 6 }}>CONFIRMED</div>
      </div>

      {/* Press Box style — dark header */}
      <div className="fb-card post-pressbox">
        <div className="pressbox-header" style={{ padding: '6px 12px' }}>
          <span className="pressbox-title" style={{ fontSize: '0.65rem' }}>Portal Wire</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          <div className="fb-desc">Track transfer portal entries, claims, and committed players.</div>
        </div>
      </div>

      {/* Penalty style — yellow flag */}
      <div className="fb-card post-penalty" style={{ borderLeftWidth: 4 }}>
        <div className="penalty-title" style={{ fontSize: '0.75rem', marginBottom: 4 }}>Moderation</div>
        <div className="fb-desc">Community-flagged takes go under review. Appeal or accept the call.</div>
      </div>

      {/* Standard items without a special post style */}
      <div className="fb-card fb-standard">
        <div className="fb-name">Dynasty Mode</div>
        <div className="fb-desc">Level up your dynasty tier by earning XP through posts and predictions.</div>
      </div>

      <div className="fb-card fb-standard">
        <div className="fb-name">Hall of Fame</div>
        <div className="fb-desc">Top contributors ranked by XP, correct predictions, and community votes.</div>
      </div>

      <div className="fb-card fb-standard">
        <div className="fb-name">Coach&apos;s Call</div>
        <div className="fb-desc">Community polls and hot-seat debates on coaches and programs.</div>
      </div>

      <div className="fb-card fb-standard">
        <div className="fb-name">Recruiting Desk</div>
        <div className="fb-desc">Scouting reports and recruiting intel from around the country.</div>
      </div>

      <div className="fb-card fb-standard">
        <div className="fb-name">The Vault</div>
        <div className="fb-desc">Historic moments, legendary takes, and today-in-CFB-history.</div>
      </div>
    </div>
  );
}
