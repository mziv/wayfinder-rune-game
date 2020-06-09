import SpawnRune from "./SpawnRune.js";

let activeRunes = []

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
  activeRunes.forEach(rune => rune.removeFromDOM());
  activeRunes.splice();
}

const main = () => {
  let runeHolders = document.querySelectorAll(".rune");
  for (let i = 0; i < runeHolders.length; i++) {
    let rune = new SpawnRune(i + 1);
    rune.addToDOM(runeHolders[i], addActiveRune, removeActiveRune);
  }

  /* TODO:
    - load puzzles dynamically
  */

  let clearElem = document.querySelector("#clear");
  clearElem.addEventListener('click', removeAllActiveRunes);
};

main();
