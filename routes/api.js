'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();
  // User Story #6 - You can POST to /api/check an object containing puzzle, coordinate, and value where the coordinate is the letter A-I indicating the row, followed by a number 1-9 indicating the column, and value is a number from 1-9.
  app.route('/api/check')
    .post((req, res) => {
      const resObj = {
        valid: false,
        conflict: []
      };

      const rowNum = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5,
        G: 6,
        H: 7,
        I: 8
      };

      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({ error: 'Required field(s) missing' });
      }

      if (req.body.puzzle.length != 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      const targetRow = Number.parseInt(rowNum[req.body.coordinate[0]]);
      const targetColumn = Number.parseInt(req.body.coordinate[1]) - 1;
      const targetValue = Number.parseInt(req.body.puzzle[9 * targetRow + targetColumn]);


      if (targetRow < 0 || targetRow > 8 || targetColumn < 0 || targetColumn > 8 || Number.isNaN(targetRow) || Number.isNaN(targetColumn) || targetRow === undefined || req.body.coordinate.length != 2) {
        res.json({ error: 'Invalid coordinate' });
      }

      // User Story #9 - If the object submitted to /api/check is missing puzzle, coordinate or value, the returned value will be { error: Required field(s) missing }
      const validateResponse = solver.check(req.body.puzzle, targetRow, targetColumn, req.body.value);
      if (validateResponse && validateResponse.hasOwnProperty('error')) {
        res.send(validateResponse);
      }

      // User Story #8 - If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.
      if (targetValue === Number.parseInt(req.body.value)) {
        res.json({ valid: true });
      }

      // User Story #7 - The return value from the POST to /api/check will be an object containing a valid property, which is true if the number may be placed at the provided coordinate and false if the number may not. If false, the returned object will also contain a conflict property which is an array containing the strings "row", "column", and/or "region" depending on which makes the placement invalid.
      const resultRow = solver.checkRowPlacement(req.body.puzzle, targetRow, req.body.value);
      const resultColumn = solver.checkColPlacement(req.body.puzzle, targetColumn, req.body.value);
      const resultRegion = solver.checkRegionPlacement(req.body.puzzle, targetRow, targetColumn, req.body.value);

      if (!resultRow) {
        resObj.conflict.push('row');
      }

      if (!resultColumn) {
        resObj.conflict.push('column');
      }

      if (!resultRegion) {
        resObj.conflict.push('region');
      }

      if (resultRow && resultColumn && resultRegion) {
        resObj.valid = true;
      }

      res.json(resObj);
    });
  // User Story #1 - You can POST /api/solve with form data containing puzzle which will be a string containing a combination of numbers (1-9) and periods . to represent empty spaces. The returned object will contain a solution property with the solved puzzle.
  // User Story #2 - If the object submitted to /api/solve is missing puzzle, the returned value will be { error: 'Required field missing' }
  // User Story #3 - If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
  // User Story #4 - If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
  // User Story #5 - If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
  app.route('/api/solve')
    .post((req, res) => {
      let myPuzzle = req.body.puzzle;

      if (myPuzzle && myPuzzle.length != 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      const validateResponse = solver.validate(myPuzzle);
      if (validateResponse && validateResponse.hasOwnProperty('error')) {
        res.json(validateResponse);
      } else if (myPuzzle.length != 81) {
        res.json({ error: 'Puzzle cannot be solved' });
      }

      let test = [];
      let myValue, row, col = 0;
      let checkRow, checkCol, checkReg = false;
      for (let i = 0; i < myPuzzle.length; i++) {
        myValue = myPuzzle[i];
        if (myValue.match(/[1-9]/)) {
          test = [...myPuzzle];
          myValue = Number.parseInt(test[i]);
          test[i] = '.';
          test = test.join('');
          row = Math.floor(i / 9);
          col = i % 9;
          checkRow = solver.checkRowPlacement(test, row, myValue);
          checkCol = solver.checkColPlacement(test, col, myValue);
          checkReg = solver.checkRegionPlacement(test, row, col, myValue);
          if (!checkRow || !checkCol || !checkReg) {
            res.json({ error: 'Puzzle cannot be solved' });
          }
        }
      }

      let solutionString = solver.solve(myPuzzle);
      if (solutionString && solutionString.hasOwnProperty('error')) {
        res.json(solutionString);
      }
      res.json({ solution: solutionString });
    });
};
