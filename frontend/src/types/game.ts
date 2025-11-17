export interface DemonPosition {
  x: number;
  y: number;
  comment: string;
}

export interface WritingSession {
  id: string;
  text: string;
  wordCount: number;
  demonCount: number;
  createdAt: number;
  lastModified: number;
}

export interface GameState {
  text: string;
  wordCount: number;
  demonCount: number;
  currentDemon: DemonPosition | null;
  showSummary: boolean;
  copySuccess: boolean;
  showHistory: boolean;
  history: WritingSession[];
  currentSessionId: string | null;
}

export interface GameActions {
  setText: (text: string) => void;
  setWordCount: (count: number) => void;
  setDemonCount: (count: number) => void;
  setCurrentDemon: (demon: DemonPosition | null) => void;
  setShowSummary: (show: boolean) => void;
  setCopySuccess: (success: boolean) => void;
  setShowHistory: (show: boolean) => void;
  incrementDemonCount: () => void;
  resetGame: () => void;
  saveToHistory: () => void;
  startNewSession: () => void;
  loadFromHistory: (sessionId: string) => void;
  deleteFromHistory: (sessionId: string) => void;
  clearHistory: () => void;
}

export type GameStore = GameState & GameActions;
