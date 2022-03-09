class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    if (puzzleString.match(/[^0-9.]/g)) {
      return { error: 'Invalid characters in puzzle' };
    }
    // Logic handles a puzzle string that is not 81 characters in length
    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    const result = this.solve(puzzleString);
    if (result.error) {
      return { error: 'Puzzle cannot be solved' };
    }
    return { message: 'valid' };
  }

  check(puzzleString, row, column, value) {
    if (!puzzleString || value === '') {
      return { error: 'Required field(s) missing' };
    }
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    if (puzzleString.match(/[^0-9.]/g)) {
      return { error: 'Invalid characters in puzzle' };
    }
    // Logic handles a puzzle string that is not 81 characters in length
    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (row < 0 || row > 8 || column < 0 || column > 8 || Number.isNaN(row) || Number.isNaN(column)) {
      return { error: 'Invalid coordinate' }
    }
    if (value < 1 || value > 9 || Number.isNaN(Number.parseInt(value))) {
      return { error: 'Invalid value' };
    }
  }

  checkRowPlacement(puzzleString, row, value) {
    const startingIndex = 9 * row;
    const finalIndex = 9 * row + 9;
    const myRow = puzzleString.slice(startingIndex, finalIndex);
    if (myRow.indexOf(value) !== -1) {
      return false;
    } else {
      return true;
    }
  }

  checkColPlacement(puzzleString, column, value) {
    const myColumn = [];
    for (let i = 0; i < 81; i += 9) {
      myColumn.push(puzzleString[column + i]);
    }
    if (myColumn.join().indexOf(value) !== -1) {
      return false;
    } else {
      return true;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let startingIndex = 0;
    if (row >= 0 && row <= 2 && column >= 0 && column <= 2) {
      startingIndex = 0;
    } else if (row >= 3 && row <= 5 && column >= 0 && column <= 2) {
      startingIndex = 27;
    } else if (row >= 6 && row <= 8 && column >= 0 && column <= 2) {
      startingIndex = 54;
    } else if (row >= 0 && row <= 2 && column >= 3 && column <= 5) {
      startingIndex = 3;
    } else if (row >= 3 && row <= 5 && column >= 3 && column <= 5) {
      startingIndex = 30;
    } else if (row >= 6 && row <= 8 && column >= 3 && column <= 5) {
      startingIndex = 57;
    } else if (row >= 0 && row <= 2 && column >= 6 && column <= 8) {
      startingIndex = 6;
    } else if (row >= 3 && row <= 5 && column >= 6 && column <= 8) {
      startingIndex = 33;
    } else if (row >= 6 && row <= 8 && column >= 6 && column <= 8) {
      startingIndex = 60;
    }

    const myRegion = [];
    myRegion.push(puzzleString[startingIndex]);
    myRegion.push(puzzleString[startingIndex + 1]);
    myRegion.push(puzzleString[startingIndex + 2]);
    myRegion.push(puzzleString[startingIndex + 9]);
    myRegion.push(puzzleString[startingIndex + 10]);
    myRegion.push(puzzleString[startingIndex + 11]);
    myRegion.push(puzzleString[startingIndex + 18]);
    myRegion.push(puzzleString[startingIndex + 19]);
    myRegion.push(puzzleString[startingIndex + 20]);

    if (myRegion.join().indexOf(value) !== -1) {
      return false;
    } else {
      return true;
    }
  }

  solve(puzzleString) {
    if (puzzleString.indexOf(".") === -1) {
      return puzzleString;
    }
    const mySudoku = [];
    let row,
      column,
      counter = 0;
    let checkRow,
      checkCol,
      checkReg = false;
    let tmpArray = [];
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        tmpArray = [];
        for (let j = 1; j < 10; j++) {
          row = Math.floor(i / 9);
          column = i % 9;
          checkReg = this.checkRegionPlacement(puzzleString, row, column, j);
          checkRow = this.checkRowPlacement(puzzleString, row, j);
          checkCol = this.checkColPlacement(puzzleString, column, j);
          if (checkRow && checkCol && checkReg) {
            tmpArray.push(j);
          }
        }
        if (tmpArray.length === 1) {
          mySudoku.push([tmpArray.toString()]);
          counter++;
        } else {
          mySudoku.push(["."]);
        }
      } else {
        mySudoku.push([puzzleString[i]]);
      }
    }
    if (counter === 0) {
      return { error: 'Puzzle cannot be solved'};
    }
    return this.solve(mySudoku.toString().replace(/,/g, ""));
  }
}

module.exports = SudokuSolver;

