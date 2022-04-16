import React, {useContext, useEffect, useState} from 'react';
import {config} from './config';

export const GameContext = React.createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({children}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [wood, setWood] = useState(config.startWood);
  const [rocks, setRocks] = useState(config.startRocks);
  const [gold, setGold] = useState(config.startGold);
  const [healthPotions, setHealthPotions] = useState(config.startHealthPotions);
  const [manaPotions, setManaPotions] = useState(config.startManaPotions);

  function gainWood(amt = 1) {
    setWood((prevState) => prevState + amt);
  }

  function gainGold(amt = 10) {
    setGold((prevState) => prevState + amt);
  }

  function gainRocks(amt = 2) {
    setRocks((prevState) => prevState + amt);
  }

  function gainHealthPotion() {
    setHealthPotions((prevState) => prevState + 1);
  }

  function gainManaPotion() {
    setManaPotions((prevState) => prevState + 1);
  }

  function consumeHealthPotion() {
    setHealthPotions((prevState) => prevState - 1);
  }

  function consumeManaPotion() {
    setManaPotions((prevState) => prevState - 1);
  }

  function consumeResources(gold = 0, wood = 0, rocks = 0) {
    if (gold) setGold((prevState) => prevState - gold);
    if (wood) setWood((prevState) => prevState - wood);
    if (rocks) setRocks((prevState) => prevState - rocks);
  }

  function onRestartGame() {
    setTimeElapsed(0);
    setWood(config.startWood);
    setRocks(config.startRocks);
    setGold(config.startGold);
    setHealthPotions(config.startHealthPotions);
    setManaPotions(config.startManaPotions);
  }

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
    <GameContext.Provider
      value={{
        timeElapsed,
        wood,
        gold,
        rocks,
        healthPotions,
        manaPotions,
        gainWood,
        gainGold,
        gainRocks,
        gainHealthPotion,
        gainManaPotion,
        consumeResources,
        consumeHealthPotion,
        consumeManaPotion,
        onRestartGame,
      }}>
      {children}
    </GameContext.Provider>
  );
};
