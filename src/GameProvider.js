import React, {useContext, useEffect, useState} from 'react';
import {config} from './config';

export const GameContext = React.createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({children}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // main game loop
      setTimeElapsed((prevState) => prevState + config.tickTime);
    }, config.tickTime);

    return () => {
      clearInterval(gameLoop);
    };
  }, []);

  return (
    <GameContext.Provider value={{timeElapsed}}>
      {children}
    </GameContext.Provider>
  );
};
