class Table {
   constructor(selector = '#results-table', rankTable = null) {
      this._htmlTable = document.querySelector(selector);
      this._rankTable = rankTable ? rankTable : this.loadFromStorage();
      this._htmlIsSorted = false;
      this._tableIsSorted = false;
      this._tableProps = {
         display: "flex",
         width: "1300px",
         flexDirection: "column",
         alignItems: "center",
         backgroundColor: "#ffffff",
         color: "#111111"
      };
      this._resultElementProps = {
         id: "rank-table-result",
         typeClass: "result-part",
         typeId: {
            number: "result-number",
            playerName: "result-name",
            time: "result-time",
            actions: "result-counter",
            timeValue: "time-value",
            difficulty: "result-difficulty"
         },
         style: {
            'display': "flex",
            'width': "1300px",
            'height': "100px",
            'flex-direction': "row",
            'flex-wrap': "nowrap",
            'justify-content': 'space-evenly',
            'align-items': 'center',
            'text-align': "center",
            'line-height': "100px",
            'border-bottom': "2px solid #999999"
         },
         childWidth: "25%",
      };
      this.safeToStorage();
      this.renderRankTable();
   }

   get htmlTable() {
      return this._htmlTable;
   }

   get rankTable() {
      return this._rankTable;
   }

   set rankTable(table) {
      return this._rankTable = table;
   }

   get htmlTable() {
      return this._htmlTable;
   }

   set htmlTable(elem) {
      return this._htmlTable = elem;
   }

   get htmlIsSorted() {
      return this._htmlIsSorted
   }

   set htmlIsSorted(bool) {
      return this._htmlIsSorted = bool;
   }

   get tableIsSorted() {
      return this._tableIsSorted
   }

   set tableIsSorted(bool) {
      return this._tableIsSorted = bool;
   }

   get resultElementProps() {
      return this._resultElementProps;
   }

   set resultElementProps(props) {
      return this._resultElementProps = props;
   }

   get tableProps() {
      return this._tableProps;
   }

   set tableProps(props) {
      return this._tableProps = props;
   }

   pushResult(result) {
      if (!(result instanceof Result)) throw new Error("element which you want add is not instance of Result")
      this.rankTable.push(result);
   }

   removeResult(result) {
      if (result instanceof Result) {
         this.rankTable.splice(this.rankTable.indexOf(result), 1)
      } else {
         throw new Error("element which you want remove is not instance of Result")
      }
   }

   addSortedResult(result, table = this.rankTable, by = 'time', order = 'ASC') {
      if (!(result instanceof Result))
         throw new Error("element which you want add is not instance of Result");

      if (!(by === 'time' || by === 'userName' || by === 'actions'))
         throw new Error("set correct type of sorting");

      this._add(result, table, this.tableIsSorted, by, order);
      this.safeToStorage();

   }

   sortTable(tab = this.rankTable, by = 'timeValue', order = 'ASC') {
      tab.sort((a, b) => {
         if (!(a instanceof Result && b instanceof Result))
            throw new Error("Element of Array has not require type");

         if (tab === this.rankTable) this.tableIsSorted = true;
         else if (tab === this.htmlTable) this.htmlIsSorted = true;

         return order === 'ASC' ? a[by] - b[by] : b[by] - a[by];
      });
   }

   safeToStorage() {
      localStorage.setItem('rankTable', JSON.stringify(this.rankTable));
   }

   loadFromStorage() {
      if (this.hasStorage()) {
         return JSON.parse(localStorage.getItem('rankTable')).map(result => new Result(result._timeValue, result._time, result._actions, result._difficulty, result._playerName));
      } else return [];
   }

   setRankTableFromStorage() {
      return this.rankTable = this.loadFromStorage();
   }

   hasStorage() {
      return localStorage.hasOwnProperty('rankTable') && JSON.parse(localStorage.getItem('rankTable')) instanceof Array ? true : false;
   }

