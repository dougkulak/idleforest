import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Progress,
  ProgressLabel,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {useCombat} from '../CombatProvider';
import portraitAscii from '../ascii/portrait.txt';
import {MessageFeed} from './MessageFeed';
import {Resources} from './Resources';
import {TimeElapsed} from './TimeElapsed';
import {HealthPotionIcon, ManaPotionIcon, ResourceWoodIcon} from './Icons';
import {useGame} from '../GameProvider';

export function PlayerStatusBar() {
  const game = useGame();
  const combat = useCombat();

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
      <Box bg={'#222'} p={1} borderRadius={'md'}>
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
            <HStack alignItems={'flex-start'}>
              <Box w={'100%'} bg={'#000'}>
                <VStack spacing={1}>
                  <HStack width={'100%'}>
                    <Progress
                      min={0}
                      max={combat.player.maxHp}
                      value={combat.player.hp}
                      height={'26px'}
                      width={'100%'}
                      size={'lg'}
                      colorScheme={combat.playerHealthColor}>
                      <ProgressLabel
                        style={{
                          fontSize: 'x-small',
                          textShadow: '1px 1px #000',
                        }}>
                        {combat.player.hp}/{combat.player.maxHp} HP
                      </ProgressLabel>
                    </Progress>
                    <Tooltip
                      label={
                        <Box>
                          <Text fontSize={'xs'}>(H)ealth Potion</Text>
                          <Text fontSize={'xx-small'}>
                            Instantly restores 25-35 HP.
                          </Text>
                        </Box>
                      }>
                      <Button
                        size={'xs'}
                        width={14}
                        textAlign={'left'}
                        onClick={combat.doHeal}>
                        <HealthPotionIcon />{' '}
                        <span
                          style={{
                            display: 'inline-block',
                            width: '18px',
                            textAlign: 'right',
                          }}>
                          {game.healthPotions}
                        </span>
                      </Button>
                    </Tooltip>
                  </HStack>
                  <HStack width={'100%'}>
                    <Progress
                      min={0}
                      max={combat.player.maxMp}
                      value={combat.player.mp}
                      height={'25px'}
                      width={'100%'}
                      colorScheme={combat.playerManaColor}>
                      <ProgressLabel
                        style={{
                          fontSize: 'x-small',
                          textShadow: '1px 1px #000',
                        }}>
                        {combat.player.mp}/{combat.player.maxMp} MP
                      </ProgressLabel>
                    </Progress>
                    <Tooltip
                      label={
                        <Box>
                          <Text fontSize={'xs'}>(M)ana Potion</Text>
                          <Text fontSize={'xx-small'}>
                            Instantly restores 15-20 MP.
                          </Text>
                        </Box>
                      }>
                      <Button
                        size={'xs'}
                        width={14}
                        textAlign={'left'}
                        onClick={combat.doMana}>
                        <ManaPotionIcon />{' '}
                        <span
                          style={{
                            display: 'inline-block',
                            width: '18px',
                            textAlign: 'right',
                          }}>
                          {game.manaPotions}
                        </span>
                      </Button>
                    </Tooltip>
                    da
                  </HStack>
                  <Progress
                    min={0}
                    max={combat.player.maxXp}
                    value={combat.player.xp}
                    height={'16px'}
                    width={'100%'}
                    colorScheme={'purple'}>
                    <ProgressLabel
                      style={{
                        fontSize: 'xx-small',
                        textShadow: '1px 1px #000',
                      }}>
                      {combat.player.xp}/{combat.player.maxXp} XP to level
                    </ProgressLabel>
                  </Progress>
                </VStack>
              </Box>
            </HStack>
            <Resources />
          </Box>
        </HStack>
      </Box>
    </>
  );
}
