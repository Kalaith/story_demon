import { useState } from 'react';
import type { DemonPosition } from '../../types/game';
import { GAME_CONFIG } from '../../data/gameConfig';

interface DemonProps {
  demon: DemonPosition;
  onSquash: () => void;
}

export default function Demon({ demon, onSquash }: DemonProps) {
  const [isSquashing, setIsSquashing] = useState(false);

  const handleClick = () => {
    setIsSquashing(true);
    setTimeout(() => {
      onSquash();
    }, GAME_CONFIG.SQUASH_ANIMATION_DURATION);
  };

  return (
    <div
      className={`demon ${isSquashing ? 'squashing' : ''}`}
      style={{
        left: `${demon.x}px`,
        top: `${demon.y}px`,
        pointerEvents: isSquashing ? 'none' : 'auto',
      }}
      onClick={handleClick}
    >
      <div className="speech-bubble">{demon.comment}</div>
      <div className="demon-body">
        <div className="demon-horn left"></div>
        <div className="demon-horn right"></div>
        <div className="demon-eyes">
          <div className="demon-eye">
            <div className="demon-pupil"></div>
          </div>
          <div className="demon-eye">
            <div className="demon-pupil"></div>
          </div>
        </div>
        <div className="demon-mouth"></div>
      </div>
    </div>
  );
}

