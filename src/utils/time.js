export function formatTimeElapsed(timeInMilliseconds) {
  return `${Number(timeInMilliseconds / 1000).toFixed(1)}s`;
}
