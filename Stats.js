class Stats {
  constructor(username, difficulty = "normal") {
    this._username = username;
    this._difficulty = difficulty;
    this._timerValue = 0;
    this._actionsCounter = 0;
    this._isPlay = false;
    this._timerIntervalCount;
    const _timerValues = {
      minutes: 0,
      seconds: 0,
      stringMinutes: '',
      stringResoult: ''
    }
    this._getTimerValues = () => _timerValues;
    this._getTimerResoult = () => _timerValues.stringResoult;
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
    const values = this._getTimerValues();
    values.seconds = 0;
    values.minutes = 0;
    values.stringMinutes = '';
    this._timerValue = 0;
    timer.textContent = "00.00";
  }

  updateTimer(timer) {
    if (this.isPlay === false) return;
    const values = this._getTimerValues();
    values.seconds = (this.timerValue / 100) % 60;
    this.timerValue++;
    if ((this.timerValue / 100) % 60 === 0) values.minutes++;
    if (values.minutes > 0 && values.minutes < 10) values.stringMinutes = '0' + values.minutes + '.';
    else if (values.minutes > 10) values.stringMinutes = values.minutes + '.';
    values.stringResoult = `${values.stringMinutes}${values.seconds < 10 ? '0' + values.seconds.toFixed(2) : values.seconds.toFixed(2)}`;
    timer.textContent = values.stringResoult;
    setTimeout(this.updateTimer.bind(this, timer), 10);
  }


  updateActionsCounter() {
    if (this.isPlay === true) {
      this.actionsCounter += 1;
    }
  }

  resetActionsCounter(counter) {
    if (this.isPlay) this.changeIsPlay();
    this.actionsCounter = 0;
    counter.textContent = "0";
  }
}