export function rollDie(max) {
  return 1 + Math.floor(Math.random() * max);
}

export function rollDice(dieStr) {
  const [numRolls, numSides] = dieStr.split('d');
  let total = 0;
  for (let i = 0; i < numRolls; i++) {
    total += rollDie(numSides);
  }
  return total;
}
