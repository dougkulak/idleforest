import {Box} from '@chakra-ui/react';
import raw from '../ascii/player.txt';
import {useEffect, useState} from 'react';
import {usePlayer} from '../PlayerProvider';
import {motion} from 'framer-motion';

export function Player() {
  const provider = usePlayer();
  const [playerAscii, setPlayerAscii] = useState(null);

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
      initial={{scale: 0}}
      animate={{
        x: provider.isAttacking ? 200 : 0,
        scale: 1,
        color: provider.isAttacking ? 'red' : 'white',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}>
      <Box textAlign={'left'} fontSize={'xs'}>
        <pre>{playerAscii}</pre>
      </Box>
    </motion.div>
  );
}
