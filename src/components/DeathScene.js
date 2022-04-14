import React, {useEffect, useState} from 'react';
import {useCombat} from '../CombatProvider';
import {Button, VStack} from '@chakra-ui/react';
import image from '../you-died.svg';
import rawFile from '../ascii/death.txt';

export function DeathScene() {
  const combat = useCombat();

  const [ascii, setAscii] = useState('');

  useEffect(() => {
    fetch(rawFile)
      .then((r) => r.text())
      .then((text) => {
        setAscii(text);
      });
  }, []);

  if (!combat.playerDead || !ascii) return;

  return (
    <>
      <VStack>
        <pre
          dangerouslySetInnerHTML={{__html: ascii}}
          style={{fontSize: '7px', textAlign: 'left', marginTop: 20}}
        />
        <img
          src={image}
          style={{marginTop: 20}}
          width={300}
          alt={'You Died!!!'}
        />
        <Button size={'lg'} onClick={combat.doPlayAgain}>
          Play Again
        </Button>
      </VStack>
    </>
  );
}
