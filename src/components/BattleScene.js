import {Box, Collapse, HStack} from '@chakra-ui/react';
import {Player} from './Player';
import {Enemy} from './Enemy';
import {useCombat} from '../CombatProvider';

export function BattleScene() {
  const combat = useCombat();

  return (
    <Collapse in={combat.isBattleOpen} animateOpacity>
      <Box bg={'#222'} p={1} borderRadius={'md'} borderBottomRadius={0} mb={-1}>
        <Box bg={'#000'} p={1} borderRadius={'md'}>
          <Box borderRadius="lg" overflow={'hidden'}>
            <div className={'BattleScene'}>
              <Box
                padding={4}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <HStack
                  spacing={2}
                  justifyContent={'space-between'}
                  style={{
                    width: '100%',
                  }}>
                  `
                  <Player />
                  <Enemy />
                </HStack>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
}
