import {
  Box,
  Collapse,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {useCombat} from '../CombatProvider';
import {useEffect, useState} from 'react';
import {useKeyPress} from '../utils/useKeyPress';
import ReactDOMServer from 'react-dom/server';
import {getRandomRange} from '../utils/number';
import {
  ArmoryIcon,
  FarmIcon,
  ForgeIcon,
  GoldIcon,
  MountainIcons,
  PlayerIcon,
  ResourceGoldIcon,
  ResourceRocksIcon,
  ResourceWoodIcon,
  RockIcons,
  TreeIcons,
  WaterIcons,
} from './Icons';
import {useGame} from '../GameProvider';

const newLine = '\n';

export const options = {
  width: 28,
  height: 20,
  spacing: 1,
  chars: {
    default: '.',
    fow: '#',
    mountains: '^',
    forest: 't',
    tree: 'T',
    path: 'x',
    stone: 'o',
    player: '#',
  },
  costs: {
    farm: {
      gold: 20,
      wood: 10,
      rocks: 0,
    },
    armory: {
      gold: 40,
      wood: 15,
      rocks: 0,
    },
    forge: {
      gold: 50,
      wood: 0,
      rocks: 10,
    },
  },
};

export function RenderMap() {
  const game = useGame();
  const combat = useCombat();
  const northPress = useKeyPress('w');
  const southPress = useKeyPress('s');
  const eastPress = useKeyPress('d');
  const westPress = useKeyPress('a');
  const [positionX, setPositionX] = useState(Math.floor(options.width / 2));
  const [positionY, setPositionY] = useState(Math.floor(options.height / 2));

  const [asciiMap, setAsciiMap] = useState('');
  const [fogOfWarMap, setFogOfWarMap] = useState('');

  const [mapData, setMapData] = useState({});

  function generateMap() {
    let myMapData = {};
    //myMapData = populateMountains(myMapData);
    myMapData = populateTrees(myMapData);
    myMapData = populateRocks(myMapData);
    myMapData = populateGold(myMapData);
    myMapData = populateWater(myMapData);
    setMapData(myMapData);
  }

  function getDataForXY(col, row) {
    let myData = mapData[`${col}.${row}`];

    if (!myData) {
      return null;
    } else {
      return myData;
    }
  }

  function setDataForXY(col, row, payload) {
    setMapData((prevState) => {
      let data = {...prevState};
      data[`${col}.${row}`] = payload;
      return data;
    });
  }

  function buildFarm() {
    if (
      game.gold >= options.costs.farm.gold &&
      game.wood >= options.costs.farm.wood &&
      game.rocks >= options.costs.farm.rocks
    ) {
      setDataForXY(positionX, positionY, {
        ...getDataForXY(positionY, positionY),
        hasFarm: true,
      });
      game.consumeResources(
        options.costs.farm.gold,
        options.costs.farm.wood,
        options.costs.farm.rocks
      );
    } else {
      console.log('Cant afford a farm!');
    }
  }

  function buildArmory() {
    setDataForXY(positionX, positionY, {
      ...getDataForXY(positionY, positionY),
      hasArmory: true,
    });
  }

  function buildForge() {
    setDataForXY(positionX, positionY, {
      ...getDataForXY(positionY, positionY),
      hasForge: true,
    });
  }

  function populateMountains(myMapData) {
    for (let rows = 0; rows < options.height; rows++) {
      for (let cols = 0; cols < options.width; cols++) {
        if (Math.floor(Math.random() * 20) < 2) {
          const rand = getRandomRange(1, 3);
          if (!myMapData[`${cols}.${rows}`]) {
            myMapData[`${cols}.${rows}`] = {};
          }
          myMapData[`${cols}.${rows}`].hasMountain = true;
          myMapData[`${cols}.${rows}`].iconClass = 'mountain' + rand;
        }
      }
    }

    return myMapData;
  }

  function populateTrees(myMapData) {
    for (let rows = 0; rows < options.height; rows++) {
      for (let cols = 0; cols < options.width; cols++) {
        if (Math.floor(Math.random() * 10) < 2) {
          const rand = getRandomRange(1, 3);
          if (!myMapData[`${cols}.${rows}`]) {
            myMapData[`${cols}.${rows}`] = {};
          }
          myMapData[`${cols}.${rows}`].hasTree = true;
          myMapData[`${cols}.${rows}`].couldBeHostile = true;
          myMapData[`${cols}.${rows}`].iconClass = 'tree' + rand;
        }
      }
    }

    return myMapData;
  }

  function populateRocks(myMapData) {
    for (let rows = 0; rows < options.height; rows++) {
      for (let cols = 0; cols < options.width; cols++) {
        if (Math.floor(Math.random() * 20) < 2) {
          const rand = getRandomRange(1, 3);
          if (!myMapData[`${cols}.${rows}`]) {
            myMapData[`${cols}.${rows}`] = {};
          }
          myMapData[`${cols}.${rows}`].hasRock = true;
          myMapData[`${cols}.${rows}`].couldBeHostile = false;
          myMapData[`${cols}.${rows}`].iconClass = 'rock' + rand;
        }
      }
    }

    return myMapData;
  }

  function populateGold(myMapData) {
    for (let rows = 0; rows < options.height; rows++) {
      for (let cols = 0; cols < options.width; cols++) {
        if (Math.floor(Math.random() * 100) < 2) {
          if (!myMapData[`${cols}.${rows}`]) {
            myMapData[`${cols}.${rows}`] = {};
          }
          myMapData[`${cols}.${rows}`].hasGold = true;
          myMapData[`${cols}.${rows}`].couldBeHostile = true;
          myMapData[`${cols}.${rows}`].iconClass = 'gold';
        }
      }
    }

    return myMapData;
  }

  function populateWater(myMapData) {
    const numLakes = getRandomRange(1, 4);
    const minLakeSize = getRandomRange(1, 3);
    const maxLakeSize = getRandomRange(4, 8);

    for (let i = 0; i < numLakes; i++) {
      const cols = getRandomRange(0, options.width);
      const rows = getRandomRange(0, options.height);

      if (!myMapData[`${cols}.${rows}`]) {
        myMapData[`${cols}.${rows}`] = {};
      }

      // get center of water
      myMapData[`${cols}.${rows}`].hasWater = true;
      myMapData[`${cols}.${rows}`].iconClass = 'water1';

      const lakeSize = getRandomRange(minLakeSize, maxLakeSize);

      // make 1 surrounding water2

      //n & ne & nw
      if (!myMapData[`${cols}.${rows - 1}`]) {
        myMapData[`${cols}.${rows - 1}`] = {};
      }
      if (!myMapData[`${cols + 1}.${rows - 1}`]) {
        myMapData[`${cols + 1}.${rows - 1}`] = {};
      }
      if (!myMapData[`${cols - 1}.${rows - 1}`]) {
        myMapData[`${cols - 1}.${rows - 1}`] = {};
      }

      //e
      if (!myMapData[`${cols + 1}.${rows}`]) {
        myMapData[`${cols + 1}.${rows}`] = {};
      }

      //s & se & sw
      if (!myMapData[`${cols}.${rows + 1}`]) {
        myMapData[`${cols}.${rows + 1}`] = {};
      }
      if (!myMapData[`${cols + 1}.${rows + 1}`]) {
        myMapData[`${cols + 1}.${rows + 1}`] = {};
      }
      if (!myMapData[`${cols - 1}.${rows + 1}`]) {
        myMapData[`${cols - 1}.${rows + 1}`] = {};
      }

      //w
      if (!myMapData[`${cols - 1}.${rows}`]) {
        myMapData[`${cols - 1}.${rows}`] = {};
      }
      //n
      myMapData[`${cols}.${rows - 1}`].hasWater = true;
      myMapData[`${cols + 1}.${rows - 1}`].hasWater = true;
      myMapData[`${cols - 1}.${rows - 1}`].hasWater = true;
      //e
      myMapData[`${cols + 1}.${rows}`].hasWater = true;
      //s
      myMapData[`${cols}.${rows + 1}`].hasWater = true;
      myMapData[`${cols + 1}.${rows + 1}`].hasWater = true;
      myMapData[`${cols - 1}.${rows + 1}`].hasWater = true;
      //w
      myMapData[`${cols - 1}.${rows}`].hasWater = true;

      //n
      myMapData[`${cols}.${rows - 1}`].iconClass = 'water2';
      myMapData[`${cols + 1}.${rows - 1}`].iconClass = 'water2';
      myMapData[`${cols - 1}.${rows - 1}`].iconClass = 'water2';
      //e
      myMapData[`${cols + 1}.${rows}`].iconClass = 'water2';
      //s
      myMapData[`${cols}.${rows + 1}`].iconClass = 'water2';
      myMapData[`${cols + 1}.${rows + 1}`].iconClass = 'water2';
      myMapData[`${cols - 1}.${rows + 1}`].iconClass = 'water2';
      //w
      myMapData[`${cols - 1}.${rows}`].iconClass = 'water2';
    }

    for (let i in myMapData) {
      const cell = myMapData[i];
      const [x, y] = i.split('.');
      if (cell.hasWater) {
      }
    }
    return myMapData;
  }

  function updateMap() {
    let myAsciiMap = '';
    let myFogOfWarMap = '';

    for (let rows = 0; rows < options.height; rows++) {
      for (let cols = 0; cols < options.width; cols++) {
        let cellData = getDataForXY(cols, rows);

        let char = options.chars.default;
        let fowChar = options.chars.fow;

        if (cellData && cellData.hasMountain) {
          char = MountainIcons[cellData.iconClass];
        }

        if (cellData && cellData.hasTree) {
          char = TreeIcons[cellData.iconClass];
        }

        if (cellData && cellData.hasRock) {
          char = RockIcons[cellData.iconClass];
        }

        if (cellData && cellData.hasGold) {
          char = GoldIcon;
        }

        if (cellData && cellData.hasFarm) {
          char = FarmIcon;
        }

        if (cellData && cellData.hasArmory) {
          char = ArmoryIcon;
        }

        if (cellData && cellData.hasForge) {
          char = ForgeIcon;
        }

        if (cellData && cellData.hasWater) {
          char = WaterIcons[cellData.iconClass];
        }

        // path
        if (cols === 20) {
          char = <span style={{color: '#d2b661'}}>{options.chars.path}</span>;
        }

        // player
        if (cols === positionX && rows === positionY) {
          // tree? chop tree down & collect lumber
          if (cellData && cellData.hasTree) {
            setDataForXY(cols, rows, {
              ...cellData,
              hasTree: false,
              couldBeHostile: false,
            });
            game.gainWood();
          }
          // rock? mine & collect ore
          if (cellData && cellData.hasRock) {
            setDataForXY(cols, rows, {
              ...cellData,
              hasRock: false,
              couldBeHostile: false,
            });
            game.gainRocks();
          }
          // gold? mine & collect it but beware!
          if (cellData && cellData.hasGold) {
            setDataForXY(cols, rows, {
              ...cellData,
              hasGold: false,
              couldBeHostile: false,
            });
            game.gainGold();
          }

          if (cellData && cellData.hasWater) {
            combat.setPlayer((prevState) => {
              let newState = {...prevState};
              newState.hp = newState.maxHp;
              newState.mp = newState.maxMp;
              return newState;
            });
            console.log('the water heals!');
          }

          char = PlayerIcon;
        }

        // spacing
        for (let i = 0; i < options.spacing; i++) {
          myAsciiMap += ' ';
          myFogOfWarMap += ' ';
        }

        myAsciiMap += ReactDOMServer.renderToStaticMarkup(
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: 16,
              height: 24,
              verticalAlign: 'middle',
              color: '#333',
            }}>
            {char}
          </div>
        );

        myFogOfWarMap += ReactDOMServer.renderToStaticMarkup(
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: 16,
              height: 24,
              verticalAlign: 'middle',
              color: '#333',
            }}>
            {fowChar}
          </div>
        );
      }

      myAsciiMap += newLine;
      myFogOfWarMap += newLine;
    }

    setAsciiMap(myAsciiMap);
    setFogOfWarMap(myFogOfWarMap);
  }

  function checkForEncounter() {
    const cellData = getDataForXY(positionX, positionY);

    if (cellData && cellData.couldBeHostile) {
      let hasEncounter = false;
      if (cellData.hasGold && getRandomRange(1, 100) < 50) {
        hasEncounter = true;
      }
      if (cellData.hasTree && getRandomRange(1, 100) < 15) {
        hasEncounter = true;
      }

      if (!hasEncounter && getRandomRange(1, 100) < 5) {
        hasEncounter = true;
      }

      if (hasEncounter) {
        setDataForXY(positionX, positionY, {...cellData, hasEnemy: true});
        combat.openBattle();
        combat.closeWorld();
        combat.nextEnemy();
      }
    }
  }

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    northPress && setPositionY((prevState) => prevState - 1);
  }, [northPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    southPress && setPositionY((prevState) => prevState + 1);
  }, [southPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    eastPress && setPositionX((prevState) => prevState + 1);
  }, [eastPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    westPress && setPositionX((prevState) => prevState - 1);
  }, [westPress]);

  useEffect(() => {
    updateMap();
    checkForEncounter();
  }, [mapData, positionY, positionX]);

  useEffect(() => {
    if (combat.playerDead) {
      setPositionY(0);
      setPositionX(0);
    }
  }, [combat.playerDead]);

  useEffect(() => {
    generateMap();
  }, []);

  return (
    <div style={{position: 'relative'}}>
      <BuildMenu
        positionX={positionX}
        positionY={positionY}
        onBuildFarm={buildFarm}
        onBuildArmory={buildArmory}
        onBuildForge={buildForge}
      />
      <pre dangerouslySetInnerHTML={{__html: asciiMap}} />
    </div>
  );
}

