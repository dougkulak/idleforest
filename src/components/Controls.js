import {Button, HStack} from '@chakra-ui/react';
import {usePlayer} from '../PlayerProvider';

export function Controls() {
  const player = usePlayer();

  return (
    <HStack justifyContent={'center'}>
      <Button onClick={player.attack} colorScheme={'red'}>
        Attack
      </Button>
      <Button colorScheme={'yellow'}>Defend</Button>
    </HStack>
  );
}
