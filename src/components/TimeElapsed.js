import {useGame} from '../GameProvider';
import {Text} from '@chakra-ui/react';
import {formatTimeElapsed} from '../utils/time';
import {ResourceTimeIcon} from './Icons';

export function TimeElapsed() {
  const game = useGame();

  return (
    <Text fontSize={'xs'}>
      <ResourceTimeIcon /> {formatTimeElapsed(game.timeElapsed)}
    </Text>
  );
}
