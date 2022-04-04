import {useGame} from '../GameProvider';
import {Text} from '@chakra-ui/react';
import {formatTimeElapsed} from '../utils/time';

export function TimeElapsed() {
  const game = useGame();

  return <Text>{formatTimeElapsed(game.timeElapsed)}</Text>;
}
