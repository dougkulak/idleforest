import React, {useState, useContext, useEffect} from 'react';
import config from './config';

export const GameContext = React.createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({children}) => {
  const [resources, setResources] = useState({
    wood: config.resources.wood.defaultValue,
    food: config.resources.food.defaultValue,
  });

  const incrementResource = (resource, amt) => {
    setResources((prevState) => {
      const newState = {...prevState};

      newState[resource] += amt;

      return newState;
    });
  };

  useEffect(() => {
    console.log('resources is now: ', resources);
  }, [resources]);

  return (
    <GameContext.Provider
      value={{
        resources,
        setResources,
        incrementResource,
      }}>
      {children}
    </GameContext.Provider>
  );
};
