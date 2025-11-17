import { useGameStore } from '../../stores/gameStore';
import { useToastStore } from '../../stores/toastStore';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryModal() {
  const {
    history,
    text,
    wordCount,
    demonCount,
    currentSessionId,
    showHistory,
    setShowHistory,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    startNewSession,
  } = useGameStore();

  const { showToast } = useToastStore();
  const hasCurrentSession = text.trim().length > 0 || currentSessionId !== null;

  const handleLoad = (sessionId: string) => {
    loadFromHistory(sessionId);
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      deleteFromHistory(sessionId);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
    }
  };

  const handleReturnToCurrent = () => {
    // Return to current session - just close the modal
    // The current session data is already in the store
    setShowHistory(false);
  };

  const handleStartNewSession = () => {
    // Save current session to history if it exists
    if (hasCurrentSession && (text.trim().length > 0 || demonCount > 0)) {
      // The startNewSession function already saves to history, but we'll show a toast
      startNewSession();
      showToast('Previous session saved to history. Starting new session!', 'success');
    } else {
      // Just start a new session
      startNewSession();
      showToast('Starting new session!', 'success');
    }
    setShowHistory(false);
  };

  if (!showHistory) return null;

  return (
    <div className="summary-modal-overlay" onClick={() => setShowHistory(false)}>
      <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
        <div className="summary-modal-header">
          <h2 className="summary-title">📚 Writing History</h2>
          <button className="summary-close-btn" onClick={() => setShowHistory(false)}>×</button>
        </div>
        <div className="summary-content">
          {/* Action Buttons */}
          <div style={{ marginBottom: 'var(--space-16)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {hasCurrentSession && (
              <button
                className="action-btn secondary"
                onClick={handleReturnToCurrent}
                style={{ width: '100%' }}
              >
                ↩️ Return to Current Session
              </button>
            )}
            <button
              className="action-btn"
              onClick={handleStartNewSession}
              style={{ width: '100%' }}
            >
              ✨ Start New Session
              {hasCurrentSession && (
                <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-4)', opacity: 0.8 }}>
                  (Current session will be saved to history)
                </span>
              )}
            </button>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-text-secondary)' }}>
              No saved sessions yet. Start writing to create your first session!
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {history.length} saved {history.length === 1 ? 'session' : 'sessions'}
                </div>
                <button
                  className="action-btn secondary"
                  onClick={handleClearAll}
                  style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-6) var(--space-12)' }}
                >
                  Clear All
                </button>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {history.map((session) => (
                  <div
                    key={session.id}
                    className="history-item"
                    onClick={() => handleLoad(session.id)}
                    style={{
                      padding: 'var(--space-16)',
                      marginBottom: 'var(--space-12)',
                      background: 'var(--color-secondary)',
                      borderRadius: 'var(--radius-base)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) var(--ease-standard)',
                      border: '1px solid var(--color-card-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-secondary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-secondary)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)' }}>
                      <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>
                          {session.wordCount} words • {session.demonCount} demons
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          {formatDistanceToNow(new Date(session.lastModified), { addSuffix: true })}
                        </div>
                      </div>
                      <button
                        className="action-btn secondary"
                        onClick={(e) => handleDelete(e, session.id)}
                        style={{
                          fontSize: 'var(--font-size-xs)',
                          padding: 'var(--space-4) var(--space-8)',
                          minWidth: 'auto',
                        }}
                        title="Delete session"
                      >
                        🗑️
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontStyle: 'italic',
                      }}
                      title={session.text.substring(0, 200)}
                    >
                      {session.text.substring(0, 100)}
                      {session.text.length > 100 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="summary-footer">
          <button className="summary-btn" onClick={() => setShowHistory(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

