const config = {
  resources: {
    wood: {
      id: 'wood',
      action: 'Chop',
      name: 'Wood',
      defaultValue: 1,
      ticksToComplete: 5,
      unlocksWhen: (game) => true,
      increment: (game) => game.incrementResource('wood', 1),
    },
    food: {
      id: 'food',
      action: 'Farm',
      name: 'Food',
      defaultValue: 0,
      ticksToComplete: 20,
      unlocksWhen: (game) => game.resources.wood >= 10,
      increment: (game) => game.incrementResource('food', 10),
    },
  },
};

export default config;
