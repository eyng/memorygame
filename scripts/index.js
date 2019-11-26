const MOBILE_MAX_WIDTH = 920;

const IMAGE_COUNT = 22;
const TILE_COUNT = 16;
const SELECTED_TILE_COUNT = TILE_COUNT / 2;

let openedTile1 = null;
let openedTile2 = null;
let trialCount = 0;
let matchCount = 0;

const shuffleArray = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
};

const createTileNumbers = (imageCount, selectedTileCount) => {
  const tileNumbers = [];
  for (var i = 1; i <= imageCount; i += 1) {
    tileNumbers.push(i);
  }
  shuffleArray(tileNumbers);
  selectedTileNumbers = tileNumbers.slice(0, selectedTileCount);
  const tileNumbersTwice = [...selectedTileNumbers, ...selectedTileNumbers];
  shuffleArray(tileNumbersTwice);
  return tileNumbersTwice;
};

const createTile = (tileNumbers, i) => {
  var tile = document.createElement("div");
  tile.id = i;
  tile.classList.add(`image-${tileNumbers[i]}`, "tile", "closed");
  tile.addEventListener("click", onTileClick);
  return tile;
};

const createTiles = (tileCount, tileNumbers) => {
  const tiles = document.getElementById("tiles");
  for (var i = 0; i <= tileCount - 1; i += 1) {
    const tile = createTile(tileNumbers, i);
    tiles.appendChild(tile);
  }
};

// Call with await, from inside an async function
const sleepSeconds = s => {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
};

const markOpenedTiles = className => {
  if (openedTile1) openedTile1.classList.add(className);
  if (openedTile2) openedTile2.classList.add(className);
};

const unmarkOpenedTiles = className => {
  if (openedTile1) openedTile1.classList.remove(className);
  if (openedTile2) openedTile2.classList.remove(className);
};

const clickedOnTheFirstImage = target => {
  trialCount += 1;
  document.getElementById("trialCount").innerHTML = trialCount;
  openedTile1 = target;
  markOpenedTiles("unclickable");
};

const onMatch = () => {
  markOpenedTiles("matched");
  markOpenedTiles("unclickable");
  matchCount += 1;
  if (matchCount === SELECTED_TILE_COUNT) {
    [...document.getElementsByClassName("tile")].forEach(e =>
      e.classList.remove("matched")
    );
  }
};

const onNoMatch = async () => {
  await sleepSeconds(0.5);
  markOpenedTiles("closed");
  unmarkOpenedTiles("unclickable");
};

const clickedOnTheSecondImage = async target => {
  openedTile2 = target;

  if (openedTile1.classList[0] === openedTile2.classList[0]) {
    onMatch();
  } else {
    await onNoMatch();
  }

  openedTile1 = null;
  openedTile2 = null;
};

const onTileClick = async e => {
  e.target.classList.remove("closed");
  if (openedTile1) {
    await clickedOnTheSecondImage(e.target);
  } else {
    clickedOnTheFirstImage(e.target);
  }
};

const resetTiles = () => {
  const tiles = document.getElementById("tiles");
  while (tiles.firstChild) {
    tiles.removeChild(tiles.firstChild);
  }
};

const onLoad = () => {
  resetTiles();
  const tileNumbers =
    window.innerWidth <= 920
      ? createTileNumbers(IMAGE_COUNT, SELECTED_TILE_COUNT)
      : createTileNumbers(IMAGE_COUNT, SELECTED_TILE_COUNT);
  createTiles(TILE_COUNT, tileNumbers);
};

window.onload = onLoad;
