import SpawnRune from "./SpawnRune.js";
import * as Constants from "./constants.js";

let DELTA = 20;
let COLOR_DELAY = 700; /* 1000 = one second */
/* Fantastic color to filter site: https://codepen.io/sosuke/pen/Pjoqqp */
let RED = "invert(61%) sepia(65%) saturate(5841%) hue-rotate(16deg) brightness(95%) contrast(97%)";
let GREEN = "invert(23%) sepia(70%) saturate(644%) hue-rotate(81deg) brightness(102%) contrast(100%)";
// let GOLD = "invert(54%) sepia(82%) saturate(2125%) hue-rotate(351deg) brightness(101%) contrast(104%)";
let BLUE = "invert(70%) sepia(62%) saturate(2316%) hue-rotate(207deg) brightness(107%) contrast(101%)";

let puzzlePath = "images/puzzles/";
let activeRunes = [];
let curPuzzleNum;

let backgroundQuery;

const addActiveRune = (rune) => {
  activeRunes.push(rune);
}

const removeActiveRune = (rune) => {
  let index = activeRunes.indexOf(rune);
  activeRunes.splice(index, 1);
}

const removeAllActiveRunes = () => {
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
    /* SEND A VOTE FOR THIS PUZZLE */ 
    sendVote();   
    activateColor(GREEN, 4*COLOR_DELAY);
    loadSelect(true);
  } else {
    activateColor(RED, COLOR_DELAY);
  }
}

const sendVote = async () => {
  let method = "POST";
  let opts = { method };
  let body = {};
  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }

  let kw = curPuzzleNum.split(" ")[0];
  let url = "/api/votes/" + kw + "/add";
  let res = await fetch(url, opts);
  let json = await res.json();
}

const toggleActive = (turnOn, turnOff) => {
  document.querySelector(turnOn).style.display = 'block';
  document.querySelector(turnOff).style.display = 'none';
}

const loadLevel = (event) => {
  curPuzzleNum = event.target.dataset.puzzleId;

  // If we've already solved this puzzle, load the video instead.
  console.log("Loading level: " + curPuzzleNum);
  document.querySelector("#currentPuzzle").src = puzzlePath + curPuzzleNum + ".png";
  toggleActive("#activePuzzle", "#selectPuzzle");
}

const loadSelect = (success) => {
  if (success) {
    /* Just turn everything off + wait once we're finished*/
    setTimeout(function() {
      removeAllActiveRunes(); 
      document.querySelector("#activePuzzle").style.display = 'none';
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
  document.querySelector("#player").play();
}

const checkVotingComplete = async () => {
  let method = "GET";
  let opts = { method };
  let res = await fetch("/api/status/done", opts);
  let json = await res.json();
  if (json.votingComplete) {
    console.log("Voting is complete!");
    console.log(json.winner);
    clearInterval(backgroundQuery);

    /* LOAD WINNING VIDEO */
    loadPlayer(json.winner);
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

  /* Set up selection page */
  let puzzleLinks = document.querySelectorAll(".puzzleLink");
  for (let i = 0; i < puzzleLinks.length; i++) {
    puzzleLinks[i].addEventListener("mousedown", loadLevel);
  }

  loadSelect();

  backgroundQuery = setInterval(checkVotingComplete, 1000);
  checkVotingComplete();
};

main();
