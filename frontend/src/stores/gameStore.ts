import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore, WritingSession } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  text: '',
  wordCount: 0,
  demonCount: 0,
  currentDemon: null,
  showSummary: false,
  copySuccess: false,
  showHistory: false,
  history: [] as WritingSession[],
  currentSessionId: null as string | null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setText: (text: string) => {
        set({ text });
        // Auto-save to current session or create new one
        const state = get();
        if (text.trim()) {
          if (state.currentSessionId) {
            const sessionIndex = state.history.findIndex(
              (s) => s.id === state.currentSessionId
            );
            if (sessionIndex >= 0) {
              const updatedHistory = [...state.history];
              updatedHistory[sessionIndex] = {
                ...updatedHistory[sessionIndex],
                text,
                wordCount: state.wordCount,
                lastModified: Date.now(),
              };
              set({ history: updatedHistory });
            }
          } else {
            // Create new session on first text input
            const now = Date.now();
            const sessionId = uuidv4();
            const session: WritingSession = {
              id: sessionId,
              text,
              wordCount: state.wordCount,
              demonCount: state.demonCount,
              createdAt: now,
              lastModified: now,
            };
            const updatedHistory = [session, ...state.history].slice(0, 50);
            set({
              history: updatedHistory,
              currentSessionId: sessionId,
            });
          }
        }
      },
      
      setWordCount: (count: number) => set({ wordCount: count }),
      setDemonCount: (count: number) => set({ demonCount: count }),
      setCurrentDemon: (demon) => set({ currentDemon: demon }),
      setShowSummary: (show: boolean) => set({ showSummary: show }),
      setCopySuccess: (success: boolean) => set({ copySuccess: success }),
      setShowHistory: (show: boolean) => set({ showHistory: show }),
      
      incrementDemonCount: () => set((state) => ({ 
        demonCount: state.demonCount + 1 
      })),
      
      resetGame: () => {
        const state = get();
        // Save current session before resetting
        if (state.text.trim()) {
          state.saveToHistory();
        }
        set({
          ...initialState,
          history: state.history,
        });
      },

      saveToHistory: () => {
        const state = get();
        // Save if there's text or demon count (in case user only squashed demons)
        if (!state.text.trim() && state.demonCount === 0) return;

        const now = Date.now();
        const session: WritingSession = {
          id: state.currentSessionId || uuidv4(),
          text: state.text,
          wordCount: state.wordCount,
          demonCount: state.demonCount,
          createdAt: state.currentSessionId
            ? state.history.find((s) => s.id === state.currentSessionId)?.createdAt || now
            : now,
          lastModified: now,
        };

        if (state.currentSessionId) {
          // Update existing session
          const updatedHistory = state.history.map((s) =>
            s.id === state.currentSessionId ? session : s
          );
          set({ history: updatedHistory });
        } else {
          // Create new session
          const updatedHistory = [session, ...state.history].slice(0, 50); // Keep last 50 sessions
          set({
            history: updatedHistory,
            currentSessionId: session.id,
          });
        }
      },

      startNewSession: () => {
        const state = get();
        // Save current session before starting new one (if there's text or demon count)
        if (state.text.trim() || state.demonCount > 0) {
          state.saveToHistory();
        }
        // Reset to new session (keep history)
        set({
          text: '',
          wordCount: 0,
          demonCount: 0,
          currentDemon: null,
          currentSessionId: null,
          showSummary: false,
          copySuccess: false,
        });
      },

      loadFromHistory: (sessionId: string) => {
        const state = get();
        const session = state.history.find((s) => s.id === sessionId);
        if (session) {
          set({
            text: session.text,
            wordCount: session.wordCount,
            demonCount: session.demonCount,
            currentSessionId: sessionId,
            showHistory: false,
          });
        }
      },

      deleteFromHistory: (sessionId: string) => {
        const state = get();
        const updatedHistory = state.history.filter((s) => s.id !== sessionId);
        set({ history: updatedHistory });
        
        // If deleting current session, reset
        if (state.currentSessionId === sessionId) {
          set({
            currentSessionId: null,
            text: '',
            wordCount: 0,
            demonCount: 0,
          });
        }
      },

      clearHistory: () => {
        set({
          history: [],
          currentSessionId: null,
          text: '',
          wordCount: 0,
          demonCount: 0,
        });
      },
    }),
    {
      name: 'story-demon-storage',
      partialize: (state) => ({
        text: state.text,
        wordCount: state.wordCount,
        demonCount: state.demonCount,
        history: state.history,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
