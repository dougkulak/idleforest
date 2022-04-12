import {Button, HStack} from '@chakra-ui/react';
import {useCombat} from '../CombatProvider';

export function Controls() {
  const combat = useCombat();

  return (
    <HStack justifyContent={'center'}>
      <Button onClick={combat.playerAttack} colorScheme={'red'}>
        Attack
      </Button>
      <Button colorScheme={'yellow'}>Defend</Button>
      <Button onClick={combat.openBattle}>Open Battle</Button>
      <Button onClick={combat.closeBattle}>Close Battle</Button>
      <Button onClick={combat.openWorld}>Open World</Button>
      <Button onClick={combat.closeWorld}>Close World</Button>
    </HStack>
  );
}
