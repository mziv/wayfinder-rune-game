import SpawnRune from "./SpawnRune.js";
import * as Constants from "./constants.js";

let DELTA = 20;
let COLOR_DELAY = 700; /* 1000 = one second */
/* Fantastic color to filter site: https://codepen.io/sosuke/pen/Pjoqqp */
let RED = "invert(61%) sepia(65%) saturate(5841%) hue-rotate(16deg) brightness(95%) contrast(97%)";
let GREEN = "invert(23%) sepia(70%) saturate(644%) hue-rotate(81deg) brightness(102%) contrast(100%)";

let puzzlePath = "images/puzzles/";
let activeRunes = [];
let curPuzzleNum;

const addActiveRune = (rune) => {
  activeRunes.push(rune);
  console.log(activeRunes);
}

const removeActiveRune = (rune) => {
  let index = activeRunes.indexOf(rune);
  activeRunes.splice(index, 1);
  console.log(activeRunes);
}

const removeAllActiveRunes = () => {
  let runePositions = "["
  activeRunes.forEach(rune => runePositions += JSON.stringify(rune.getPosition()) + ",");
  console.log(runePositions + "]");
  activeRunes.forEach(rune => rune.removeFromDOM());
  activeRunes = [];
}

const withinDelta = (x1, x2) => {
  return Math.abs(x1 - x2) < DELTA;
}

const matches = (runePos1, runePos2) => {
  if (runePos1.id !== runePos2.id) return false;
  if (runePos1.rot !== runePos2.rot) return false;
  if (!(withinDelta(runePos1.left, runePos2.left))) return false;
  if (!(withinDelta(runePos1.top, runePos2.top))) return false;
  return true;
}

const activateColor = (color, delay) => {
  let circle = document.querySelector("#activationCircle");
  circle.style["filter"] = color;
  setTimeout(function(){ circle.style.filter = ""; }, delay);
}

const checkSolution = () => {
  console.log("checking solution");
  let solution = Constants.PUZZLE_SOLUTIONS[curPuzzleNum];

  if (solution.length !== activeRunes.length) return;

  let matched = new Array(solution.length).fill(false);
  for (let i = 0; i < solution.length; ++i) {
    activeRunes.forEach(rune => {
      let runePos = rune.getPosition();
      if (matches(solution[i], runePos)) matched[i] = true;
    });
  }

  if (matched.every(elem => elem)) {
    activateColor(GREEN, 3*COLOR_DELAY);
    loadSelect(true);
  } else {
    activateColor(RED, COLOR_DELAY);
  }
}

const toggleActive = (turnOn, turnOff) => {
  document.querySelector(turnOn).style.display = 'block';
  document.querySelector(turnOff).style.display = 'none';
}

const loadLevel = (event) => {
  curPuzzleNum = event.target.dataset.puzzleId;
  console.log("Loading level: " + curPuzzleNum);
  document.querySelector("#currentPuzzle").src = puzzlePath + curPuzzleNum + ".png";
  toggleActive("#activePuzzle", "#selectPuzzle");
}

const loadSelect = (success) => {
  if (success) {
    /* In this case, we just successfully completed a puzzle, so we should wait a bit before going. */
    let puzzleLinks = document.querySelectorAll(".puzzleLink");
    puzzleLinks[curPuzzleNum - 1].childNodes[0].style.opacity = 0.5;

    setTimeout(function(){ 
      toggleActive("#selectPuzzle", "#activePuzzle"); 
      removeAllActiveRunes(); 
    }, 2*COLOR_DELAY);
  } else {
    /* Otherwise, this is the first time we're loading select, and we should load immediately. */
    toggleActive("#selectPuzzle", "#activePuzzle");
  }
}

const main = () => {
  let runeHolders = document.querySelectorAll(".rune");
  for (let i = 0; i < runeHolders.length; i++) {
    let rune = new SpawnRune(i + 1);
    rune.addToDOM(runeHolders[i], addActiveRune, removeActiveRune, checkSolution);
  }

  /* TODO:
    - make it so you can only drop a rune into the circle
    - implement passwords for some runes
  */

  let clearElem = document.querySelector("#clear");
  clearElem.addEventListener('click', removeAllActiveRunes);


  /* Set up selection page */
  let puzzleLinks = document.querySelectorAll(".puzzleLink");
  for (let i = 0; i < puzzleLinks.length; i++) {
    puzzleLinks[i].addEventListener("mousedown", loadLevel);
  }

  loadSelect();
};

main();
