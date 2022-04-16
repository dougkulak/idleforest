import React, {useCallback, useContext, useEffect, useState} from 'react';
import {config} from './config';
import {rollDice} from './utils/combat';
import enemyDb from './config/enemies.json';
import {getRandomRange} from './utils/number';
import {useDisclosure} from '@chakra-ui/react';
import {useGame} from './GameProvider';
import {useMessage} from './providers/MessageProvider';
import {useKeyPress} from './utils/useKeyPress';

export const CombatContext = React.createContext();
export const useCombat = () => useContext(CombatContext);

const xpToLevel = [
  10, 20, 50, 100, 200, 500, 1000, 2500, 5000, 10000, 20000, 40000, 100000,
  200000, 500000, 1000000, 2000000, 5000000,
];

const defaultPlayer = {
  level: 1,
  name: 'Mr.Night',
  hp: 50,
  maxHp: 50,
  mp: 25,
  maxMp: 25,
  dmg: '1d6',
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

export const getHealthLevelByPercent = (pct) => {
  let status = 'Excellent';

  if (pct <= 99) {
    status = 'A few scratches';
  }
  if (pct <= 89) {
    status = 'A nasty looking welt on the forehead';
  }
  if (pct <= 82) {
    status = 'Some small wounds and bruises';
  }
  if (pct <= 75) {
    status = 'Minor wounds';
  }
  if (pct <= 68) {
    status = 'Winces in pain';
  }
  if (pct <= 61) {
    status = 'Quite a few wounds';
  }
  if (pct <= 54) {
    status = 'Grimaces with pain';
  }
  if (pct <= 47) {
    status = 'Nasty wounds and bleeding cuts';
  }
  if (pct <= 40) {
    status = 'Some large, gaping wounds';
  }
  if (pct <= 35) {
    status = 'Pretty awful';
  }
  if (pct <= 28) {
    status = 'Many grievous wounds, screaming in agony';
  }
  if (pct <= 21) {
    status = 'Covered with blood from oozing wounds, vomiting blood';
  }
  if (pct <= 14) {
    status = 'Pales visibly as death nears';
  }
  if (pct <= 7) {
    status = 'Barely clings to life';
  }
  if (pct <= 0) {
    status = 'Dead';
  }

  return status;
};

export const getDamageLevelByAmount = (amt) => {
  let level = 'Barely Touch';

  if (amt >= 3) {
    level = 'Scratch';
  }
  if (amt >= 4) {
    level = 'Bruise';
  }
  if (amt >= 5) {
    level = 'Hit';
  }
  if (amt >= 6) {
    level = 'Injure';
  }
  if (amt >= 8) {
    level = 'Wound';
  }
  if (amt >= 10) {
    level = 'Draw Blood From';
  }
  if (amt >= 12) {
    level = 'Smite';
  }
  if (amt >= 15) {
    level = 'Massacre';
  }
  if (amt >= 21) {
    level = 'Decimate';
  }
  if (amt >= 26) {
    level = 'Devastate';
  }
  if (amt >= 31) {
    level = 'Maim';
  }
  if (amt >= 41) {
    level = 'Mutilate';
  }
  if (amt >= 51) {
    level = 'Pulverise';
  }
  if (amt >= 61) {
    level = 'Demolish';
  }
  if (amt >= 71) {
    level = 'Mangle';
  }
  if (amt >= 81) {
    level = 'Obliterate';
  }
  if (amt >= 91) {
    level = 'Annihilate';
  }
  if (amt >= 101) {
    level = 'Horribly Maim';
  }
  if (amt >= 131) {
    level = 'Viciously Rend';
  }

  return level;
};

export const PlayerAttackTypes = {
  DEFAULT: 'DEFAULT',
  JAB: 'JAB',
  KICK: 'KICK',
  LEAP: 'LEAP',
};

export const CombatProvider = ({children}) => {
  const game = useGame();
  const message = useMessage();

  const jabPress = useKeyPress('j');
  const kickPress = useKeyPress('k');
  const leapPress = useKeyPress('l');
  const healPress = useKeyPress('h');
  const manaPress = useKeyPress('m');
  const fleePress = useKeyPress('f');

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
  const [playerAttackType, setPlayerAttackType] = useState(
    PlayerAttackTypes.DEFAULT
  );
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

  const doJab = () => {
    setPlayerAttackType(PlayerAttackTypes.JAB);
    playerAttack();
  };

  const doKick = () => {
    setPlayerAttackType(PlayerAttackTypes.KICK);
    playerAttack();
  };

  const doLeap = () => {
    setPlayerAttackType(PlayerAttackTypes.LEAP);
    playerAttack();
  };

  const doHeal = () => {
    if (!game.healthPotions) {
      message.addMessage(
        `Could not find any health potions!`,
        null,
        null,
        'gray.500'
      );

      return;
    }
    const gainAmt = getRandomRange(25, 35);

    setPlayer((prevState) => {
      let newState = {...prevState};
      newState.hp += gainAmt;
      if (newState.hp > newState.maxHp) newState.hp = newState.maxHp;
      return newState;
    });
    message.addMessage(
      `The health potion provides ${gainAmt} HP.`,
      null,
      null,
      'pink.500'
    );
    game.consumeHealthPotion();
  };

  const doMana = () => {
    if (!game.manaPotions) {
      message.addMessage(
        `Could not find any mana potions!`,
        null,
        null,
        'gray.500'
      );

      return;
    }

    const gainAmt = getRandomRange(15, 20);

    setPlayer((prevState) => {
      let newState = {...prevState};
      newState.mp += gainAmt;
      if (newState.mp > newState.maxMp) newState.mp = newState.maxMp;
      return newState;
    });
    message.addMessage(
      `The mana potion provides ${gainAmt} MP.`,
      null,
      null,
      'blue.500'
    );
    game.consumeManaPotion();
  };

  const doFlee = () => {
    closeBattle();
    openWorld();
  };

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
    let xp = getRandomRange(enemy.level * 2, enemy.level * 3);

    setEnemyDead(true);

    message.addMessage(`${enemy.name} is DEAD!!`, null, null, 'red.500');
    message.addMessage(`You gained ${xp} experience.`, null, null, 'cyan.500');

    setPlayer((prevState) => {
      let newState = {...prevState};
      newState.xp += xp;

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
      }
    }, 100);

    // setTimeout(() => {
    //   setEnemyDead(false);
    //   nextEnemy();
    // }, config.enemyAutoAttackEvery);
  }, [onEnemyDied, enemy, message]);

  useEffect(() => {
    if (player.xp >= player.maxXp) {
      doPlayerLeveled();
    }
  }, [player.xp, player.maxXp]);

  useEffect(() => {
    if (player.level === 1) return;
    message.addMessage(
      `* * * You are now level ${player.level}! * * *`,
      null,
      null,
      'purple.500'
    );
  }, [player.level]);

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
    if (!enemy || enemyDead || !isBattleOpen) return;

    let dmg = rollDice(player.dmg);

    setEnemy((prevState) => {
      let newState = {...prevState};
      setEnemyRecentDamageTaken(dmg);
      newState.hp -= dmg;
      if (newState.hp <= 0) {
        newState.hp = 0;
      }
      return newState;
    });

    message.addMessage(
      `You ${getDamageLevelByAmount(dmg)} ${enemy.name} for ${dmg}`,
      null,
      null,
      'green.300'
    );
  }, [doEnemyDied, player.dmg, enemy]);

  const damagePlayer = useCallback(() => {
    if (!enemy) return;

    let dmg = rollDice(enemy.dmg);

    setPlayer((prevState) => {
      let newState = {...prevState};
      setPlayerRecentDamageTaken(dmg);
      newState.hp -= dmg;
      if (newState.hp <= 0) {
        newState.hp = 0;
      }
      return newState;
    });

    message.addMessage(
      `${enemy.name} ${getDamageLevelByAmount(dmg)} you for ${dmg}`,
      null,
      null,
      'yellow.300'
    );
  }, [doPlayerDied, enemy.dmg, player]);

  const playerAttack = useCallback(() => {
    setPlayerIsAttacking(true);
    setTimeout(() => {
      damageEnemy();
      setPlayerIsAttacking(false);
      setPlayerAttackType(PlayerAttackTypes.DEFAULT);
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

    message.addMessage(`${enemy.name} attacks you!`, null, null, 'gray.50');

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

    if (player.hp <= 0) {
      message.addMessage(`YOU ARE DEAD!!`, null, null, 'red.500');
      doPlayerDied();
    }
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

    if (enemy.hp <= 0) doEnemyDied();
  }, [enemy.hp, enemy.maxHp]);

  useEffect(() => {
    const playerAutoAttackLoop = setInterval(() => {
      if (enemyDead || !enemy) return false;
      if (playerDead || !player) return false;
      if (!isBattleOpen) return false;
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
      if (!isBattleOpen) return false;
      enemyAttack();
    }, config.enemyAutoAttackEvery);

    return () => {
      clearInterval(enemyAutoAttackLoop);
    };
  }, [enemyAttack, playerDead, enemyDead, enemy, player]);

  useEffect(() => {
    //nextEnemy();
  }, []);

  useEffect(() => {
    if (playerDead || !isBattleOpen) return;
    jabPress && doJab();
  }, [jabPress]);

  useEffect(() => {
    if (playerDead || !isBattleOpen) return;
    kickPress && doKick();
  }, [kickPress]);

  useEffect(() => {
    if (playerDead || !isBattleOpen) return;
    leapPress && doLeap();
  }, [leapPress]);

  useEffect(() => {
    if (playerDead) return;
    healPress && doHeal();
  }, [healPress]);

  useEffect(() => {
    if (playerDead) return;
    manaPress && doMana();
  }, [manaPress]);

  useEffect(() => {
    if (playerDead || !isBattleOpen) return;
    fleePress && doFlee();
  }, [fleePress]);

  return (
    <CombatContext.Provider
      value={{
        player,
        setPlayer,
        playerAttackType,
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
        doJab,
        doKick,
        doLeap,
        doHeal,
        doMana,
        doFlee,
      }}>
      {children}
    </CombatContext.Provider>
  );
};
