import React from 'react';
import config from '../config';
import {useGame} from '../GameProvider';

export default function WorkerAction(props) {
  const game = useGame();

  if (!props.id) return <div>Invalid WorkerAction ID</div>;

  const resource = config.resources[props.id];

  if (!resource) return <div>Unknown Resource</div>;

  const handleClick = () => {
    resource.increment(game);
  };

  return (
    <div>
      {resource.unlocksWhen(game) && (
        <button onClick={handleClick}>
          {resource.action} {resource.name} ({resource.ticksToComplete} ticks):{' '}
          {game.resources[resource.id]}
        </button>
      )}
    </div>
  );
}
