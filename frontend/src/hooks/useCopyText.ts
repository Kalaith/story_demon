import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GAME_CONFIG } from '../data/gameConfig';

export const useCopyText = (textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
  const { text, setCopySuccess } = useGameStore();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), GAME_CONFIG.COPY_SUCCESS_DURATION);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Fallback for older browsers
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), GAME_CONFIG.COPY_SUCCESS_DURATION);
      }
    }
  }, [text, setCopySuccess, textareaRef]);

  return { handleCopy };
};

