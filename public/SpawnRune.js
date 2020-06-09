/* A DOM component which spawns draggable runes from a template. */
import DraggableRune from "./DraggableRune.js";

let RUNE_PATH = "images/runes/rune black ";

export default class SpawnRune {
  constructor(imageid) {
    this._id = imageid; /* Something like 8 */

    this._rune      = null; /* Rune image element */
    this._parent    = null; /* Parent element */
    this._tileStore = null; /* Table store element */

    this._callbacks = { onSpawn: null, onDespawn: null };

    this._onDragStart = this._onDragStart.bind(this);

    this._createRune();
  }

  /* Add the rune to the DOM under parent. */
  addToDOM(parent, onSpawn, onDespawn) {
    this._parent = parent;
    this._tileStore = parent.parentElement;
    parent.appendChild(this._rune);
    this._callbacks = { onSpawn, onDespawn };
  }

  _createRune() {
    let rune = document.createElement("img");
    rune.src = RUNE_PATH + this._id + ".png";
    rune.className = "rune";
    rune.draggable = "true";
    rune.addEventListener("mousedown", this._onDragStart);
    this._rune = rune;
  }

  _cloneRune() {
    let clone = this._rune.cloneNode(true);
    this._parent.appendChild(clone);
    return clone;
  }

  _onDragStart(event) {
    event.preventDefault();

    let clone = this._cloneRune();
    let drag = new DraggableRune(clone, this._tileStore, this._callbacks.onDespawn);
    drag._onDragStart(event);
    this._callbacks.onSpawn(drag);
  }


}
