class Grid {
  constructor(root) {
    this._root = document.getElementById(root);
    this._squares = [];
  }

  get root() {
    return this._root;
  }

  set root(root) {
    return (this._root = root);
  }

  get squares() {
    return this._squares;
  }

  renderSquare(wrapper, square, index) {
    const elem = document.createElement("div");

    elem.id = `sq-${index + 1}`;
    elem.classList.add("game-square");
    elem.dataset.value = square.value;
    elem.dataset.order = square.order;
    elem.dataset.isActive = square.isActive.toString();
    elem.dataset.isMatched = square.isMatched.toString();
    elem.style.backgroundColor = square.color;
    // elem.textContent = square.value;

    wrapper.appendChild(elem);
  }

  render(squares) {
    this.root.innerHTML = "";

    const wrapper = document.createDocumentFragment();

    squares.forEach((square, index) => {
      this.renderSquare(wrapper, square, index);
    });

    this.root.appendChild(wrapper);
  }
}