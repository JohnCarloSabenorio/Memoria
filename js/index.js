const level = document.getElementById("level");
const speed = document.getElementById("speed");
const hidePairs = document.getElementById("hide-pairs");
const numbered = document.getElementById("hide-pairs");
const hideTimer = document.getElementById("hide-timer");
const hideMoves = document.getElementById("hide-moves");
const gameArea = document.querySelector(".grid-item-2");
const progress = document.querySelector(".progress");

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
let pairsFounded = 6;
let numOfCards = 12;

let cardsFlipped = 0;


changeLevel();
// gets the percentage of the progress
progress.style.width = `${((pairsFounded * 2) / numOfCards) * 100}%`; // pairs founded is multiplied by 2 because 1 pair = 2 cards

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
  for (let i = 0; i < totalCards; i++) {
    const cardContainer = document.createElement("div");
    const card = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    cardContainer.classList.add("card-container");
    card.id = i;
    card.classList.add("the-card");
    cardFront.classList.add("card-front");
    cardBack.classList.add("card-back");
    cardBack.style.background = cardColors[i];
    gameArea.appendChild(cardContainer);
    cardContainer.appendChild(card);
    card.appendChild(cardFront);
    card.appendChild(cardBack);

    addCardFlipListener(card);
  }
}

function addCardFlipListener(card) {
  card.addEventListener("click", (e) => {
    cardsFlipped += 1;

    if (cardsFlipped == 2) {
      card.style.transform = "rotateY(0deg)";
      cardsFlipped = 0;
      return;
    }
    card.style.transform = "rotateY(180deg)";
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
