import React, {useCallback, useContext, useEffect, useState} from 'react';
import {config} from './config';
import {rollDice} from './utils/combat';
import enemyDb from './config/enemies.json';
import {getRandomRange} from './utils/number';
import {useDisclosure} from '@chakra-ui/react';
import {useGame} from './GameProvider';

export const CombatContext = React.createContext();
export const useCombat = () => useContext(CombatContext);

const xpToLevel = [
  10, 20, 50, 100, 200, 500, 1000, 2500, 5000, 10000, 20000, 40000, 100000,
  200000, 500000, 1000000, 2000000, 5000000,
];

const defaultPlayer = {
  level: 1,
  name: 'player',
  hp: 100,
  maxHp: 100,
  mp: 25,
  maxMp: 25,
  dmg: '6d6',
  xp: 0,
  maxXp: 10,
};

const defaultEnemyStatus = {
  level: 1,
  name: 'the void',
  hp: 1,
  maxHp: 1,
  dmg: '1d1',
};

export const CombatProvider = ({children}) => {
  const game = useGame();

  const {
    isOpen: isBattleOpen,
    onOpen: openBattle,
    onClose: closeBattle,
  } = useDisclosure({defaultIsOpen: false});

  const {
    isOpen: isWorldOpen,
    onOpen: openWorld,
    onClose: closeWorld,
  } = useDisclosure({defaultIsOpen: true});

  const [player, setPlayer] = useState(defaultPlayer);
  const [playerDead, setPlayerDead] = useState(false);

  const [enemy, setEnemy] = useState(defaultEnemyStatus);
  const [enemyDead, setEnemyDead] = useState(false);
  const [enemyAscii, setEnemyAscii] = useState(null);

  const [onEnemyDied, setOnEnemyDied] = useState(() => {});

  const [playerIsAttacking, setPlayerIsAttacking] = useState(false);
  const [enemyIsAttacking, setEnemyIsAttacking] = useState(false);
  const [playerRecentDamageTaken, setPlayerRecentDamageTaken] = useState(0);
  const [enemyRecentDamageTaken, setEnemyRecentDamageTaken] = useState(0);

  const [playerHealthColor, setPlayerHealthColor] = useState(
    config.defaultHealthColor
  );
  const [playerManaColor, setPlayerManaColor] = useState(
    config.defaultManaColor
  );
  const [enemyHealthColor, setEnemyHealthColor] = useState(
    config.defaultHealthColor
  );

  const doEncounter = (whenEnemyDies = () => {}) => {
    setOnEnemyDied(() => whenEnemyDies);
    openBattle();
    closeWorld();
    nextEnemy();
  };

  const doPlayerLeveled = useCallback(() => {
    setPlayer((prevState) => {
      let newState = {...prevState};

      let newHp = getRandomRange(player.level * 2, player.level * 3);
      let newMp = getRandomRange(player.level * 1, player.level * 2);

      newState.level += 1;
      newState.maxHp += newHp;
      newState.hp = newState.maxHp;
      newState.maxMp += newMp;
      newState.mp = newState.maxMp;
      newState.maxXp = xpToLevel[newState.level - 1];
      newState.xp = 0;

      return newState;
    });
  }, []);

  const doEnemyDied = useCallback(() => {
    setEnemyDead(true);

    setPlayer((prevState) => {
      let newState = {...prevState};
      let xp = getRandomRange(enemy.level * 2, enemy.level * 3);
      newState.xp += xp;
      console.log('gaining xp', xp);
      if (newState.xp >= newState.maxXp) {
        newState.xp = 0;
        doPlayerLeveled();
      }
      return newState;
    });

    setTimeout(() => {
      closeBattle();
      openWorld();
      if (typeof onEnemyDied === 'function') {
        onEnemyDied();
        console.log('onEnmeyDied()');
      }
    }, 100);

    // setTimeout(() => {
    //   setEnemyDead(false);
    //   nextEnemy();
    // }, config.enemyAutoAttackEvery);
  }, [onEnemyDied]);

  const doPlayerDied = useCallback(() => {
    setPlayerDead(true);

    setTimeout(() => {
      closeBattle();
      closeWorld();
    }, 50);
  }, []);

  const doPlayAgain = () => {
    game.onRestartGame();
    setPlayerDead(false);
    setPlayer(defaultPlayer);
    openWorld();
  };

  const damageEnemy = useCallback(() => {
    if (!enemy) return;

    setEnemy((prevState) => {
      let newState = {...prevState};
      let dmg = rollDice(player.dmg);
      setEnemyRecentDamageTaken(dmg);
      newState.hp -= dmg;
      if (newState.hp <= 0) {
        newState.hp = 0;
        doEnemyDied();
      }
      return newState;
    });
  }, [doEnemyDied, player.dmg, enemy]);

  const damagePlayer = useCallback(() => {
    if (!enemy) return;

    setPlayer((prevState) => {
      let newState = {...prevState};
      let dmg = rollDice(enemy.dmg);
      setPlayerRecentDamageTaken(dmg);
      newState.hp -= dmg;
      if (newState.hp <= 0) {
        newState.hp = 0;
        doPlayerDied();
      }
      return newState;
    });
  }, [doPlayerDied, enemy.dmg, player]);

  const playerAttack = useCallback(() => {
    setPlayerIsAttacking(true);
    setTimeout(() => {
      damageEnemy();
      setPlayerIsAttacking(false);
    }, config.attackDuration);
  }, [damageEnemy]);

  const enemyAttack = useCallback(() => {
    setEnemyIsAttacking(true);
    setTimeout(() => {
      damagePlayer();
      setEnemyIsAttacking(false);
    }, config.attackDuration);
  }, [damagePlayer]);

  const nextEnemy = () => {
    const enemy = enemyDb[getRandomRange(0, enemyDb.length - 1)];

    enemy.maxHp = enemy.hp;

    fetch(`art/${enemy.ascii}`)
      .then((r) => r.text())
      .then((text) => {
        setEnemyDead(false);
        setEnemyAscii(text);
        setEnemy(enemy);
      });
  };

  useEffect(() => {
    let color = config.defaultHealthColor;
    const healthPct = Math.floor((player.hp / player.maxHp) * 100);

    if (healthPct < 75) color = 'yellow';
    if (healthPct < 50) color = 'orange';
    if (healthPct < 25) color = 'red';

    setPlayerHealthColor(color);
  }, [player.hp, player.maxHp]);

  useEffect(() => {
    let color = config.defaultManaColor;
    const pct = Math.floor((player.mp / player.maxMp) * 100);

    if (pct < 75) color = 'blue';
    if (pct < 50) color = 'blue';
    if (pct < 25) color = 'blue';

    setPlayerManaColor(color);
  }, [player.mp, player.maxMp]);

  useEffect(() => {
    let color = config.defaultHealthColor;
    const healthPct = Math.floor((enemy.hp / enemy.maxHp) * 100);

    if (healthPct < 75) color = 'yellow';
    if (healthPct < 50) color = 'orange';
    if (healthPct < 25) color = 'red';

    setEnemyHealthColor(color);
  }, [enemy.hp, enemy.maxHp]);

  useEffect(() => {
    const playerAutoAttackLoop = setInterval(() => {
      if (enemyDead || !enemy) return false;
      if (playerDead || !player) return false;
      playerAttack();
    }, config.playerAutoAttackEvery);

    return () => {
      clearInterval(playerAutoAttackLoop);
    };
  }, [playerAttack, enemyDead, playerDead, enemy, player]);

  useEffect(() => {
    const enemyAutoAttackLoop = setInterval(() => {
      if (playerDead || !player) return false;
      if (enemyDead || !enemy) return false;
      enemyAttack();
    }, config.enemyAutoAttackEvery);

    return () => {
      clearInterval(enemyAutoAttackLoop);
    };
  }, [enemyAttack, playerDead, enemyDead, enemy, player]);

  useEffect(() => {
    //nextEnemy();
  }, []);

  return (
    <CombatContext.Provider
      value={{
        player,
        setPlayer,
        playerIsAttacking,
        playerRecentDamageTaken,
        playerHealthColor,
        playerManaColor,
        playerAttack,
        playerDead,
        enemy,
        setEnemy,
        enemyAscii,
        enemyIsAttacking,
        enemyRecentDamageTaken,
        enemyHealthColor,
        enemyDead,
        isBattleOpen,
        openBattle,
        closeBattle,
        isWorldOpen,
        openWorld,
        closeWorld,
        nextEnemy,
        doPlayAgain,
        doEncounter,
      }}>
      {children}
    </CombatContext.Provider>
  );
};
