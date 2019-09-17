class Result {
   constructor(timeValue = null, time = null, actions = null, difficulty = null, playerName = '') {
      if (!(time || actions))
         throw new Error("You have to set time and actions properties");

      this._time = time;
      this._actions = actions;
      this._playerName = playerName ? playerName : 'anonim';
      this._timeValue = timeValue;
      this._difficulty = difficulty;
   }

   get time() {
      return this._time;
   }

   set time(time) {
      if (!time)
         throw new Error("You have to set time property");

      return this._time = time;
   }

   get actions() {
      return this._actions;
   }

   set actions(actions) {
      if (!actions)
         throw new Error("You have to set actions property");

      return this._actions = actions;
   }

   get playerName() {
      return this._playerName;
   }

   set playerName(playerName) {
      return this._playerName = playerName ? playerName : 'anonim';
   }

   get difficulty() {
      return this._difficulty;
   }

   set difficulty(difficulty) {
      if (!difficulty)
         throw new Error("You have to set difficulty property");

      return this._difficulty = difficulty;
   }

   get timeValue() {
      return this._timeValue
   }

   set timeValue(value) {
      return this._timeValue = value;
   }
}