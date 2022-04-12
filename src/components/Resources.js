import {useGame} from '../GameProvider';
import {HStack, Text} from '@chakra-ui/react';
import {
  ResourceGoldIcon,
  ResourceRocksIcon,
  ResourceWoodIcon,
} from '../components/Icons';

export function Resources() {
  const game = useGame();

  return (
    <HStack spacing={5}>
      <Text>
        <ResourceGoldIcon /> {game.gold}
      </Text>
      <Text>
        <ResourceWoodIcon /> {game.wood}
      </Text>
      <Text>
        <ResourceRocksIcon /> {game.rocks}
      </Text>
    </HStack>
  );
}
