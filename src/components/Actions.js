import React from 'react';
import {Box, Button, HStack} from '@chakra-ui/react';
import {useCombat} from '../CombatProvider';

function Actions() {
  const combat = useCombat();

  const world = {
    onBuild: () => {},
    onHeal: () => {},
    onMana: () => {},
  };

  if (combat.playerDead) return <></>;

  return (
    <Box bg={'#222'} p={1} borderRadius={'md'} borderTopRadius={0} mt={-1}>
      <Box bg={'#000'} p={1} borderRadius={'md'}>
        <HStack spacing={1}>
          {combat.isWorldOpen && (
            <>
              <Button size={'xs'} onClick={world.onBuild}>
                (B)uild
              </Button>
            </>
          )}
          {combat.isBattleOpen && (
            <>
              <Button size={'xs'} onClick={combat.doJab}>
                (J)ab
              </Button>
              <Button size={'xs'} onClick={combat.doKick}>
                (K)ick
              </Button>
              <Button size={'xs'} onClick={combat.doLeap}>
                (L)eap
              </Button>
            </>
          )}
        </HStack>
      </Box>
    </Box>
  );
}

export default Actions;
