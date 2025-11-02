const level = document.getElementById("level");
const speed = document.getElementById("speed");
const hidePairs = document.getElementById("hide-pairs");
const numbered = document.getElementById("mode");
const hideTimer = document.getElementById("hide-timer");
const hideMovesDropdown = document.getElementById("hide-moves");
const gameArea = document.querySelector(".cards-container");
const progress = document.querySelector(".progress");
const startContainer = document.querySelector(".start-container");
const startBtn = document.querySelector(".start-btn");
let countdown = document.querySelector(".countdown");
const timer = document.querySelector(".timer");
const timerDropdown = document.getElementById("timer");
const pairsDropdown = document.getElementById("hide-pairs");
const hideTimerDropdown = document.getElementById("hide-timer");
const modeDropdown = document.getElementById("mode");
const moveCountDisplay = document.getElementById("move-count");
const options = document.querySelectorAll(".option");
const percentageText = document.querySelector(".percentage");
const stopBtn = document.querySelector(".stop-btn");
function disableOptions(opts) {
  opts.forEach((opt) => {
    opt.disabled = true;
  });
}
function enableOptions(opts) {
  opts.forEach((opt) => {
    opt.disabled = false;
  });
}
startBtn.addEventListener("click", startGame);

stopBtn.addEventListener("click", (e) => {
  stopTimer();
  endGame();
});

const colors = [
  "#87CEEB", // Sky Blue
  "#FF7F50", // Coral
  "#90EE90", // Light Green
  "#DAA520", // Goldenrod
  "#DC143C", // Crimson
  "#BA55D3", // Medium Orchid
  "#FF1493", // Deep Pink
  "#F4A460", // Sandy Brown
  "#40E0D0", // Turquoise
  "#6B8E23", // Olive Drab
  "#4169E1", // Royal Blue
  "#B22222", // Firebrick
  "#E6E6FA", // Lavender
  "#708090", // Slate Gray
  "#FF6347", // Tomato
  "#FF8C00", // Dark Orange
  "#DB7093", // Pale Violet Red
  "#2E8B57", // Sea Green
];

const card_images = [
  "bear.png",
  "cactus.png",
  "corgi.png",
  "crown.png",
  "dog.png",
  "elephant.png",
  "flower.png",
  "fox.png",
  "hippo.png",
  "lion.png",
  "penguin.png",
  "ship.png",
  "squirrel.png",
  "stopwatch.png",
  "tiger.png",
  "turtle.png",
  "vaisakhi.png",
  "xmas_gifts.png",
];

let pairsFounded = 0;
let numOfCards = 12;
let cardsSelected = [];
let colorsSelected = [];
let imagesSelected = [];
let flipCount = 0;
let gameDuration = 150;
let pairsHidden = false;
let noTimer = false;
let useImages = false;
let hideMoves = false;
let movesCount = 0;
let countdownInterval;
// This will initialize the gamearea at the start of the document.
changeLevel();
updateProgress();

function resetGame() {
  pairsFounded = 0;
  cardsSelected = [];
  colorsSelected = [];
  imagesSelected = [];
  flipCount = 0;
  movesCount = 0;
  progress.style.width = "0%";
  percentageText.textContent = `0%`;
  moveCountDisplay.textContent = `0`;
}

