import React from 'react';
import {Box, HStack, Text} from '@chakra-ui/react';
import {useMap} from '../providers/MapProvider';
import {useCombat} from '../CombatProvider';
import {MapToolbar} from './MapToolbar';

function RoomName() {
  const map = useMap();
  const combat = useCombat();

  if (!map.currentRoom) return <></>;
  if (combat.playerDead) return <></>;

  const room = map.currentRoom;

  return (
    <Box bg={'#222'} p={1} borderRadius={'md'} borderBottomRadius={0} mb={-1}>
      <Box bg={'#000'} p={1} borderRadius={'md'}>
        <HStack justifyContent={'space-between'}>
          <Text variant="heading" fontSize={'xs'} color={room.rgba}>
            {room.name}
          </Text>
          <Text fontSize={'xx-small'} color={'gray.500'}>
            <HStack>
              <Text>X: {map.posX}</Text>
              <Text>Y: {map.posY}</Text>
            </HStack>
          </Text>
        </HStack>
      </Box>
    </Box>
  );
}

export default RoomName;
