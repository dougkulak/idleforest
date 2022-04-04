import './App.css';
import {Container, Divider, Heading, HStack} from '@chakra-ui/react';
import {TimeElapsed} from './components/TimeElapsed';
import {Player} from './components/Player';
import {Enemy} from './components/Enemy';
import {Controls} from './components/Controls';

function App() {
  return (
    <div className="App">
      <Container>
        <Heading>Idle Forest</Heading>
        <TimeElapsed />
        <Divider m={2} />
        <HStack spacing={2} justifyContent={'space-between'}>
          <Player />
          <Enemy />
        </HStack>
        <Divider m={2} />
        <Controls />
      </Container>
    </div>
  );
}

export default App;
