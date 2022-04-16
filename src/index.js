import React from 'react';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {GameProvider} from './GameProvider';

import './index.css';
import {CombatProvider} from './CombatProvider';
import {MapProvider} from './providers/MapProvider';
import {MessageProvider} from './providers/MessageProvider';

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
  colors: {
    green: {
      50: '#38A169',
      100: '#38A169',
      200: '#38A169',
      300: '#38A169',
      400: '#38A169',
      500: '#38A169',
      600: '#38A169',
      700: '#38A169',
      800: '#38A169',
      900: '#38A169',
    },
    blue: {
      50: '#3182CE',
      100: '#3182CE',
      200: '#3182CE',
      300: '#3182CE',
      400: '#3182CE',
      500: '#3182CE',
      600: '#3182CE',
      700: '#3182CE',
      800: '#3182CE',
      900: '#3182CE',
    },
    purple: {
      50: '#B794F4',
      100: '#B794F4',
      200: '#B794F4',
      300: '#B794F4',
      400: '#B794F4',
      500: '#B794F4',
      600: '#B794F4',
      700: '#B794F4',
      800: '#B794F4',
      900: '#B794F4',
    },
  },
  components: {
    Text: {
      variants: {
        heading: {
          fontFamily: "'Merriweather', serif",
          fontWeight: 900,
        },
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
        <MessageProvider>
          <CombatProvider>
            <MapProvider>
              <App />
            </MapProvider>
          </CombatProvider>
        </MessageProvider>
      </GameProvider>
    </ChakraProvider>
  </React.StrictMode>
);
