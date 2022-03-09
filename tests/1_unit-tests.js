const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const server = require('../server.js');
import { puzzlesAndSolutions } from '../controllers/puzzle-strings';
import { invalidPuzzles } from '../controllers/invalid-puzzle-strings';

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    const result = solver.validate(puzzlesAndSolutions[0][0]);
    assert.equal(result.message, 'valid');
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
    const result = solver.validate(invalidPuzzles[0]);
    assert.equal(result.error, 'Invalid characters in puzzle');
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    const result = solver.validate(invalidPuzzles[1]);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    done();
  });
  test('Logic handles a valid row placement', function(done) {
    const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 7);
    assert.equal(result, true);
    done();
  });
  test('Logic handles an invalid row placement', function(done) {
    const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 2);
    assert.equal(result, false);
    done();
  });
  test('Logic handles a valid column placement', function(done) {
    const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], 1, 5);
    assert.equal(result, true);
    done();
  });
  test('Logic handles an invalid column placement', function(done) {
    const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], 1, 6);
    assert.equal(result, false);
    done();
  });
  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 2, 2, 4);
    assert.equal(result, true);
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 2, 2, 1);
    assert.equal(result, false);
    done();
  });
  test('Valid puzzle strings pass the solver', function(done) {
    const puzzle = solver.solve(puzzlesAndSolutions[0][0]);
    assert.notInclude(puzzle, '.');
    done();
  });
  test('Invalid puzzle strings fail the solver', function(done) {
    const puzzle = solver.solve(invalidPuzzles[0]);
    const failedValidation = solver.validate(puzzle);
    assert.property(failedValidation, 'error');
    done();
  });
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    const puzzle = solver.solve(puzzlesAndSolutions[0][0]);
    const solution = puzzlesAndSolutions[0][1];
    assert.equal(puzzle, solution);
    done();
  });
});