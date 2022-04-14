import React from 'react';
import {HStack, Text} from '@chakra-ui/react';
import {useMap} from '../providers/MapProvider';

export function MapToolbar() {
  const map = useMap();
  return (
    <>
      <HStack>
        <Text>X: {map.posX}</Text>
        <Text>Y: {map.posY}</Text>
      </HStack>
    </>
  );
}
