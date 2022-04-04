import {Box} from '@chakra-ui/react';
import raw from '../ascii/dragonEgg1.txt';
import {useEffect, useState} from 'react';

export function Enemy() {
  const [enemyAscii, setEnemyAscii] = useState(null);
  useEffect(() => {
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        setEnemyAscii(text);
      });
  });
  if (!enemyAscii) return <></>;

  return (
    <Box textAlign={'left'} fontSize={'xs'}>
      <pre>{enemyAscii}</pre>
    </Box>
  );
}
