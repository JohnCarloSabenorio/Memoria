const level = document.getElementById("level");
const speed = document.getElementById("speed");
const hidePairs = document.getElementById("hide-pairs");
const numbered = document.getElementById("hide-pairs");
const hideTimer = document.getElementById("hide-timer");
const hideMoves = document.getElementById("hide-moves");
const gameArea = document.querySelector(".cards-container");
const progress = document.querySelector(".progress");
const startContainer = document.querySelector(".start-container");
const startBtn = document.querySelector(".start-btn");
const countdown = document.querySelector(".countdown");
startBtn.addEventListener("click", startHandler);

async function startHandler(e) {
  countdown.style.display = "inline";
  let start = e.currentTarget;
  start.style.display = "none";
  for (let i = 3; i > 0; i--) {
    countdown.textContent = "" + i;
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  startContainer.style.display = "none";
}
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
let pairsFounded = 0;
let numOfCards = 12;
let cardsSelected = [];
let colorsSelected = [];
let flipCount = 0;

changeLevel();
updateProgress();
// gets the percentage of the progress
function updateProgress() {
  progress.style.width = `${((pairsFounded * 2) / numOfCards) * 100}%`; // pairs founded is multiplied by 2 because 1 pair = 2 cards
}

function changeLevel() {
  gameArea.innerHTML = "";
  let rows = parseInt(level.value[0]);
  let columns = parseInt(level.value[level.value.length - 1]);
  console.log(`Number of Rows: ${rows}`);
  console.log(`Number of Columns: ${columns}`);
  gameArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gameArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  numOfCards = rows * columns;
  createCards(rows, columns);
}

function createCards(rows, columns) {
  totalCards = rows * columns;
  const bgcolors = [
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

  cardColors = [];
  for (i = 0; i < totalCards / 2; i++) {
    const color = colors[i % colors.length];
    cardColors.push(color, color);
  }
  console.log("CARD COLORS: ", cardColors);
  shuffleArray(cardColors);

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
    cardBack.style.background = cardColors[i];

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

  flipCount += 1;
  cardsSelected.push(card.id);
  const colorOfCard = card.childNodes[1].style.background;
  colorsSelected.push(colorOfCard);

  // Flips the card
  card.style.transform = "rotateY(180deg)";

  // When two cards have been selected
  if (flipCount === 2) {
    // This will give a brief delay before checking if the cards match or not
    await new Promise((resolve) => setTimeout(resolve, 700));

    // resets the flip count
    flipCount = 0;

    if (colorsSelected[0] === colorsSelected[1]) {
      // removes the event listeners of the two matched cards
      pairsFounded += 1;
      updateProgress();
      if (pairsFounded >= numOfCards / 2) {
        alert("Congratulations!");
      }
      cardsSelected.forEach((selectedCardId) => {
        const selectedCard = document.getElementById(selectedCardId);
        const selectedCardBack = card.childNodes[1];
        console.log(selectedCardBack.style.background);
        selectedCard.removeEventListener("click", flipCardHandler); // Remove the flip handler for matched cards
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
