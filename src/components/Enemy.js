import {Box, Progress, Text} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useCombat} from '../CombatProvider';
import {motion} from 'framer-motion';
import {config} from '../config';

export function Enemy() {
  const combat = useCombat();
  const [damageVisible, setDamageVisible] = useState(false);

  const displayDamage = () => {
    setDamageVisible(true);
    setTimeout(() => {
      setDamageVisible(false);
    }, config.damageDuration);
  };

  useEffect(() => {
    displayDamage();
  }, [combat.enemyRecentDamageTaken]);

  if (!combat.enemyAscii || !combat.enemy) return <></>;

  return (
    <motion.div
      color={'white'}
      initial={{scale: 1}}
      animate={{
        x: combat.enemyIsAttacking ? -100 : 0,
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
              color: combat.enemyRecentDamageTaken > 0 ? 'red' : 'green',
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
              {combat.enemyRecentDamageTaken * -1}
            </Text>
          </motion.div>
        )}
        <Text textAlign={'center'}>{combat.enemy.name}</Text>
        <pre style={{textAlign: 'left', display: 'inline-block'}}>
          {combat.enemyAscii}
        </pre>
        <Progress
          min={0}
          max={combat.enemy.maxHp}
          value={combat.enemy.hp}
          colorScheme={combat.enemyHealthColor}
        />
        <Text textAlign={'center'}>
          {combat.enemyDead && 'DEAD!!!'}
          {!combat.enemyDead && `${combat.enemy.hp}/${combat.enemy.maxHp} hp`}
        </Text>
      </Box>
    </motion.div>
  );
}
