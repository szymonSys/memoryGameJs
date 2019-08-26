class Stats {
  constructor(username, difficulty = "normal") {
    this._username = username;
    this._difficulty = difficulty;
    this._timerValue = 0;
    this._actionsCounter = 0;
    this._isPlay = false;
    this._timerIntervalCount;
  }

  get username() {
    return this._username;
  }

  set username(username) {
    return (this._username = username);
  }

  get difficulty() {
    return this._difficulty;
  }

  set difficulty(difficulty) {
    return (this._difficulty = difficulty);
  }

  get timerValue() {
    return this._timerValue;
  }

  set timerValue(timerValue) {
    if (typeof timerValue !== "number")
      throw new Error("parameter mus be number");
    this._timerValue += 1;
  }

  get actionsCounter() {
    return this._actionsCounter;
  }

  set actionsCounter(actionsCounter) {
    return (this._actionsCounter = actionsCounter);
  }

  get isPlay() {
    return this._isPlay;
  }

  changeIsPlay() {
    this._isPlay = !this._isPlay;
  }

  startTimer(timer) {
    if (!this.isPlay) this.changeIsPlay();
    return this.updateTimer(timer);
  }

  stopTimer() {
    if (this.isPlay) this.changeIsPlay();
  }

  resetTimer(timer) {
    if (this.isPlay) this.changeIsPlay();
    this._timerValue = 0;
    timer.textContent = "0.00";
  }

  updateTimer(timer) {
    if (this.isPlay === false) return;
    this._timerValue += 1;
    timer.textContent = this.timerValue;
    setTimeout(this.updateTimer.bind(this, timer), 1000);
  }

  updateActionsCounter() {
    if (this.isPlay === true) this.actionsCounter += 1;
  }
}