import { GAME_CONFIG } from '../../data/gameConfig';

interface SummaryModalProps {
  wordCount: number;
  demonCount: number;
  onClose: () => void;
}

export default function SummaryModal({ wordCount, demonCount, onClose }: SummaryModalProps) {
  const multiplier = GAME_CONFIG.MULTIPLIER_BASE + (demonCount * GAME_CONFIG.MULTIPLIER_INCREMENT);
  const totalScore = Math.round(wordCount * multiplier);

  return (
    <div className="summary-modal-overlay" onClick={onClose}>
      <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="summary-modal-header">
          <h2 className="summary-title">🎉 Writing Session Complete!</h2>
          <button className="summary-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="summary-content">
          <div className="summary-stat">
            <div className="summary-stat-label">Words Written</div>
            <div className="summary-stat-value">{wordCount.toLocaleString()}</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-label">Demons Squashed</div>
            <div className="summary-stat-value">{demonCount}</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-label">Multiplier</div>
            <div className="summary-stat-value multiplier-value">
              {multiplier.toFixed(1)}x
            </div>
            <div className="summary-stat-hint">
              (+{GAME_CONFIG.MULTIPLIER_INCREMENT}x per demon squashed)
            </div>
          </div>
          <div className="summary-stat highlight">
            <div className="summary-stat-label">Total Score</div>
            <div className="summary-stat-value total-score">
              {totalScore.toLocaleString()}
            </div>
            <div className="summary-stat-hint">
              Words × Multiplier
            </div>
          </div>
        </div>
        <div className="summary-footer">
          <button className="summary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

