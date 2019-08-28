// TODO(?): bazowa klasa Game z podstawowymi metodami i właściwościami, z której dziedziczy klasa MemoryGame i rozszerza się o metody bardziej specyficzne dla tej konkretnej gry !!!
class Game {
   constructor(username, difficulty) {
      this._makeAvailableValues = (from, to) => {
         const valuesTab = []
         let currentCodeValue = from.charCodeAt();
         const toCodeValue = to.charCodeAt();
         for (currentCodeValue; currentCodeValue <= toCodeValue; currentCodeValue++) {
            valuesTab.push(currentCodeValue);
         }
         return [...String.fromCharCode(...valuesTab)];
      }
      const _availableValues = this._makeAvailableValues("A", "Z");
      this.getAvailableValues = () => _availableValues;

      this._stats = new Stats(username, difficulty);
      this._numberOfSquares = this._generateNumberOfSquares(difficulty);
      this._numberOfMatchedSqueres = 0;
      this._squares = [];
      this._gameState = "inactive";
   }

   get stats() {
      return this._stats;
   }

   set stats(stats) {
      return this._stats = stats;
   }

   get numberOfSquares() {
      return this._numberOfSquares;
   }

   set numberOfSquares(numberOfSquares) {
      return this._numberOfSquares = numberOfSquares;
   }

   get numberOfMatchedSqueres() {
      return this._numberOfMatchedSqueres;
   }

   get squares() {
      return this._squares;
   }

   get gameState() {
      return this._gameState;
   }

   set gameState(state) {
      if (
         typeof state !== "string" || (
            state !== "ongoing" &&
            state !== "stopped" &&
            state !== "init" &&
            state !== "inactive" &&
            state !== "win")
      )
         throw new Error(
            'incorect value of parameter'
         );
      return (this._gameState = state);
   }

   _generateNumberOfSquares(difficulty) {
      if (difficulty === "easy") return this.numberOfSquares = 24;
      if (difficulty === "normal") return this.numberOfSquares = 36;
      if (difficulty === "hard") return this.numberOfSquares = 48;
      this.stats.difficulty = "normal";
      return this.numberOfSquares = 36;
   }

   _getRandomValue(values) {
      if (!values.length || !(this.getAvailableValues() instanceof Array)) throw new Error("wrong type of available values");
      return values[Math.floor(Math.random() * values.length)];
   }

   _removeAscribedValue(values, index) {
      values.splice(index, 1);
   }

   _makeAvailablePositions() {
      const availablePositions = []
      let currentIndex = 0;
      while (currentIndex < this.numberOfSquares) {
         availablePositions.push(currentIndex);
         currentIndex++;
      }
      if (currentIndex !== availablePositions.length || availablePositions.length !== this.numberOfSquares) throw new Error('Incorrect initialization of Available Positions')
      return availablePositions;
   }

   _getRandom(available) {
      if (!available.length || !(available instanceof Array)) throw new Error("wrong type of available");
      return available[Math.floor(Math.random() * available.length)];
   }

   _removeAscribed(tab, index) {
      tab.splice(index, 1);
   }

   _sortSquaresByOrder(tab) {
      tab.sort((a, b) => {
         if (!(a instanceof Square && b instanceof Square)) throw new Error('Element of Array has not require type');
         return a.order - b.order;
      });
   }

   changeDifficulty(difficulty) {
      this._numberOfSquares = this._generateNumberOfSquares(difficulty);
      this.stats.difficulty = difficulty;
   }

   getSquare(index) {
      return this.squares[index];
   }

   setSquare(index, newSquare) {
      if (!(newSquare instanceof Square)) throw new Error('new square must be instance of Square class!');
      return this.squares[index] = newSquare;
   }

   addSquare(newSquare) {
      if (!(newSquare instanceof Square)) throw new Error('new square must be instance of Square class!');
      this.squares.push(newSquare);
      return newSquare;
   }

   removeSquare(index) {
      this.squares.splice(index, 1);
   }

   makeMatch() {
      this._numberOfMatchedSqueres += 2;
      if (this.checkIfWin()) this.gameState = 'win';
   }

   resetMatches() {
      return this._numberOfMatchedSqueres = 0;
   }

   initRandomizedSquares() {
      if (!this.getAvailableValues() || !(this.getAvailableValues() instanceof Array)) throw new Error("wrong type of available values");

      if (this.squares.length) this.squares.length = 0;

      const values = [...this.getAvailableValues()];
      const availablePositions = this._makeAvailablePositions();

      while (this.squares.length < this.numberOfSquares) {
         const randomValue = this._getRandom(values);
         let randomPosition = this._getRandom(availablePositions);
         const sqr = this.addSquare(new Square(randomValue, randomPosition));
         this._removeAscribed(availablePositions, availablePositions.indexOf(randomPosition));
         randomPosition = this._getRandom(availablePositions);
         this.addSquare(new Square(randomValue, randomPosition, sqr));
         this._removeAscribed(values, values.indexOf(randomValue));
         this._removeAscribed(availablePositions, availablePositions.indexOf(randomPosition));
      }

      this._sortSquaresByOrder(this.squares);

      return this.squares;
   }

   _mainGameAction() {
      const prev = {
         active: null,
         activeSquare: null
      };
      return e => {
         if (!this.getSquare(e.target.dataset.order).isMatched) {
            this.stats.updateActionsCounter();
            if (prev.active === null) {
               prev.active = e.target;
               prev.activeSquare = this.squares[prev.active.dataset.order];
               prev.activeSquare.changeActivity();
               prev.active.style.backgroundColor = prev.activeSquare.color;
               return;
            }
            const active = e.target;
            const activeSquere = this.getSquare(active.dataset.order);

            if (activeSquere.makeMatching(prev.activeSquare)) this.makeMatch();
            active.style.backgroundColor = activeSquere.color;
            prev.active.style.backgroundColor = activeSquere.color;
            prev.active = null;
            prev.activeSquare = null;
         }
      };
   }

   _gameEventHandler = this._mainGameAction();

   initGame(grid, timer, counter = null) {
      console.log(this)
      if (this.gameState === "ongoing" || this.gameState === "stopped") this.resetGame(grid, timer, counter)
      this.gameState = "init";
      grid.root.className = `game-grid ${this.stats.difficulty.toString()}`;
      grid.render(this.initRandomizedSquares());

   }

   startGame(grid, timer) {
      if (!(this.gameState === "init" || this.gameState === "stopped")) return;
      this.gameState = "ongoing";
      grid.root.addEventListener('click', this._gameEventHandler);
      this.stats.startTimer(timer);
   }

   resetGame(grid, timer, counter) {
      this.gameState = "inactive";
      grid.root.removeEventListener('click', this._gameEventHandler);
      this.stats.resetTimer(timer);
      this.stats.resetActionsCounter(counter);
      this.resetMatches();
   }

   stopGame(grid) {
      this.gameState = "stopped";
      grid.root.removeEventListener('click', this._gameEventHandler);
      this.stats.stopTimer();
   }

   checkIfWin() {
      // return this.numberOfMatchedSqueres === 2 ? true : false;
      return this.numberOfMatchedSqueres === this.numberOfSquares ? true : false;
   }
}

// const game = new Game("Szymon", "hard");
// const grid = new Grid("grid");
// game.initGame(grid);
// game.startGame(grid);