export function BuildMenu({
  positionX,
  positionY,
  onBuildFarm = () => {},
  onBuildArmory = () => {},
  onBuildForge = () => {},
}) {
  const game = useGame();
  const combat = useCombat();
  const buildPress = useKeyPress('b');
  const farmPress = useKeyPress('f');
  const armoryPress = useKeyPress('r');
  const forgePress = useKeyPress('o');

  const [canAffordFarm, setCanAffordFarm] = useState(false);
  const [canAffordArmory, setCanAffordArmory] = useState(false);
  const [canAffordForge, setCanAffordForge] = useState(false);

  const [showBuildMenu, setShowBuildMenu] = useState(false);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    if (buildPress) setShowBuildMenu(!showBuildMenu);
  }, [buildPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    if (showBuildMenu && farmPress) {
      onBuildFarm();
      setShowBuildMenu(false);
    }
  }, [farmPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    if (showBuildMenu && armoryPress) {
      onBuildArmory();
      setShowBuildMenu(false);
    }
  }, [armoryPress]);

  useEffect(() => {
    if (combat.playerDead || combat.isBattleOpen) return;
    if (showBuildMenu && forgePress) {
      onBuildForge();
      setShowBuildMenu(false);
    }
  }, [forgePress]);

  useEffect(() => {
    setCanAffordFarm(false);
    setCanAffordArmory(false);
    setCanAffordForge(false);

    if (
      game.gold >= options.costs.farm.gold &&
      game.wood >= options.costs.farm.wood &&
      game.rocks >= options.costs.farm.rocks
    ) {
      setCanAffordFarm(true);
    }
    if (
      game.gold >= options.costs.armory.gold &&
      game.wood >= options.costs.armory.wood &&
      game.rocks >= options.costs.armory.rocks
    ) {
      setCanAffordArmory(true);
    }
    if (
      game.gold >= options.costs.forge.gold &&
      game.wood >= options.costs.forge.wood &&
      game.rocks >= options.costs.forge.rocks
    ) {
      setCanAffordForge(true);
    }
  }, [game.gold, game.wood, game.rocks]);

  if (!showBuildMenu) return <></>;

  return (
    <Box
      bgColor={'#222'}
      borderColor={'#ccc'}
      borderRadius={'xl'}
      style={{
        position: 'absolute',
        top: 26 * positionY,
        left: 26 * (positionX + 1),
        zIndex: 9999,
      }}>
      <VStack>
        <Box
          p={2}
          color={canAffordFarm ? '#fff' : '#555'}
          alignSelf={'flex-start'}
          textAlign={'left'}>
          <HStack textAlign={'left'} alignItems={'flex-start'}>
            <Heading fontSize={'sm'}>Farm (f)</Heading>
            {options.costs.farm.gold > 0 && (
              <Text fontSize={'xs'}>
                <ResourceGoldIcon /> {` ${options.costs.farm.gold}`}
              </Text>
            )}
            {options.costs.farm.wood > 0 && (
              <Text fontSize={'xs'}>
                <ResourceWoodIcon /> {` ${options.costs.farm.wood}`}
              </Text>
            )}
            {options.costs.farm.rocks > 0 && (
              <Text fontSize={'xs'}>
                <ResourceRocksIcon /> {` ${options.costs.farm.rocks}`}
              </Text>
            )}
          </HStack>
          <Text fontSize={'xs'}>Generates 1 food every 3 seconds.</Text>
        </Box>
        <Divider />
        <Box
          p={2}
          color={canAffordArmory ? '#fff' : '#555'}
          alignSelf={'flex-start'}
          textAlign={'left'}>
          <HStack textAlign={'left'} alignItems={'flex-start'}>
            <Heading fontSize={'sm'}>Armory (r)</Heading>
            {options.costs.armory.gold > 0 && (
              <Text fontSize={'xs'}>
                <ResourceGoldIcon /> {` ${options.costs.armory.gold}`}
              </Text>
            )}
            {options.costs.armory.wood > 0 && (
              <Text fontSize={'xs'}>
                <ResourceWoodIcon /> {` ${options.costs.armory.wood}`}
              </Text>
            )}
            {options.costs.armory.rocks > 0 && (
              <Text fontSize={'xs'}>
                <ResourceRocksIcon /> {` ${options.costs.armory.rocks}`}
              </Text>
            )}
          </HStack>
          <Text fontSize={'xs'}>Enable armor upgrades.</Text>
        </Box>
        <Divider />
        <Box
          p={2}
          color={canAffordForge ? '#fff' : '#555'}
          alignSelf={'flex-start'}
          textAlign={'left'}>
          <HStack textAlign={'left'} alignItems={'flex-start'}>
            <Heading fontSize={'sm'}>Forge (o)</Heading>
            {options.costs.forge.gold > 0 && (
              <Text fontSize={'xs'}>
                <ResourceGoldIcon /> {` ${options.costs.forge.gold}`}
              </Text>
            )}
            {options.costs.forge.wood > 0 && (
              <Text fontSize={'xs'}>
                <ResourceWoodIcon /> {` ${options.costs.forge.wood}`}
              </Text>
            )}
            {options.costs.forge.rocks > 0 && (
              <Text fontSize={'xs'}>
                <ResourceRocksIcon /> {` ${options.costs.forge.rocks}`}
              </Text>
            )}
          </HStack>
          <Text fontSize={'xs'}>Enable weapon upgrades.</Text>
        </Box>
      </VStack>
    </Box>
  );
}

export function WorldMap() {
  const combat = useCombat();

  return (
    <Collapse in={combat.isWorldOpen} animateOpacity>
      <RenderMap />
    </Collapse>
  );
}
