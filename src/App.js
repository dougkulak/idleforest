import './App.css';
import {Box, Center, Container, Divider, HStack} from '@chakra-ui/react';
import {TimeElapsed} from './components/TimeElapsed';
import {Logo} from './components/Logo';
import {BattleScene} from './components/BattleScene';
import {Resources} from './components/Resources';
import {PlayerStatusBar} from './components/PlayerStatusBar';
import {DeathScene} from './components/DeathScene';
import {MessageFeed} from './components/MessageFeed';
import {Controls} from './components/Controls';
import {FastMap} from './components/FastMap';
import RoomName from './components/RoomName';
import Actions from './components/Actions';
import {MapToolbar} from './components/MapToolbar';

function App() {
  return (
    <div className="App">
      <Container maxW="3xl">
        <Logo />
        <Divider mt={2} mb={2} />
        {/*<Divider m={2} />*/}
        {/*<DungeonScene />*/}

        <HStack alignItems={'flex-start'}>
          <Box w={'50%'} bg={'#000'} p={1}>
            {/*<ImageMap />*/}
            <RoomName />
            <FastMap />
            <BattleScene />
            <Actions />
            <Box mt={2}>
              <PlayerStatusBar />
            </Box>
            <DeathScene />
          </Box>
          <Box w={'50%'} bg={'#000'} p={1}>
            <MessageFeed />
          </Box>
        </HStack>

        {/*<WorldMap />*/}
      </Container>
    </div>
  );
}

export default App;