async function startGame(e) {
  // This will keep the card faced downwards after clicking retry.
  changeLevel();
  changeTimer();
  disableOptions(options);
  resetGame();

  countdown.style.display = "inline";
  let start = e.currentTarget;
  start.style.display = "none";
  for (let i = 3; i > 0; i--) {
    countdown.textContent = "" + i;
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  stopBtn.disabled = false;

  countdown.style.display = "none";
  startContainer.style.display = "none";

  startTimer();
}

// gets the percentage of the progress
function updateProgress() {
  progress.style.width = `${((pairsFounded * 2) / numOfCards) * 100}%`; // pairs founded is multiplied by 2 because 1 pair = 2 cards
  percentageText.textContent = `${Math.round(
    ((pairsFounded * 2) / numOfCards) * 100
  )}%`;
}

function changeLevel() {
  gameArea.innerHTML = "";
  let rows = parseInt(level.value[0]);
  let columns = parseInt(level.value[level.value.length - 1]);

  gameArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gameArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  numOfCards = rows * columns;
  createCards(rows, columns);
}

function changeTimer() {
  gameDuration = parseInt(timerDropdown.value);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  let minutes = Math.floor(gameDuration / 60);
  let seconds = gameDuration % 60;
  let formattedTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  timer.textContent = `${formattedTime}`;
}

function createCards(rows, columns) {
  totalCards = rows * columns;

  cardColors = [];
  cardPictures = [];

  if (useImages != true) {
    for (i = 0; i < totalCards / 2; i++) {
      const color = colors[i % colors.length];
      cardColors.push(color, color);
    }
    shuffleArray(cardColors);
  } else {
    for (i = 0; i < totalCards / 2; i++) {
      const picture = card_images[i % card_images.length];
      cardPictures.push(picture, picture);
    }
    shuffleArray(cardPictures);
  }

  // Add the cards to the game area
  for (let i = 0; i < totalCards; i++) {
    // Create the elements
    const cardContainer = document.createElement("div");
    const card = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    cardContainer.classList.add("card-container");

    // Add an identifier to each cards
    card.id = "card-" + i;

    card.classList.add("the-card");
    cardFront.classList.add("card-front");
    cardBack.classList.add("card-back");

    // Set the color of the card

    if (useImages != true) {
      cardBack.style.background = cardColors[i];
    } else {
      cardBack.style.backgroundImage = `url(./images/card_icons/${cardPictures[i]})`;
    }

    cardContainer.appendChild(card);
    // Add the card to the container; front and back surfaces are added to the card
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    // adds the card to the game area
    gameArea.appendChild(cardContainer);

    addCardFlipListener(card);
  }
}

// Define the named event listener function
async function flipCardHandler(e) {
  const card = e.currentTarget;
  // Card will not be flipped if the card is already flipped, or if 2 cards are already flipped.
  if (cardsSelected.includes(card.id) || flipCount === 2) return;

  if (!hideMoves) {
    updateMoveCount();
  }
  flipCount += 1;
  cardsSelected.push(card.id);

  const colorOfCard = card.childNodes[1].style.background;
  const imageOfCard = card.childNodes[1].style.backgroundImage;

  if (useImages != true) {
    colorsSelected.push(colorOfCard);
  } else {
    imagesSelected.push(imageOfCard);
  }

  // Flips the card

  card.style.transform = "rotateY(180deg)";

  // When two cards have been selected
  if (flipCount === 2) {
    // This will give a brief delay before checking if the cards match or not
    await new Promise((resolve) => setTimeout(resolve, 500));

    // resets the flip count
    flipCount = 0;
    if (useImages != true) {
      checkColors();
    } else {
      checkImages();
    }
  }
}

function checkImages() {
  if (imagesSelected[0] === imagesSelected[1]) {
    // removes the event listeners of the two matched cards
    pairsFounded += 1;
    updateProgress();
    if (pairsFounded >= numOfCards / 2) {
      endGame();
    }
    cardsSelected.forEach((selectedCardId) => {
      const selectedCard = document.getElementById(selectedCardId);
      selectedCard.removeEventListener("click", flipCardHandler); // Remove the flip handler for matched cards
      if (pairsHidden == true) {
        selectedCard.parentNode.style.visibility = "hidden";
      }
    });
  } else {
    // Flips the card back down if the cards do not match
    cardsSelected.forEach((selectedCardId) => {
      const selectedCard = document.getElementById(selectedCardId);
      selectedCard.style.transform = "rotateY(0deg)";
    });
  }

  // Clear the selected cards array
  cardsSelected = [];
  imagesSelected = [];
}
function checkColors() {
  if (colorsSelected[0] === colorsSelected[1]) {
    // removes the event listeners of the two matched cards
    pairsFounded += 1;
    updateProgress();
    if (pairsFounded >= numOfCards / 2) {
      endGame();
    }
    cardsSelected.forEach((selectedCardId) => {
      const selectedCard = document.getElementById(selectedCardId);
      selectedCard.removeEventListener("click", flipCardHandler); // Remove the flip handler for matched cards
      if (pairsHidden == true) {
        selectedCard.parentNode.style.visibility = "hidden";
      }
    });
  } else {
    // Flips the card back down if the cards do not match
    cardsSelected.forEach((selectedCardId) => {
      const selectedCard = document.getElementById(selectedCardId);
      selectedCard.style.transform = "rotateY(0deg)";
    });
  }

  // Clear the selected cards array
  cardsSelected = [];
  colorsSelected = [];
}

// Add the event listener to a card
function addCardFlipListener(card) {
  card.addEventListener("click", flipCardHandler);
}

// Fisher Yates algorithm for shuffling an array.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateTimer() {
  updateTimerDisplay();
  gameDuration--;

  if (gameDuration < 0) {
    clearInterval(countdown); // Stop the timer
    endGame(); // End the game
  }
}

function updateMoveCount() {
  movesCount++;
  moveCountDisplay.textContent = movesCount;
}
function endGame() {
  stopTimer();
  stopBtn.disabled = true;
  startContainer.style.display = "flex";
  countdown.textContent = "YOU WIN!";
  startBtn.style.display = "inline";
  startBtn.textContent = "Retry";
  gameDuration = 60 * 2;
  enableOptions(options);
}

function togglePairsHidden() {
  pairsHidden = pairsDropdown.value == "true";
}

function toggleTimerOff() {
  noTimer = hideTimerDropdown.value == "true";

  if (noTimer) {
    timer.textContent = "00:00";
    timer.style.visibility = "hidden";
  } else {
    updateTimerDisplay();
    timer.style.visibility = "visible";
  }
}

function toggleMode() {
  useImages = modeDropdown.value == "images";
}

function toggleHideMoves() {
  hideMoves = hideMovesDropdown.value == "true";

  if (hideMoves) {
    moveCountDisplay.textContent = "?";
  } else {
    moveCountDisplay.textContent = "0";
  }
}

function stopTimer() {
  clearInterval(countdown); // Stop the timer
}

function startTimer() {
  if (noTimer != true) {
    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000); // Update every second
  }
}

function resetOptions() {
  level.value = "4x3";
  timerDropdown.value = "150";
  pairsDropdown.value = "false";
  modeDropdown.value = "colors";
  hideTimerDropdown.value = "false";
  hideMovesDropdown.value = "false";
  changeLevel();
  changeTimer();
  togglePairsHidden();
  toggleMode();
  toggleTimerOff();
  toggleHideMoves();
}
