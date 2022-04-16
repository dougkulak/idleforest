import {useGame} from '../GameProvider';
import {HStack, Text} from '@chakra-ui/react';
import {
  ResourceGoldIcon,
  ResourceRocksIcon,
  ResourceTimeIcon,
  ResourceWoodIcon,
} from '../components/Icons';
import {formatTimeElapsed} from '../utils/time';

export function Resources() {
  const game = useGame();

  return (
    <HStack pt={1} spacing={3} alignItems={'center'} verticalAlign={'middle'}>
      <Text fontSize={'xs'}>
        <ResourceGoldIcon /> {game.gold}
      </Text>
      <Text fontSize={'xs'}>
        <ResourceWoodIcon /> {game.wood}
      </Text>
      <Text fontSize={'xs'}>
        <ResourceRocksIcon /> {game.rocks}
      </Text>
      <Text fontSize={'xs'}>
        <ResourceTimeIcon /> {formatTimeElapsed(game.timeElapsed)}
      </Text>
    </HStack>
  );
}
