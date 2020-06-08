import DraggableRune from "./DraggableRune.js";
const NRUNES = 12

const main = () => {
  let runeHolders = document.querySelectorAll(".rune");
  for (let i = 0; i < runeHolders.length; i++) {
    let runeName = "rune" + i;
    let rune = new DraggableRune(runeName);
    rune.addToDOM(runeHolders[i]);
  }
};

main();
