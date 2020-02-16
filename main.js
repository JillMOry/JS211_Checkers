"use strict";

const assert = require("assert");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

class Checker {
	constructor(color) {
		if (color === "white") {
			this.symbol = String.fromCharCode(0x125cb);
		} else {
			this.symbol = String.fromCharCode(0x125cf);
		}
	}
}

class Board {
	constructor() {
		this.grid = [];
		this.checkers = [];
	}
	// method that creates an 8x8 array, filled with null values
	createGrid() {
		// loop to create the 8 rows
		for (let row = 0; row < 8; row++) {
			this.grid[row] = [];
			// console.log(this.grid[row]);
			// push in 8 columns of nulls
			for (let column = 0; column < 8; column++) {
				this.grid[row].push(null);

				// console.log(this.grid[row]);
			}
		}
	}
	viewGrid() {
		// add our column numbers
		let string = "  0 1 2 3 4 5 6 7\n";
		for (let row = 0; row < 8; row++) {
			// we start with our row number in our array
			const rowOfCheckers = [row];
			// a loop within a loop
			for (let column = 0; column < 8; column++) {
				// if the location is "truthy" (contains a checker piece, in this case)
				if (this.grid[row][column]) {
					// push the symbol of the check in that location into the array
					rowOfCheckers.push(this.grid[row][column].symbol);
				} else {
					// just push in a blank space
					rowOfCheckers.push(" ");
				}
			}
			// join the rowOfCheckers array to a string, separated by a space
			string += rowOfCheckers.join(" ");
			// add a 'new line'
			string += "\n";
		}
		console.log(string);
	}

	//creating checker positions/arrays
	createCheckers() {
		let whitePositions = [
			[0, 1],
			[0, 3],
			[0, 5],
			[0, 7],
			[1, 0],
			[1, 2],
			[1, 4],
			[1, 6],
			[2, 1],
			[2, 3],
			[2, 5],
			[2, 7]
		];

		let blackPositions = [
			[5, 0],
			[5, 2],
			[5, 4],
			[5, 6],
			[6, 1],
			[6, 3],
			[6, 5],
			[6, 7],
			[7, 0],
			[7, 2],
			[7, 4],
			[7, 6]
		];

		// pushes the array for each color of checkers into the grid and into the array of checkers.
		for (let i = 0; i < 12; i++) {
			let whiteChecker = new Checker("white");
			this.grid[whitePositions[i][0]][whitePositions[i][1]] = whiteChecker;
			this.checkers.push(whiteChecker);
		}
		// Do all three steps above for a 'black' checker
		for (let i = 0; i < 12; i++) {
			let blackChecker = new Checker("black");
			this.grid[blackPositions[i][0]][blackPositions[i][1]] = blackChecker;
			this.checkers.push(blackChecker);
		}
	}
	//helper function for selecting a checker
	selectChecker(row, column) {
		return this.grid[row][column];
	}

	// In your Board class, write a method killChecker that take a single argument position which is a coordinate pair, eg. [0, 5]. In it, use this.selectChecker to grab the checker at the position given. Find the index of that checker in the this.checkers array. then remove it by .splice()ing it out. Then assign the position on this.grid to null. That checker is dead.
	//splices the checker out of the array
	killChecker(position) {
		this.checkers.splice(position, 1);
	}
}

class Game {
	constructor() {
		this.board = new Board();
	}
	start() {
		this.board.createGrid();
		this.board.createCheckers();
	}

	moveChecker(start, end) {
		// setting the varaiables start row/column & end row/column to the 0 or 1 index of the array (or checker coordinate)
		const startRow = start.charAt(0);
		const startColumn = start.charAt(1);
		const endRow = end.charAt(0);
		const endColumn = end.charAt(1);
		// evaluating if where the checker is being placed is null before allowing the move.
		if (this.board.grid[endRow][endColumn] === null) {
			let gamePiece = this.board.selectChecker(startRow, startColumn);
			//sets the starting point in the grid to null (the array)
			this.board.grid[startRow][startColumn] = null;
			//moves the piece on the board
			this.board.grid[endRow][endColumn] = gamePiece;
		}
		// evaluates if the start & end position are two spaces apart i.e. if a checker has been jumped.
		if (Math.abs(start[0] - end[0]) === 2) {
			//parding the coordinates to an interger so can be evaluated in a mathematical equation.  killRow and killColumn are the midpoints.
			let killRow = (parseInt(start[0]) + parseInt(end[0])) / 2;
			let killColumn = (parseInt(start[1]) + parseInt(end[1])) / 2;
			//setting the deadPosition to the midpoint coordinates to be passed through to the killChecker function
			let deadPosition = this.board.selectChecker(killRow, killColumn);
			// setting the midpoint checker to null / removing it from the board
			this.board.grid[killRow][killColumn] = null;
			this.board.killChecker(deadPosition); // to remove from the array
		}
	}
}

function getPrompt() {
	game.board.viewGrid();
	rl.question("which piece?: ", (whichPiece) => {
		rl.question("to where?: ", (toWhere) => {
			game.moveChecker(whichPiece, toWhere);
			getPrompt();
		});
	});
}

const game = new Game();
game.start();

// Tests
if (typeof describe === "function") {
	describe("Game", () => {
		it("should have a board", () => {
			assert.equal(game.board.constructor.name, "Board");
		});
		it("board should have 24 checkers", () => {
			assert.equal(game.board.checkers.length, 24);
		});
	});

	describe("Game.moveChecker()", () => {
		it("should move a checker", () => {
			assert(!game.board.grid[4][1]);
			game.moveChecker("50", "41");
			assert(game.board.grid[4][1]);
			game.moveChecker("21", "30");
			assert(game.board.grid[3][0]);
			game.moveChecker("52", "43");
			assert(game.board.grid[4][3]);
		});
		it("should be able to jump over and kill another checker", () => {
			game.moveChecker("30", "52");
			assert(game.board.grid[5][2]);
			assert(!game.board.grid[4][1]);
			``;
			assert.equal(game.board.checkers.length, 23);
		});
	});
} else {
	getPrompt();
}

///
