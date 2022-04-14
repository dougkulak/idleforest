import './App.css';
import {Box, Center, Container, Divider, HStack} from '@chakra-ui/react';
import {TimeElapsed} from './components/TimeElapsed';
import {Logo} from './components/Logo';
import {WorldMap} from './components/WorldMap';
import {BattleScene} from './components/BattleScene';
import {DungeonScene} from './components/DungeonScene';
import {Resources} from './components/Resources';
import {PlayerStatusBar} from './components/PlayerStatusBar';
import {DeathScene} from './components/DeathScene';
import {ImageMap} from './components/ImageMap';
import {MapToolbar} from './components/MapToolbar';
import {MessageFeed} from './components/MessageFeed';
import {Controls} from './components/Controls';

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
        {/*<Divider m={2} />*/}
        <Controls />
        <DungeonScene />
        <BattleScene />
        <Divider mt={2} mb={2} />

        <HStack alignItems={'flex-start'}>
          <Box w={'100%'} bg={'#000'} p={1}>
            <PlayerStatusBar />
            <MessageFeed />
          </Box>
          <ImageMap />
        </HStack>

        <MapToolbar />
        {/*<WorldMap />*/}
        <DeathScene />
      </Container>
    </div>
  );
}

export default App;
