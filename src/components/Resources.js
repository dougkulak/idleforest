import React from 'react';
import {useGame} from '../GameProvider';

function Resource(props) {
  return (
    <div>
      {props.name}: {props.value}
    </div>
  );
}

export default function Resources() {
  const game = useGame();
  return (
    <div>
      <Resource name={'Wood'} value={game.resources.wood} />
      <Resource name={'Food'} value={game.resources.food} />
    </div>
  );
}
