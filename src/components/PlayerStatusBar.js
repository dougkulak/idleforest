import React, {useEffect, useState} from 'react';
import {Box, Button, HStack, Progress, Text, VStack} from '@chakra-ui/react';
import {useCombat} from '../CombatProvider';
import portraitAscii from '../ascii/portrait.txt';
import {MessageFeed} from './MessageFeed';

export function PlayerStatusBar() {
  const combat = useCombat();

  const world = {
    onBuild: () => {},
    onHeal: () => {},
    onMana: () => {},
  };

  const [portrait, setPortrait] = useState('');

  useEffect(() => {
    fetch(portraitAscii)
      .then((r) => r.text())
      .then((text) => {
        setPortrait(text);
      });
  }, []);

  return (
    <>
      <Box bg={'#222'} p={1}>
        <HStack alignItems={'flex-start'}>
          <Box bg={'#000'} p={1} mr={-1}>
            <VStack>
              <pre
                dangerouslySetInnerHTML={{__html: portrait}}
                style={{fontSize: '7px', textAlign: 'left', marginTop: -3}}
              />
              <Text fontSize={'xs'} style={{marginTop: 0}}>
                LEVEL {combat.player.level}
              </Text>
            </VStack>
          </Box>
          <Box w={'100%'} bg={'#000'} p={1}>
            <HStack spacing={1} mb={1}>
              {combat.isWorldOpen && (
                <>
                  <Button size={'xs'} onClick={world.onBuild}>
                    (B)uild
                  </Button>
                  <Button size={'xs'} onClick={world.onHeal}>
                    (H)eal
                  </Button>
                  <Button size={'xs'} onClick={world.onMana}>
                    (M)ana
                  </Button>
                </>
              )}
              {combat.isBattleOpen && (
                <>
                  <Button size={'xs'} onClick={combat.onJab}>
                    (J)ab
                  </Button>
                  <Button size={'xs'} onClick={combat.onKick}>
                    (K)ick
                  </Button>
                  <Button size={'xs'} onClick={combat.onHeal}>
                    (H)eal
                  </Button>
                </>
              )}
            </HStack>
            <HStack alignItems={'flex-start'}>
              <Box w={'100%'} bg={'#000'}>
                <VStack>
                  <Progress
                    min={0}
                    max={combat.player.maxHp}
                    value={combat.player.hp}
                    height={'24px'}
                    width={'100%'}
                    colorScheme={combat.playerHealthColor}
                  />
                  <Progress
                    min={0}
                    max={combat.player.maxMp}
                    value={combat.player.mp}
                    height={'24px'}
                    width={'100%'}
                    colorScheme={combat.playerManaColor}
                  />
                  <Progress
                    min={0}
                    max={combat.player.maxXp}
                    value={combat.player.xp}
                    height={'7px'}
                    width={'100%'}
                    colorScheme={'purple'}
                  />
                </VStack>
              </Box>
            </HStack>
          </Box>
          d
        </HStack>
      </Box>
    </>
  );
}