   renderRankTable() {
      const docFragment = document.createDocumentFragment();

      if (!this.rankTable instanceof Array) throw new Error('incorrect instance of argument - it is not Array');

      for (const prop in this.tableProps) {
         this.htmlTable.style[prop] = this.tableProps[prop];
      }

      for (let i = 0; i < this.rankTable.length; i++) {

         const result = document.createElement('div');
         // result.id = `result-${i+1}`;
         result.dataset.type = this.resultElementProps.id;
         result.className = this.resultElementProps.id;

         for (const prop in this.resultElementProps.style) {
            result.style[prop] = this.resultElementProps.style[prop];
         }

         // result.dataset.timeValue = result.timeValue;

         for (const id in this.resultElementProps.typeId) {
            result.dataset[id] = id === 'number' ? i + 1 : this.rankTable[i][id];
            if (id === 'timeValue') continue;
            result.innerHTML += `<div id="${this.resultElementProps.typeId[id]}" style = "${this.resultElementProps.childWidth}" class="${this.resultElementProps.typeClass}">
               <span>${id === 'number' ? i+1 : this.rankTable[i][id]}</span>
            </div>`;
         }

         docFragment.appendChild(result);
      }
      this.htmlTable.appendChild(docFragment);
   }

   addResultToView(result, by = 'timeValue') {

      function addNewNode(i) {
         const newNode = document.createElement('div');

         newNode.dataset.type = this.resultElementProps.id;
         newNode.className = this.resultElementProps.id;

         for (const prop in this.resultElementProps.style) {
            newNode.style[prop] = this.resultElementProps.style[prop];
         }

         newNode.dataset.timeValue = result.timeValue;

         for (const id in this.resultElementProps.typeId) {
            if (id === "timeValue") continue;
            newNode.dataset[id] = id === 'number' ? +i : result[id];
            newNode.innerHTML += `<div id="${this.resultElementProps.typeId[id]}" style="${this.resultElementProps.childWidth}" class="${this.resultElementProps.typeClass}">
                  <span>${id === 'number' ? +i: result[id]}</span>
               </div>`;
         }

         return newNode
      }

      if (!result instanceof Result)
         throw new Error('parameter must be instance of Result');

      let index = 0;

      if (!this.htmlTable.childNodes.length)
         this.htmlTable.appendChild(addNewNode.call(this, 0));
      else {
         for (const node of [...this.htmlTable.childNodes]) {
            index++;

            if (!node.previousSibling && result.timeValue <= node.dataset.timeValue) {
               this.htmlTable.insertBefore(addNewNode.call(this, node.dataset.number), node);

               break;

            } else if (!node.nextSibling && result.timeValue >= node.dataset.timeValue) {
               this.htmlTable.appendChild(addNewNode.call(this, node.dataset.number));

               break;

            } else if (result.timeValue > node.dataset.timeValue && result.timeValue <= node.nextSibling.dataset.timeValue) {
               this.htmlTable.insertBefore(addNewNode.call(this, node.dataset.number), node.nextSibling);

               break;
            }
         }
      }

      const htmlNodes = [...this.htmlTable.childNodes];

      for (let i = index; i <= htmlNodes.length - 1; i++) {
         htmlNodes[i].dataset.number++;
         htmlNodes[i].firstChild.innerHTML = `<span>${htmlNodes[i].dataset.number}</span>`;
      }
   }

   binarSearching = (elem, tab) => {
      let searched = false,
         left = 0,
         right = tab.length - 1,
         mid;

      while (left <= right && !searched) {
         mid = (left + right) / 2;

         if (tab[mid] === elem) searched = true;
         else if (tab[mid] < elem) left = mid + 1;
         else right = mid - 1;

         if (searched) return mid;
      }

      return -1;
   }

   _add = (result, table, isSorted, by = 'timeValue', order = 'ASC') => {
      if (result[by] === undefined)
         throw new Error("set correct type of sorting");

      if (!this.rankTable.length) {
         this.pushResult(result);
         return;
      };

      if (!isSorted) this.sortTable(table, by, order);

      if (table[0][by] >= result[by]) return table.unshift(result);

      if (table[table.length - 1][by] < result[by]) return table.push(result);

      for (let i = 0; i < table.length - 1; i++) {
         if (table[i][by] < result[by] && table[i + 1][by] >= result[by])
            return table.splice(i + 1, 0, result);
      }

      return -1;
   }
}