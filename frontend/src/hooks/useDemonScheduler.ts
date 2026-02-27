import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { NEGATIVE_COMMENTS } from '../data/demonComments';
import { GAME_CONFIG } from '../data/gameConfig';
import type { DemonPosition } from '../types/game';

export const useDemonScheduler = (textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
  const { currentDemon, setCurrentDemon, incrementDemonCount } = useGameStore();
  const demonTimeoutRef = useRef<number | null>(null);
  const hasDemonRef = useRef(false);
  const baseWordCountRef = useRef<number>(0);

  // Update ref when demon state changes
  useEffect(() => {
    hasDemonRef.current = currentDemon !== null;
  }, [currentDemon]);

  const getRandomComment = useCallback(() => {
    return NEGATIVE_COMMENTS[Math.floor(Math.random() * NEGATIVE_COMMENTS.length)];
  }, []);

  const getRandomPosition = useCallback((): { x: number; y: number } => {
    const padding = GAME_CONFIG.DEMON_PADDING;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    
    const textarea = textareaRef.current;
    if (!textarea) {
      return {
        x: Math.random() * (maxX - padding) + padding,
        y: Math.random() * (maxY - padding) + padding,
      };
    }

    const textareaRect = textarea.getBoundingClientRect();
    let x: number;
    let y: number;
    let attempts = 0;
    
    do {
      x = Math.random() * (maxX - padding) + padding;
      y = Math.random() * (maxY - padding) + padding;
      attempts++;
      
      if (attempts > GAME_CONFIG.DEMON_POSITION_ATTEMPTS) break;
      
    } while (
      x > textareaRect.left - GAME_CONFIG.TEXTAREA_AVOIDANCE_RADIUS && 
      x < textareaRect.right + GAME_CONFIG.TEXTAREA_AVOIDANCE_RADIUS &&
      y > textareaRect.top - GAME_CONFIG.TEXTAREA_AVOIDANCE_RADIUS && 
      y < textareaRect.bottom + GAME_CONFIG.TEXTAREA_AVOIDANCE_RADIUS
    );
    
    return { x, y };
  }, [textareaRef]);

  const createDemon = useCallback(() => {
    if (hasDemonRef.current) return;
    
    const position = getRandomPosition();
    const comment = getRandomComment();
    
    const demon: DemonPosition = {
      x: position.x,
      y: position.y,
      comment,
    };
    
    setCurrentDemon(demon);
  }, [getRandomPosition, getRandomComment, setCurrentDemon]);

  const scheduleDemon = useCallback((resetBase: boolean = false) => {
    if (demonTimeoutRef.current) {
      clearTimeout(demonTimeoutRef.current);
    }
    
    // Get current word count from store to ensure we have latest value
    const currentWordCount = useGameStore.getState().wordCount;
    
    // Reset base word count when demon is squashed
    if (resetBase) {
      baseWordCountRef.current = currentWordCount;
    }
    
    // Calculate delay reduction based on words written since last demon was squashed
    const wordsSinceLastSquash = Math.max(0, currentWordCount - baseWordCountRef.current);
    const delayReduction = wordsSinceLastSquash * GAME_CONFIG.DEMON_DELAY_REDUCTION_PER_WORD;
    
    // Calculate new delays (reduced based on word count, but not below minimum)
    const minDelay = Math.max(
      GAME_CONFIG.DEMON_MIN_DELAY_MIN,
      GAME_CONFIG.DEMON_MIN_DELAY - delayReduction
    );
    const maxDelay = Math.max(
      GAME_CONFIG.DEMON_MAX_DELAY_MIN,
      GAME_CONFIG.DEMON_MAX_DELAY - delayReduction
    );
    
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    
    demonTimeoutRef.current = setTimeout(() => {
      if (!hasDemonRef.current) {
        createDemon();
      }
    }, delay);
  }, [createDemon]);

  const squashDemon = useCallback((cursorPosition: number) => {
    incrementDemonCount();
    setCurrentDemon(null);
    // Reset spawn rate when demon is squashed
    scheduleDemon(true);
    
    // Restore cursor position after a brief delay to ensure textarea is focused
    setTimeout(() => {
      if (textareaRef.current && cursorPosition >= 0) {
        textareaRef.current.focus();
        const maxPosition = textareaRef.current.value.length;
        const safePosition = Math.min(cursorPosition, maxPosition);
        textareaRef.current.setSelectionRange(safePosition, safePosition);
      }
    }, 50);
  }, [incrementDemonCount, setCurrentDemon, scheduleDemon, textareaRef]);

  const stopScheduling = useCallback(() => {
    if (demonTimeoutRef.current) {
      clearTimeout(demonTimeoutRef.current);
      demonTimeoutRef.current = null;
    }
  }, []);

  // Initialize base word count on mount
  useEffect(() => {
    baseWordCountRef.current = useGameStore.getState().wordCount;
  }, []);

  // Start the game on mount
  useEffect(() => {
    scheduleDemon();
    
    return () => {
      stopScheduling();
    };
  }, [scheduleDemon, stopScheduling]);

  return {
    squashDemon,
    scheduleDemon,
    stopScheduling,
  };
};

