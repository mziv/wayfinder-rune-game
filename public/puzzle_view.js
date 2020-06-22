import SpawnRune from "./SpawnRune.js";
import * as Constants from "./constants.js";

let DELTA = 20;

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
  console.log("left is good");
  console.log(runePos1.top);
  console.log(runePos2.top);
  if (!(withinDelta(runePos1.top, runePos2.top))) return false;
  console.log("top is good");
  return true;
}

const checkSolution = () => {
  console.log("checking solution");
  let solution = Constants.PUZZLE_SOLUTIONS[curPuzzleNum];

  let matched = new Array(solution.length).fill(false);
  for (let i = 0; i < solution.length; ++i) {
    activeRunes.forEach(rune => {
      let runePos = rune.getPosition();
      if (matches(solution[i], runePos)) matched[i] = true;
    });
  }

  console.log(matched);

  if (matched.every(elem => elem)) loadSelect(true);
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


  // setTimeout(function(){ fadeOut(); }, 0);
  // setTimeout(function(){ toggleActive("#activePuzzle", "#selectPuzzle"); }, 1000);
  // setTimeout(function(){ fadeIn(); }, 3000);
}



const loadSelect = (success) => {
  removeAllActiveRunes();

  if (success) {
    let puzzleLinks = document.querySelectorAll(".puzzleLink");
    puzzleLinks[curPuzzleNum - 1].childNodes[0].style.opacity = 0.5;
  }

  toggleActive("#selectPuzzle", "#activePuzzle");

}

// const fadeOut = () => {
//   console.log("fadeout");
//   document.querySelector("#cover").style.display = 'fixed';
//   document.querySelector("#cover").style.opacity = 1;
// }

// const fadeIn = () => {
//   document.querySelector("#cover").style.opacity = 0;
//   setTimeout(function(){ document.querySelector("#cover").style.display = 'none'; }, 1000);

// }

const main = () => {
  let runeHolders = document.querySelectorAll(".rune");
  for (let i = 0; i < runeHolders.length; i++) {
    let rune = new SpawnRune(i + 1);
    rune.addToDOM(runeHolders[i], addActiveRune, removeActiveRune, checkSolution);
  }

  // let curPuzzleElem = document.querySelector("#currentPuzzle");
  // curPuzzleNum = 1;

  /* TODO:
    - make it so you can only drop a rune into the circle
    - implement passwords for some runes
    - set up hosting so quinn can test
  */

  let clearElem = document.querySelector("#clear");
  clearElem.addEventListener('click', removeAllActiveRunes);


  /* Set up selection page */
  loadSelect();
  let puzzleLinks = document.querySelectorAll(".puzzleLink");
  for (let i = 0; i < puzzleLinks.length; i++) {

    console.log(puzzleLinks[i].childNodes[0]);
    puzzleLinks[i].addEventListener("mousedown", loadLevel);
  }




};

main();
