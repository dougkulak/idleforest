import './App.css';
import {Center, Container, Divider, HStack} from '@chakra-ui/react';
import {TimeElapsed} from './components/TimeElapsed';
import {Logo} from './components/Logo';
import {WorldMap} from './components/WorldMap';
import {BattleScene} from './BattleScene';
import {Resources} from './components/Resources';
import {PlayerStatusBar} from './components/PlayerStatusBar';
import {DeathScene} from './components/DeathScene';

function App() {
  return (
    <div className="App">
      <Container maxW="3xl">
        <Logo />
        <Center>
          <HStack spacing={5}>
            <Resources />
            <TimeElapsed />
          </HStack>
        </Center>
        <Divider mt={2} mb={2} />
        <BattleScene />
        {/*<Divider m={2} />*/}
        {/*<Controls />*/}
        <WorldMap />
        <DeathScene />
        <Divider mt={2} mb={2} />
        <PlayerStatusBar />
      </Container>
    </div>
  );
}

export default App;
