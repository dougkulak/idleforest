import {Box, Progress, Text} from '@chakra-ui/react';
import raw from '../ascii/player.txt';
import React, {useEffect, useState} from 'react';
import {useCombat} from '../CombatProvider';
import {motion} from 'framer-motion';
import {config} from '../config';

export function Player() {
  const combat = useCombat();
  const [playerAscii, setPlayerAscii] = useState(null);
  const [damageVisible, setDamageVisible] = useState(false);

  const displayDamage = () => {
    setDamageVisible(true);
    setTimeout(() => {
      setDamageVisible(false);
    }, config.damageDuration);
  };

  useEffect(() => {
    displayDamage();
  }, [combat.playerRecentDamageTaken]);

  useEffect(() => {
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        setPlayerAscii(text);
      });
  }, []);

  if (!playerAscii) return <></>;

  return (
    <motion.div
      color={'white'}
      initial={{scale: 1}}
      animate={{
        x: combat.playerIsAttacking ? 100 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}>
      <Box w={120} textAlign={'center'} fontSize={'xs'} position={'relative'}>
        {damageVisible && (
          <motion.div
            style={{
              position: 'absolute',
              left: 'calc(40%)',
              bottom: 'calc(40%)',
              opacity: 1,
              scale: 1,
              color: combat.playerRecentDamageTaken > 0 ? 'red' : 'green',
            }}
            animate={{
              y: -40,
              opacity: 0,
              scale: 2,
            }}
            transition={{
              type: 'tween',
              ease: 'easeOut',
              duration: 1,
            }}>
            <Text fontWeight={'bold'} fontSize={'2xl'}>
              {combat.playerRecentDamageTaken * -1}
            </Text>
          </motion.div>
        )}
        <Text textAlign={'center'}>{combat.player.name}</Text>
        <pre style={{textAlign: 'left', display: 'inline-block'}}>
          {playerAscii}
        </pre>
        <Progress
          min={0}
          max={combat.player.maxHp}
          value={combat.player.hp}
          colorScheme={combat.playerHealthColor}
        />
        <Text textAlign={'center'}>
          {combat.player.hp}/{combat.player.maxHp} hp
        </Text>
      </Box>
    </motion.div>
  );
}
