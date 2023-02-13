import { Game, Types } from 'phaser';
import React, { useEffect, useState } from 'react';

export const useGame = (
  config: Types.Core.GameConfig,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [game, setGame] = useState<Game>();
  useEffect(() => {
    if (!game && containerRef.current) {
      const newGame = new Game({ ...config, parent: containerRef.current });
      setGame(newGame);
    }
    return () => {
      game?.destroy(true);
    };
  }, [config, containerRef, game]);

  return game;
};
