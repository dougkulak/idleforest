import React, {useContext} from 'react';

export const GameContext = React.createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({children}) => {
  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
};
