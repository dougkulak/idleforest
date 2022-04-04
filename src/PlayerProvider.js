import React, {useContext, useState} from 'react';

export const PlayerContext = React.createContext();
export const usePlayer = () => useContext(PlayerContext);

const attackDuration = 500;

export const PlayerProvider = ({children}) => {
  const [isAttacking, setIsAttacking] = useState(false);

  const attack = () => {
    console.log('attacking');
    setIsAttacking(true);
    setTimeout(() => {
      setIsAttacking(false);
    }, attackDuration);
  };

  return (
    <PlayerContext.Provider value={{isAttacking, attack}}>
      {children}
    </PlayerContext.Provider>
  );
};
