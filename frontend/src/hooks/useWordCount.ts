import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useWordCount = () => {
  const { text, setWordCount } = useGameStore();

  useEffect(() => {
    const trimmedText = text.trim();
    if (trimmedText === '') {
      setWordCount(0);
    } else {
      const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [text, setWordCount]);
};

