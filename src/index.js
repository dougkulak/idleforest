import React from 'react';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {GameProvider} from './GameProvider';

import './index.css';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const theme = extendTheme({colors});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GameProvider>
        <App />
      </GameProvider>
    </ChakraProvider>
  </React.StrictMode>
);
