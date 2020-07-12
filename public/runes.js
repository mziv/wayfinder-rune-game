import SpawnRune from "./SpawnRune.js";
import * as Constants from "./constants.js";

let DELTA = 40;
let COLOR_DELAY = 700; /* 1000 = one second */
/* Fantastic color to filter site: https://codepen.io/sosuke/pen/Pjoqqp */
let RED = "invert(61%) sepia(65%) saturate(5841%) hue-rotate(16deg) brightness(95%) contrast(97%)";
let GREEN = "invert(23%) sepia(70%) saturate(644%) hue-rotate(81deg) brightness(102%) contrast(100%)";
// let GOLD = "invert(54%) sepia(82%) saturate(2125%) hue-rotate(351deg) brightness(101%) contrast(104%)";
let BLUE = "invert(70%) sepia(62%) saturate(2316%) hue-rotate(207deg) brightness(107%) contrast(101%)";

let puzzlePath = "images/puzzles/";
let activeRunes = [];
let completedPuzzles = [];
let curPuzzleNum;

/* Lol definitely should have taken a different strategy here */
let gate2_unlocked = false;
let gate3_unlocked = false;
let gate4_unlocked = false;

const addActiveRune = (rune) => {
  activeRunes.push(rune);
}

const removeActiveRune = (rune) => {
  let index = activeRunes.indexOf(rune);
  activeRunes.splice(index, 1);
}

const removeAllActiveRunes = () => {
  // console.log(curPuzzleNum);
  // let runePositions = "["
  // activeRunes.forEach(rune => runePositions += JSON.stringify(rune.getPosition()) + ",");
  // console.log(runePositions + "]");
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

const checkProgress = () => {
  if (completedPuzzles.length === 1 && !(gate2_unlocked)) {
    document.querySelector("#gateForm2").style.display = "block";
    console.log("unlocked form 2");
  } 

  if (completedPuzzles.length === 4 && !(gate3_unlocked)) {
    document.querySelector("#gateForm3").style.display = "block";
    console.log("unlocked form 3");
  }

  if (completedPuzzles.length === 5 && !(gate4_unlocked)) {
    document.querySelector("#gateForm4").style.display = "block";
    console.log("unlocked form 4");
  }
}

const checkSolution = () => {
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
    completedPuzzles.push(curPuzzleNum);
    checkProgress();
    activateColor(GREEN, 4*COLOR_DELAY);
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

  // If we've already solved this puzzle, load the video instead.
  if (completedPuzzles.includes(curPuzzleNum)) {
    loadPlayer(curPuzzleNum);
  } else {
    console.log("Loading level: " + curPuzzleNum);
    document.querySelector("#currentPuzzle").src = puzzlePath + curPuzzleNum + ".png";
    toggleActive("#activePuzzle", "#selectPuzzle");
  }
}

const loadSelect = (success) => {
  if (success) {
    /* In this case, we just successfully completed a puzzle, so we should wait a bit before going. */
    let puzzleLinks = document.querySelectorAll(".puzzleLink");
    for (let i = 0; i < puzzleLinks.length; i++) {
      if (puzzleLinks[i].dataset.puzzleId === curPuzzleNum) {
        puzzleLinks[i].childNodes[0].style.filter = BLUE;
        console.log("Found a child to turn blue");
      }
    }
    // puzzleLinks[curPuzzleNum - 1].childNodes[0].style.filter = BLUE;

    setTimeout(function() {
      removeAllActiveRunes(); 
      loadPlayer(curPuzzleNum);
    }, 3*COLOR_DELAY);
  } else {
    /* Otherwise, this is the first time we're loading select, and we should load immediately. */
    toggleActive("#selectPuzzle", "#activePuzzle");
  }
}

const loadPlayer = (vidNum) => {
  document.querySelector("#selectPuzzle").style.display = "none";
  document.querySelector("#activePuzzle").style.display = "none";
  document.querySelector("#background").style.display = "none";

  document.querySelector("#player").src = "videos/" + vidNum + ".mp4";
  document.querySelector("#player").style.display = "block";
  document.querySelector("#back").style.display = "block";
  
}

const exitPlayer = () => {
  document.querySelector("#player").style.display = "none";
  document.querySelector("#back").style.display = "none";
  document.querySelector("#background").style.display = "block";
  // We'll always want to return from the player into level select.
  toggleActive("#selectPuzzle", "#activePuzzle"); 
}

const checkGateForm = (event) => {
  event.preventDefault();
  let value = event.target.querySelector("input").value.toLowerCase();

  if (!(gate2_unlocked)) {
    if (value !== Constants.PASS_2) return;
    gate2_unlocked = true;
    event.target.remove();
    document.querySelector("#level2").style.display = "block";
    return;
  } else if (!(gate3_unlocked)) {
    if (value !== Constants.PASS_3) return;
    gate3_unlocked = true;
    event.target.remove();
    document.querySelector("#level3").style.display = "block";
    return;
  } else if (!(gate4_unlocked)) {
    if (value !== Constants.PASS_4) return;
    gate4_unlocked = true;
    event.target.remove();
    document.querySelector("#level4").style.display = "block";
    return;
  }
}

const main = () => {
  let runeHolders = document.querySelectorAll(".rune");
  for (let i = 0; i < runeHolders.length; i++) {
    let rune = new SpawnRune(i + 1);
    rune.addToDOM(runeHolders[i], addActiveRune, removeActiveRune, checkSolution);
  }

  let clearElem = document.querySelector("#clear");
  clearElem.addEventListener('click', removeAllActiveRunes);

  let backElem = document.querySelector("#back");
  backElem.addEventListener('click', exitPlayer);


  /* Set up selection page */
  let puzzleLinks = document.querySelectorAll(".puzzleLink");
  for (let i = 0; i < puzzleLinks.length; i++) {
    puzzleLinks[i].addEventListener("mousedown", loadLevel);
  }

  /* Set up password protection */
  let gateForm = document.querySelector("#gateForm2");
  gateForm.onsubmit = checkGateForm;
  gateForm = document.querySelector("#gateForm3");
  gateForm.onsubmit = checkGateForm;
  gateForm = document.querySelector("#gateForm4");
  gateForm.onsubmit = checkGateForm;

  loadSelect();
};

main();
