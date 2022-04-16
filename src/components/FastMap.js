import React, {useEffect, useState} from 'react';
import mapImg from '../map.png';
import {Room} from './Room';
import {useKeyPress} from '../utils/useKeyPress';
import {useCombat} from '../CombatProvider';
import {config} from '../config';
import {useMap} from '../providers/MapProvider';
import {Box, Collapse} from '@chakra-ui/react';
import {useMessage} from '../providers/MessageProvider';

export function FastMap() {
  const map = useMap();
  const combat = useCombat();
  const message = useMessage();

  const [curViewportHeight, setCurViewportHeight] = useState(
    config.viewportHeight
  );

  const [curViewportWidth, setCurViewportWidth] = useState(
    config.viewportWidth
  );

  function resizeSmall(callback) {
    if (curViewportHeight >= config.minViewportHeight) {
      setCurViewportHeight((prevState) => prevState - 1);
    }
    if (curViewportWidth >= config.minViewportWidth) {
      setCurViewportWidth((prevState) => prevState - 1);
    }
    if (
      curViewportHeight + 1 === config.minViewportHeight &&
      curViewportWidth + 1 === config.minViewportWidth
    ) {
      callback();
    }
  }

  function resizeLarge() {
    if (curViewportHeight <= config.viewportHeight) {
      setCurViewportHeight((prevState) => prevState + 1);
    }
    if (curViewportWidth <= config.viewportWidth) {
      setCurViewportWidth((prevState) => prevState + 1);
    }
  }

  function drawVisibleArea() {
    const top = map.posY - Math.floor(curViewportHeight / 2);
    const bottom = map.posY + Math.floor(curViewportHeight / 2);
    const left = map.posX - Math.floor(curViewportWidth / 2);
    const right = map.posX + Math.floor(curViewportWidth / 2);

    const myRooms = [];
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        if (map.rooms && map.rooms[`${x}.${y}`])
          myRooms.push(map.rooms[`${x}.${y}`]);
      }
    }
    map.setVisibleRooms(myRooms);
  }

  useEffect(() => {
    drawVisibleArea();
    if (map.posX === 109 && map.posY === 121) {
      combat.doEncounter(() => {
        map.setPosX(109);
        map.setPosY(122);
      });
    }
  }, [map.rooms, map.posX, map.posY, curViewportHeight, curViewportWidth]);

  const northPress = useKeyPress('w');
  const southPress = useKeyPress('s');
  const eastPress = useKeyPress('d');
  const westPress = useKeyPress('a');

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    northPress && map.setPosY((prevState) => prevState - 1);
  }, [northPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    southPress && map.setPosY((prevState) => prevState + 1);
  }, [southPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    eastPress && map.setPosX((prevState) => prevState + 1);
  }, [eastPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    westPress && map.setPosX((prevState) => prevState - 1);
  }, [westPress]);

  useEffect(() => {
    const myRooms = {};

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = mapImg;

    let canvas = document.createElement('canvas');
    canvas.width = 257;
    canvas.height = 257;
    canvas.id = 'canvas';
    const ctx = canvas.getContext('2d');

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      img.style.display = 'none';

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const pixel = ctx.getImageData(x, y, 1, 1);
          const data = pixel.data;

          const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${
            data[3] / 255
          })`;

          myRooms[`${x}.${y}`] = {
            x: x,
            y: y,
            rgba: rgba,
          };
        }
      }

      map.setRooms(myRooms);
    };
  }, []);

  return (
    <Collapse in={combat.isWorldOpen} animateOpacity>
      <Box
        borderColor={'#222'}
        borderWidth={'4px'}
        borderRadius={'md'}
        borderTopRadius={0}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: curViewportWidth * config.iconWidth - config.iconWidth * 2,
            height:
              curViewportHeight * config.iconHeight - config.iconHeight * 2,
          }}>
          {map.visibleRooms.map((room, i) => (
            <Room
              key={i}
              x={room.x - map.posX + Math.floor(curViewportWidth / 2)}
              y={room.y - map.posY + Math.floor(curViewportHeight / 2)}
              rgba={room.rgba}
              vpW={curViewportWidth}
              vpH={curViewportHeight}
            />
          ))}
        </div>
      </Box>
    </Collapse>
  );
}
