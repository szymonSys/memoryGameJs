class Table {
   constructor(selector = '#rank-table', rankTable = []) {
      this._htmlRankTable = document.querySelector(selector);
      this._rankTable = rankTable;
      this._htmlIsSorted = false;
      this._tableIsSorted = false;
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
      if (!(result instanceof Result)) throw new Error("element which you want add is not instance of Result")
      if (!(by === 'time' || by === 'userName' || by === 'actions'))
         throw new Error("set correct type of sorting");

      const _add = (isSorted) => {
         if (result[by] === undefined) throw new Error("set correct type of sorting");
         if (!isSorted) this.sortRankTable(table, by);
         if (table[0][by] >= result[by]) return table.unshift(result);
         if (table[table.length - 1][by] < result[by]) return table.push(result);
         for (let i = 0; i < table.length - 1; i++) {
            console.log(table[i][by], result[by], table[i + 1][by])
            if (table[i][by] < result[by] && table[i + 1][by] >= result[by])
               return table.splice(i + 1, 0, result)
         }
         return -1;
      }

      if (table === this.rankTable) _add(this.tableIsSorted);
      else if (table === this.htmlTable) _add(this.htmlIsSorted);

   }
   // ASC/DESC
   sortRankTable(tab = this.rankTable, by = 'time', order = 'ASC') {
      tab.sort((a, b) => {
         if (!(a instanceof Result && b instanceof Result))
            throw new Error("Element of Array has not require type");
         if (tab === this.rankTable) this.tableIsSorted = true;
         else if (tab === this.htmlTable) this.htmlIsSorted = true;
         return order === 'ASC' ? a[by] - b[by] : b[by] - a[by];
      });
   }

   safeToStorage() {

   }

   loadFromStorage() {

   }

   addToView(result, selectorName = '.result') {

   }

   binarSearching = (elem, tab) => {
      let searched = false;
      let left = 0,
         right = tab.length - 1,
         mid;
      while (left <= right && !searched) {
         mid = (left + right) / 2;
         if (tab[mid] === elem) searched = true;
         else
         if (tab[mid] < elem) left = mid + 1;
         else right = mid - 1;
         if (searched) return mid;
      }
      return -1;
   }
}

const table = new Table('#container', [new Result(3, 2, "Ada"), new Result(1, 6, "Adam"), new Result(52, 43, "Krystia"), new Result(44, 64, "Marta"), new Result(21, 54, "Szymon"), new Result(34, 64, "Mariusz")]);