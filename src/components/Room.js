import React from 'react';
import {config} from '../config';
import {useMessage} from '../providers/MessageProvider';

export const PlayerIcon = (
  <svg
    style={{
      position: 'absolute',
      bottom: 1,
      left: 1,
      width: config.iconWidth - 2,
      height: config.iconHeight - 2,
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512">
    <path
      fill="#FF0000"
      d="M208 48C208 74.51 186.5 96 160 96C133.5 96 112 74.51 112 48C112 21.49 133.5 0 160 0C186.5 0 208 21.49 208 48zM152 352V480C152 497.7 137.7 512 120 512C102.3 512 88 497.7 88 480V256.9L59.43 304.5C50.33 319.6 30.67 324.5 15.52 315.4C.3696 306.3-4.531 286.7 4.573 271.5L62.85 174.6C80.2 145.7 111.4 128 145.1 128H174.9C208.6 128 239.8 145.7 257.2 174.6L315.4 271.5C324.5 286.7 319.6 306.3 304.5 315.4C289.3 324.5 269.7 319.6 260.6 304.5L232 256.9V480C232 497.7 217.7 512 200 512C182.3 512 168 497.7 168 480V352L152 352z"
    />
  </svg>
);

export const TreeIcon = (
  <svg
    style={{
      position: 'absolute',
      bottom: 1,
      left: -1,
      width: config.iconWidth - 2,
      height: config.iconHeight - 2,
      overflow: 'visible',
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512">
    <path
      fill="currentColor"
      d="M413.8 447.1L256 448l0 31.99C256 497.7 241.8 512 224.1 512c-17.67 0-32.1-14.32-32.1-31.99l0-31.99l-158.9-.0099c-28.5 0-43.69-34.49-24.69-56.4l68.98-79.59H62.22c-25.41 0-39.15-29.8-22.67-49.13l60.41-70.85H89.21c-21.28 0-32.87-22.5-19.28-37.31l134.8-146.5c10.4-11.3 28.22-11.3 38.62-.0033l134.9 146.5c13.62 14.81 2.001 37.31-19.28 37.31h-10.77l60.35 70.86c16.46 19.34 2.716 49.12-22.68 49.12h-15.2l68.98 79.59C458.7 413.7 443.1 447.1 413.8 447.1z"
    />
  </svg>
);

export const MountainIcon = (
  <svg
    style={{
      position: 'absolute',
      bottom: 1,
      left: 2,
      width: config.iconWidth - 2,
      height: config.iconHeight - 2,
      overflow: 'visible',
    }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M503.2 393.8L280.1 44.25c-10.42-16.33-37.73-16.33-48.15 0L8.807 393.8c-11.11 17.41-11.75 39.42-1.666 57.45C17.07 468.1 35.92 480 56.31 480h399.4c20.39 0 39.24-11.03 49.18-28.77C514.9 433.2 514.3 411.2 503.2 393.8zM256 111.8L327.8 224H256L208 288L177.2 235.3L256 111.8z"
    />
  </svg>
);

export function Room({x, y, rgba, vpH, vpW}) {
  const height = config.iconHeight;
  const width = config.iconWidth;

  const isWater =
    rgba === 'rgba(0, 106, 255, 1)' ||
    rgba === 'rgba(168, 212, 255, 1)' ||
    rgba === 'rgba(114, 156, 251, 1)' ||
    rgba === 'rgba(48, 165, 255, 1)';
  const isForest = rgba === 'rgba(68, 184, 57, 1)';
  const isForest2 = rgba === 'rgba(144, 255, 79, 1)';
  const isMountain =
    rgba === 'rgba(170, 196, 178, 1)' || rgba === 'rgba(128, 151, 156, 1)';
  const isPlayer = x === Math.floor(vpW / 2) && y === Math.floor(vpH / 2);

  let char = '░';

  if (isWater) char = '≈';
  if (isMountain) char = MountainIcon;
  if (isForest) char = TreeIcon;
  if (isForest2) char = TreeIcon;
  if (isPlayer) char = PlayerIcon;

  return (
    <div
      style={{
        position: 'absolute',
        top: y * height - height,
        left: x * width - width,
        width: width,
        height: height,
        color: rgba,
        fontSize: config.iconWidth - 4 + 'px',
        lineHeight: 1.2,
        backgroundColor: rgba.replace(', 1)', ', 0.15)'),
      }}>
      {char}
    </div>
  );
}
