/* A DOM component which is drag-and-droppable. */
let BUFFER_SIZE = 25;
let KEY_R_LEFT = "KeyA";
let KEY_R_RIGHT = "KeyD";

export default class DraggableRune {

  constructor(clone, dropZone, onDespawn) {
    this._pos1 = 0;
    this._pos2 = 0;
    this._pos3 = 0;
    this._pos4 = 0;
    this._rotation = 0;

    this._rune     = clone; /* Rune image element */
    this._dropZone = dropZone; /* Table store element */

    this._callbacks = { onDespawn };
    console.log(this._callbacks);

    this._onDragStart = this._onDragStart.bind(this);
    this._onDragMove  = this._onDragMove.bind(this);
    this._onDragEnd   = this._onDragEnd.bind(this);
    this._onKeyDown  = this._onKeyDown.bind(this);

    /* Add event listeners */
    this._rune.addEventListener("mousedown", this._onDragStart);
  }

  removeFromDOM() {
    this._rune.remove();
  }

  _onDragStart(event) {
    event.preventDefault();
    this._pos3 = event.clientX;
    this._pos4 = event.clientY;

    if (this._rune.style.position !== 'absolute') {
      this._rune.style.position = 'absolute';
    }

    document.onmouseup = this._onDragEnd;
    document.onmousemove = this._onDragMove;
    document.onkeydown = this._onKeyDown;
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
    document.onkeydown = null;
    let { x, y } = this._clampedPosition(event.clientX, event.clientY);
    let hoverOver = document.elementsFromPoint(x, y);
    hoverOver = hoverOver.map(x => x.id);

    if (hoverOver.includes("dropZone")) {
      this.removeFromDOM();
      this._callbacks.onDespawn(this); // tell main to remove us
    }
  }

  _onKeyDown(event) {
    event.preventDefault();
    if (event.code == KEY_R_RIGHT) {
      this._rotation += 90;
      if (this._rotation > 360) this._rotation = 0;
    } else if (event.code == KEY_R_LEFT) {
      this._rotation -= 90;
      if (this._rotation < -360) this._rotation = 0;
    }

    this._rune.style.transform = 'rotate(' + this._rotation +'deg)'
  }

  _clampedPosition(x, y) {
    x = x <= BUFFER_SIZE ? BUFFER_SIZE : x >= window.innerWidth - BUFFER_SIZE ? window.innerWidth - BUFFER_SIZE : x;
    y = y <= BUFFER_SIZE ? BUFFER_SIZE : y >= window.innerHeight - BUFFER_SIZE ? window.innerHeight - BUFFER_SIZE : y;
    return { x, y };
  }
}