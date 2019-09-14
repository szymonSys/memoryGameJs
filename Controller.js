class Controller {
   constructor(grid = new Grid("grid"), inter = new Interface()) {
      this._interface = inter;
      this._game = new Game("unknown", "normal");
      this._grid = grid;
      this._table = new Table();
      this.game.initGame(this.grid, this.interface.timer);

      this.addListener(this.interface.difficultySelect, () => {
         this.game.changeDifficulty(this.interface.difficultySelect.value);
         this.game.initGame(this.grid, this.interface.timer, this.interface.actionsCounter);
         this.interface.changeGameBtn("start");

         if (document.getElementById('summary-popup')) this.interface.removeGameSummary();
      }, "change");

      this.addListener(this.interface.nameBtn, () => {

         if (this.game.gameState !== 'ongoing' && this.game.gameState !== 'failed') {
            if (!this.interface.nameInput.value) {
               this.interface.nameInput.style.backgroundColor = 'red';
               setTimeout(() => this.interface.nameInput.style.backgroundColor = '#ffffff', 1000);
            } else {
               this.game.stats.username = this.interface.nameInput.value;
            }
         }
      });

      this.addListener(this.interface.gameBtn, () => {
         if (this.game.gameState === "init" || this.game.gameState === "stopped")
            this.game.startGame(this.grid, this.interface.timer);
         else if (this.game.gameState === "ongoing")
            this.game.stopGame(this.grid);

         this.interface.toggleGameBtn();

         if (document.getElementById('summary-popup')) this.interface.removeGameSummary();

         this.addListener(this.grid.root, function (e) {
            if ((this.game.gameState === "ongoing" || this.game.gameState === 'win') && e.target.className === "game-square") {
               this.interface.actionsCounter = this.game.stats.actionsCounter;
            }

            if (this.game.gameState === 'win') {
               this.game.stopGame(this.grid);

               const result = new Result(
                  this.game.stats._getTimerResoult(),
                  this.game.stats.actionsCounter,
                  this.game.stats.difficulty,
                  this.game.stats.username
               );

               this.table.addSortedResult(result);
               this.table.addResultToView(result);

               this.interface.addGameSummary(
                  this.game.stats._getTimerResoult(),
                  this.game.stats.actionsCounter,
                  this.game.initGame,
                  this.grid,
                  this.interface.timer,
                  this.interface.actionsCounter,
                  this.game,
                  document.getElementById('container'))
            }
         })
      });

      this.addListener(this.interface.resetBtn, () => {
         this.game.initGame(this.grid, this.interface.timer, this.interface.actionsCounter);
         this.interface.changeGameBtn("start");

         if (document.getElementById('summary-popup')) this.interface.removeGameSummary();
      });
   }

   get interface() {
      return this._interface;
   }

   set interface(inter) {
      return this._interface = inter;
   }

   get game() {
      return this._game;
   }

   set game(game) {
      return this._game = game;
   }

   get grid() {
      return this._grid;
   }

   set grid(grid) {
      return this._grid = grid;
   }

   get table() {
      return this._table;
   }

   set table(table) {
      return this._table = table;
   }

   addListener(elem, callback, eventType = "click", binded = this) {
      elem.addEventListener(eventType, callback.bind(binded));
   }
}