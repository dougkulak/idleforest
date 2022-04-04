import React from 'react';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {GameProvider} from './GameProvider';

import './index.css';
import {PlayerProvider} from './PlayerProvider';

const themeConfig = {
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
  styles: {
    global: {
      body: {
        bg: 'black',
      },
    },
  },
};

const theme = extendTheme(themeConfig);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GameProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </GameProvider>
    </ChakraProvider>
  </React.StrictMode>
);
