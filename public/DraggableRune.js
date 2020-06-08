/* A DOM component which is drag-and-droppable. */
let BUFFER_SIZE = 25;

export default class DraggableRune {
  constructor(imageid) {
    this._id = imageid; /* Something like "rune8" */
    this._pos1 = 0;
    this._pos2 = 0;
    this._pos3 = 0;
    this._pos4 = 0;

    this._home = true;

    this._rune      = null; /* Rune image element */
    this._parent    = null; /* Parent element */
    this._tileStore = null; /* Table store element */

    this._callbacks = { };

    this._onDragStart = this._onDragStart.bind(this);
    this._onDragMove  = this._onDragMove.bind(this);
    this._onDragEnd   = this._onDragEnd.bind(this);

    this._createRune();
  }

  /* Add the rune to the DOM under parent. */
  addToDOM(parent) {
    this._parent = parent;
    this._tileStore = parent.parentElement;
    parent.appendChild(this._rune);
  }

  _createRune() {
    let rune = document.createElement("img");
    rune.src = "images/runes/" + this._id + ".png";
    rune.className = "rune";
    rune.draggable = "true";
    rune.addEventListener("mousedown", this._onDragStart);
    this._rune = rune;
  }

  _onDragStart(event) {
    event.preventDefault();
    this._pos3 = event.clientX;
    this._pos4 = event.clientY;
    this._home = false;

    if (this._rune.style.position !== 'absolute') {
      this._rune.style.position = 'absolute';
    }

    document.onmouseup = this._onDragEnd;
    document.onmousemove = this._onDragMove;
  }

  _onDragMove(event) {
    let { x, y } = this._clampedPosition(event.clientX, event.clientY);

    this._pos1 = this._pos3 - x;
    this._pos2 = this._pos4 - y;
    this._pos3 = x;
    this._pos4 = y;

    this._rune.style.top = (this._rune.offsetTop - this._pos2) + "px";
    this._rune.style.left = (this._rune.offsetLeft - this._pos1) + "px";
  }

  _onDragEnd(event) {
    document.onmouseup = null;
    document.onmousemove = null;
    let { x, y } = this._clampedPosition(event.clientX, event.clientY);
    let hoverOver = document.elementsFromPoint(x, y);
    hoverOver = hoverOver.map(x => x.id);

    if (hoverOver.includes("dropZone")) {
      this._returnHome();
    }
  }

  _returnHome() {
    this._rune.style.position = "relative";
    this._rune.style.top = 0;
    this._rune.style.left = 0;
    this._home = true;
  }

  _clampedPosition(x, y) {
    x = x <= BUFFER_SIZE ? BUFFER_SIZE : x >= window.innerWidth - BUFFER_SIZE ? window.innerWidth - BUFFER_SIZE : x;
    y = y <= BUFFER_SIZE ? BUFFER_SIZE : y >= window.innerHeight - BUFFER_SIZE ? window.innerHeight - BUFFER_SIZE : y;
    return { x, y };
  }
}
