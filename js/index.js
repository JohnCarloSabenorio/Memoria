const level = document.getElementById("level");
const speed = document.getElementById("speed");
const hidePairs = document.getElementById("hide-pairs");
const numbered = document.getElementById("hide-pairs");
const hideTimer = document.getElementById("hide-timer");
const hideMoves = document.getElementById("hide-moves");
const gameArea = document.querySelector(".grid-item-2");
const progress = document.querySelector(".progress");
let pairsFounded = 6;
let numOfCards = 12;


// gets the percentage of the progress
progress.style.width = `${pairsFounded*2/numOfCards * 100}%`; // pairs founded is multiplied by 2 because 1 pair = 2 cards

function changeLevel(){
    gameArea.innerHTML = "";
    let rows = parseInt(level.value[0]);
    let columns = parseInt(level.value[level.value.length-1]); 
    console.log(`Number of Rows: ${rows}`);
    console.log(`Number of Columns: ${columns}`);
    gameArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    numOfCards = rows * columns;
    for(let i = 0; i < rows*columns; i++){
        const card = document.createElement("div");
        card.classList.add("image-card");
        gameArea.appendChild(card);
    }
}
