export const GAME_CONFIG = {
  DEMON_MIN_DELAY: 10000, // 10 seconds (base)
  DEMON_MAX_DELAY: 20000, // 20 seconds (base)
  DEMON_MIN_DELAY_MIN: 3000, // Minimum delay (3 seconds)
  DEMON_MAX_DELAY_MIN: 6000, // Minimum max delay (6 seconds)
  DEMON_DELAY_REDUCTION_PER_WORD: 50, // Reduce delay by 50ms per word
  DEMON_PADDING: 100,
  DEMON_POSITION_ATTEMPTS: 20,
  TEXTAREA_AVOIDANCE_RADIUS: 100,
  COPY_SUCCESS_DURATION: 2000, // 2 seconds
  SQUASH_ANIMATION_DURATION: 300, // milliseconds
  MULTIPLIER_BASE: 1.0,
  MULTIPLIER_INCREMENT: 0.1, // per demon squashed
} as const;

