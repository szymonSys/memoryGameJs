class Square {
  constructor(value, order, partner = null) {
    const _COLORS = {
      passive: "#CCCCCC",
      active: "#1ED760",
      matched: "#4169E1",
      failed: "#ff0000"
    };

    this.getPassiveColor = () => _COLORS.passive;
    this.getActiveColor = () => _COLORS.active;
    this.getMatchedColor = () => _COLORS.matched;
    this.getFailedColor = () => _COLORS.failed;

    this._value = value;
    this._order = order;
    this._color = this.getPassiveColor();
    this._isActive = false;
    this._isMatched = false;
    this._partner = partner;
    if (partner instanceof Square) partner.partner = this;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (value !== this.partner.value) this.partner.value = value;
    return (this._value = value);
  }

  get order() {
    return this._order;
  }

  set order(order) {
    return (this._order = order);
  }

  get color() {
    return this._color;
  }

  set color(color) {
    return (this._color = color);
  }

  get partner() {
    return this._partner;
  }

  set partner(partner) {
    if (this.value === partner.value) return (this._partner = partner);
  }

  get isActive() {
    return this._isActive;
  }

  get isMatched() {
    return this._isMatched;
  }

  changeActivity() {
    this.color = !this.isActive ? this.getActiveColor() : this.getPassiveColor();
    return (this._isActive = !this._isActive);
  }

  checkMatching(square) {
    if (square.isActive) {
      square.changeActivity();
      return (this.value === square.value && this.order !== square.order) ? true : false;
    }
  }

  makeMatching(square) {
    if (this.checkMatching(square)) {
      this._isMatched = true;
      this.color = this.getMatchedColor();
      this.partner._isMatched = true;
      this.partner.color = this.getMatchedColor();
      return true;
    } else {
      this.color = this.getFailedColor();
      square.color = this.getFailedColor();
      setTimeout(() => {
        this.color = this.getPassiveColor();
        square.color = this.getPassiveColor();
      }, 1000)
      return false;
    }
  }
}