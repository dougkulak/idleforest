import React, {useContext, useEffect, useState} from 'react';
import {config} from '../config';
import {useMessage} from './MessageProvider';
import {useCombat} from '../CombatProvider';

export const MapContext = React.createContext();
export const useMap = () => useContext(MapContext);

export const MapProvider = ({children}) => {
  const message = useMessage();
  const combat = useCombat();

  const [rooms, setRooms] = useState(null);
  const [visibleRooms, setVisibleRooms] = useState([]);
  const [posX, setPosX] = useState(config.startPositionX);
  const [posY, setPosY] = useState(config.startPositionY);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    let room = {
      name: null,
    };

    let msgColor = 'grey.200';

    if (rooms && rooms[`${posX}.${posY}`]) {
      room = rooms[`${posX}.${posY}`];

      const isWater =
        room.rgba === 'rgba(0, 106, 255, 1)' ||
        room.rgba === 'rgba(168, 212, 255, 1)' ||
        room.rgba === 'rgba(114, 156, 251, 1)' ||
        room.rgba === 'rgba(48, 165, 255, 1)';

      const isForest = room.rgba === 'rgba(68, 184, 57, 1)';
      const isForest2 = room.rgba === 'rgba(144, 255, 79, 1)';
      const isMountain =
        room.rgba === 'rgba(170, 196, 178, 1)' ||
        room.rgba === 'rgba(128, 151, 156, 1)';
      const isCastle = room.rgba === 'rgba(198, 227, 255, 1)';
      const isCave = room.rgba === 'rgba(111, 128, 132, 1)';

      if (isWater) {
        room.name = 'A Deep Ocean';
        msgColor = 'cyan.500';
      }
      if (isForest) {
        room.name = 'A Lively Forest';
        msgColor = 'green.500';
        message.addMessage(
          `A tall tree begs to be chopped.`,
          'info',
          new Date(),
          msgColor
        );
      }
      if (isForest2) {
        room.name = 'A Calm Forest';
        msgColor = 'green.400';
      }
      if (isMountain) {
        room.name = 'A Steep Mountain';
        msgColor = 'gray.400';
      }
      if (isCastle) {
        room.name = 'A Glorious Castle';
        msgColor = 'gray.400';
      }
      if (isCave) {
        room.name = 'A Mysterious Cave';
        msgColor = 'gray.400';
      }
      msgColor = room.rgba;
    }

    if (!room.name) room.name = 'An Interesting Place';

    setCurrentRoom(room);

    message.addMessage(
      `[${combat.player.hp}/${combat.player.maxHp}hp] ${room.name}`,
      'info',
      new Date(),
      msgColor
    );

    console.log('--', posX, posY);
  }, [posX, posY]);

  return (
    <MapContext.Provider
      value={{
        rooms,
        setRooms,
        visibleRooms,
        setVisibleRooms,
        posX,
        setPosX,
        posY,
        setPosY,
        currentRoom,
        setCurrentRoom,
      }}>
      {children}
    </MapContext.Provider>
  );
};
