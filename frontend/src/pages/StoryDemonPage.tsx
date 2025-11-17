import { useRef, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useToastStore } from '../stores/toastStore';
import { useWordCount } from '../hooks/useWordCount';
import { useDemonScheduler } from '../hooks/useDemonScheduler';
import { useCopyText } from '../hooks/useCopyText';
import Demon from '../components/game/Demon';
import SummaryModal from '../components/ui/SummaryModal';
import HistoryModal from '../components/ui/HistoryModal';
import Toast from '../components/ui/Toast';
import '../styles/story-demon.css';

export default function StoryDemonPage() {
  const {
    text,
    wordCount,
    demonCount,
    currentDemon,
    showSummary,
    copySuccess,
    setText,
    setShowSummary,
    setShowHistory,
    saveToHistory,
    startNewSession,
  } = useGameStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const { squashDemon, stopScheduling, scheduleDemon } = useDemonScheduler(textareaRef);
  const { handleCopy } = useCopyText(textareaRef);
  const { showToast } = useToastStore();

  useWordCount();

  // Auto-save to history every 30 seconds
  useEffect(() => {
    if (!text.trim()) return;

    const autoSaveInterval = setInterval(() => {
      saveToHistory();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [text, saveToHistory]);

  // Save to history when component unmounts or page is about to close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (text.trim()) {
        saveToHistory();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (text.trim()) {
        saveToHistory();
      }
    };
  }, [text, saveToHistory]);

  // Track cursor position continuously
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelectionChange = () => {
      if (document.activeElement === textarea) {
        cursorPositionRef.current = textarea.selectionStart;
      }
    };

    const handleBlur = () => {
      // Store position when textarea loses focus
      cursorPositionRef.current = textarea.selectionStart;
    };

    textarea.addEventListener('keyup', handleSelectionChange);
    textarea.addEventListener('click', handleSelectionChange);
    textarea.addEventListener('blur', handleBlur);

    return () => {
      textarea.removeEventListener('keyup', handleSelectionChange);
      textarea.removeEventListener('click', handleSelectionChange);
      textarea.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handleFinish = () => {
    // Save current session before showing summary
    if (text.trim()) {
      saveToHistory();
    }
    setShowSummary(true);
    stopScheduling();
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    // Show toast notification
    showToast('Session saved! You can view it in History.', 'success');
    // Start a new session after closing summary
    startNewSession();
    scheduleDemon();
  };

  return (
    <div className="app-container">
      <div className="action-buttons">
        <button
          className="action-btn secondary"
          onClick={() => setShowHistory(true)}
        >
          📚 History
        </button>
        <button
          className="action-btn secondary"
          onClick={() => {
            if (text.trim() || demonCount > 0) {
              saveToHistory();
              showToast('Current session saved to history. Starting new session!', 'success');
            }
            startNewSession();
          }}
        >
          ✨ New Session
        </button>
        <button
          className="action-btn secondary"
          onClick={handleCopy}
          disabled={!text.trim()}
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy Text'}
        </button>
        <button
          className="action-btn"
          onClick={handleFinish}
        >
          ✨ Finish
        </button>
      </div>
      <div className="score-bar">
        <div className="score-item">
          <span className="score-label">Words:</span>
          <span className="score-value">{wordCount}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Demons Squashed:</span>
          <span className="score-value">{demonCount}</span>
        </div>
      </div>
      <div className="writing-area">
        <textarea
          ref={textareaRef}
          className="story-demon-textarea"
          placeholder="Start writing... but beware of the demon! 👹"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // Track cursor position during typing
            cursorPositionRef.current = e.target.selectionStart;
          }}
          onKeyUp={(e) => {
            cursorPositionRef.current = (e.target as HTMLTextAreaElement).selectionStart;
          }}
        />
      </div>
      {currentDemon && (
        <Demon
          demon={currentDemon}
          onSquash={() => squashDemon(cursorPositionRef.current)}
        />
      )}
      {showSummary && (
        <SummaryModal
          wordCount={wordCount}
          demonCount={demonCount}
          onClose={handleCloseSummary}
        />
      )}
      <HistoryModal />
      <Toast />
    </div>
  );
}

