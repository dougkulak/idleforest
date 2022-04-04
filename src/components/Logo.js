import logo from '../idle-night-logo.svg';
import {Center} from '@chakra-ui/react';
import {config} from '../config';

export function Logo() {
  return (
    <Center>
      <img
        src={logo}
        style={{marginTop: 20}}
        width={300}
        alt={config.appName}
      />
    </Center>
  );
}
