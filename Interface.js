class Interface {
  constructor() {
    this._gameBtn = document.getElementById("start-stop");
    this._resetBtn = document.getElementById("reset");
    this._difficultySelect = document.getElementById("difficulty-select");
    this._nameInput = document.getElementById("username-input");
    this._nameBtn = document.getElementById("username-button");
    this._usename = this.nameInput.value;
    this._timer = document.getElementById("timer");
    this._actionsCounter = document.getElementById("actions");
    this._info = document.querySelector("info");
  }

  get gameBtn() {
    return this._gameBtn;
  }

  set gameBtn(gameBtn) {
    return (this._gameBtn = gameBtn);
  }

  get resetBtn() {
    return this._resetBtn;
  }

  set resetBtn(resetBtn) {
    return (this._resetBtn = resetBtn);
  }

  get difficultySelect() {
    return this._difficultySelect;
  }

  set difficultySelect(difficultySelect) {
    return (this._difficultySelect = difficultySelect);
  }

  get nameInput() {
    return this._nameInput;
  }

  set nameInput(nameInput) {
    return (this._nameInput = nameInput);
  }

  get nameBtn() {
    return this._resetBtn;
  }

  set nameBtn(nameBtn) {
    return (this._nameBtn = nameBtn);
  }

  get usename() {
    return this._usename;
  }

  set usename(usename) {
    return (this._usename = usename);
  }

  get timer() {
    return this._timer;
  }

  set timer(timer) {
    return (this._timer = timer);
  }

  get actionsCounter() {
    return this._actionsCounter;
  }

  set actionsCounter(actionsCounter) {
    return (this._actionsCounter.textContent = actionsCounter);
  }

  get info() {
    return this._info;
  }

  set info(info) {
    return (this._info = info);
  }

  changeGameBtn(type = "stop") {
    this.gameBtn.dataset.game = type;
    this.gameBtn.style.backgroundColor = type === "stop" ? "red" : "green";
    this.gameBtn.textContent = type.toUpperCase();
  }

  toggleGameBtn() {
    return this.gameBtn.dataset.game === "start" ? this.changeGameBtn() : this.changeGameBtn("start");
  }

  addGameSummary(time, actions, restartCallback, grid, timer, counter, binded, container = document.body) {
    const summaryPopup = document.createElement('div');

    summaryPopup.innerHTML = `
    <h1>Win!</h1>
    <h2>Time: ${time}</h2>
    <h3>Number of actions: ${actions}</h3>
    `;

    container.style.position = 'relative';
    summaryPopup.style.width = '600px';
    summaryPopup.style.height = '300px';
    summaryPopup.style.position = 'absolute';
    summaryPopup.style.top = '50%';
    summaryPopup.style.left = '50%';
    summaryPopup.style.transform = 'translate(-50%, -50%)';
    summaryPopup.style.color = '#fffff';
    summaryPopup.style.backgroundColor = 'green';
    summaryPopup.style.textAlign = 'center';
    summaryPopup.id = 'summary-popup';

    const btn = document.createElement('button');

    btn.textContent = 'NEW GAME';
    btn.id = 'new-game-btn';
    btn.className = 'btn';
    btn.style.backgroundColor = 'red';
    summaryPopup.appendChild(btn);
    container.appendChild(summaryPopup);

    const btnHtml = document.getElementById('new-game-btn');

    btnHtml.addEventListener('click', () => {
      restartCallback.call(binded, grid, timer, counter);
      this.removeGameSummary();

      if (this.gameBtn.dataset.game === 'stop') this.changeGameBtn('start');
    });
  }

  removeGameSummary(elem = document.getElementById('summary-popup')) {
    elem.parentNode.removeChild(elem);
  }
}