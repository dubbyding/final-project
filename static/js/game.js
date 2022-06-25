import { Player } from './Bikes/player.js';
import { Police } from './Bikes/police.js';
import { Cars } from './obstacles/cars.js';
import { Farms } from './obstacles/farms.js';
import { Trees } from './obstacles/tree.js';
import { Road } from './road.js';

import { MathImplement } from './math.js';

import { createPath } from './utils.js';

class RoadRash {
	constructor(id, playerColor) {
		this.id = id;
		this.playerColor = playerColor;

		this.player = new Player(window.innerWidth);
		this.police = new Police();
		this.cars = new Cars();
		this.farms = new Farms();
		this.trees = new Trees();

		this.math = new MathImplement();

		this.canvas = document.getElementById(this.id);

		this.canvas.width = parseInt(window.innerWidth);
		this.canvas.height = parseInt(window.innerHeight);

		this.road = new Road(this.canvas.width, this.canvas.height);

		this.index = 0;

		this.velocity = 0;

		this.movement = false;

		this.displayState = 0;

		this.displayStateDuration = 0;
	}
	/**
	 * @desc Loading all the assets of the game.
	 * @param {boolean} autoStartGame - Status that auto starts the game after loading if true
	 * */
	loadAssets = async (autoStartGame = true) => {
		const numberOfRoads = 100;
		const numberOfPartition = 50;

		let playerList, policeList, carsList, farmList, treeList;

		try {
			playerList = await this.player.playerAsset();
			policeList = await this.police.policeAsset();

			carsList = await this.cars.carAssets();
			farmList = await this.farms.farmAssets();
			treeList = await this.trees.treeAssets();

			this.roadAssets = await this.road.generateNVarietyOfRoads(
				numberOfRoads,
				numberOfPartition
			);
		} catch (e) {
			console.log('Error Loading Assets');
		}

		try {
			this.playerAsset = await this.assetsLoad(playerList);
			this.policeAsset = await this.assetsLoad(policeList);

			this.carAsset = await this.assetsLoad(carsList);
			this.farmAsset = await this.assetsLoad(farmList);
			this.treeAsset = await this.assetsLoad(treeList);
		} catch {
			console.log('Error loading assets images');
		}

		try {
			let bikeColorConsist = await this.player.playerBike(this.playerColor);
			this.playerBike = await this.assetsLoad(bikeColorConsist, false);
			this.playerBike = this.playerBike[0];
		} catch {
			this.playerBike = this.playerAsset[0];
		}

		/**
		 * After fetching assets start the game
		 */
		if (autoStartGame) this.start();
		else return;
	};

	/**
	 * @desc Loads Necessary Assets
	 * @param {array} list
	 * @param {boolean} array
	 * @returns array of new elements created
	 */
	assetsLoad = async (list, array = true) => {
		let listOfElement = [];
		if (array) {
			for (let objectIndex in list) {
				for (let arrayIndex in list[objectIndex]) {
					listOfElement.push(
						await this.createElement(list[objectIndex][arrayIndex])
					);
				}
			}
		} else {
			for (let objectIndex in list) {
				listOfElement.push(await this.createElement(list[objectIndex]));
			}
		}
		return listOfElement;
	};

	/**
	 *
	 * @param {string} url
	 * @returns promise of new image object using that url
	 */
	createElement = (url) => {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = url;
			img.onload = () => {
				resolve(img);
			};
		});
	};

	/**
	 * @desc Creates a road for the game
	 */
	createRoad = async () => {
		let leftCoordinates, rightCoordinates;
		let currentIndex = Math.round(this.index);
		[leftCoordinates, rightCoordinates] = this.roadAssets;
		let initialLeftCoordinates = [...leftCoordinates].slice(0, 10);
		let initialRightCoordinates = [...rightCoordinates].slice(0, 10);
		let newleftCoordinates = [...leftCoordinates].slice(
			currentIndex,
			currentIndex + 10
		);
		let newrightCoordinates = [...rightCoordinates].slice(
			currentIndex,
			currentIndex + 10
		);
		let currentCoordinatesLeft = [];
		let currentCoordinatesRight = [];
		for (let i in newleftCoordinates) {
			currentCoordinatesLeft.push([
				newleftCoordinates[i][0],
				initialLeftCoordinates[i][1],
				initialLeftCoordinates[i][2],
			]);
			currentCoordinatesRight.push([
				newrightCoordinates[i][0],
				initialRightCoordinates[i][1],
				initialRightCoordinates[i][2],
			]);
		}
		// console.log(leftCoordinates);
		[newleftCoordinates, newrightCoordinates] =
			await this.road.generateProjectedCoordinates([
				currentCoordinatesLeft,
				currentCoordinatesRight,
			]);

		this.context.beginPath();
		this.context.setLineDash([10]);
		this.context.strokeStyle = '#000000';
		this.context.lineWidth = 10;

		let rightDiffX = this.canvas.width - newrightCoordinates[0][0] - 100;
		let rightDiffY = this.canvas.height / newrightCoordinates[0][1];

		let leftDiffX = -newleftCoordinates[0][0] + 100;

		this.rightLimit = newrightCoordinates[0][0] + rightDiffX;
		this.leftLimit = newleftCoordinates[0][0] + leftDiffX;

		for (let i = 0; i < 9; i++) {
			let xleft1, yleft1, xleft2, yleft2, xright1, yright1, xright2, yright2;
			[xright1, yright1] = newrightCoordinates[i];
			[xright2, yright2] = newrightCoordinates[i + 1];

			createPath(
				xright1 + rightDiffX,
				yright1 * rightDiffY,
				xright2 + rightDiffX,
				yright2 * rightDiffY,
				'#000000',
				10,
				[20],
				this.context
			);

			[xleft1, yleft1] = newleftCoordinates[i];
			[xleft2, yleft2] = newleftCoordinates[i + 1];

			createPath(
				xleft1 + leftDiffX,
				yleft1 * rightDiffY,
				xleft2 + leftDiffX,
				yleft2 * rightDiffY,
				'#000000',
				10,
				[20],
				this.context
			);
		}
		let startingX, startingY, endingX, endingY;

		let x1, y1, x2, y2;

		[x1, y1] = newleftCoordinates[0];
		[x2, y2] = newrightCoordinates[0];

		[startingX, startingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			2,
			1
		);

		[x1, y1] = newleftCoordinates[newleftCoordinates.length - 1];
		[x2, y2] = newrightCoordinates[newrightCoordinates.length - 1];

		[endingX, endingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			2,
			1
		);

		createPath(
			startingX,
			startingY,
			endingX,
			endingY,
			'#000000',
			10,
			[20],
			this.context
		);

		[x1, y1] = newleftCoordinates[0];
		[x2, y2] = newrightCoordinates[0];

		[startingX, startingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			1,
			2
		);

		[x1, y1] = newleftCoordinates[newleftCoordinates.length - 1];
		[x2, y2] = newrightCoordinates[newrightCoordinates.length - 1];

		[endingX, endingY] = this.math.sectionFormula(
			[x1 + leftDiffX, y1 * rightDiffY],
			[x2 + rightDiffX, y2 * rightDiffY],
			1,
			2
		);

		createPath(
			startingX,
			startingY,
			endingX,
			endingY,
			'#000000',
			10,
			[20],
			this.context
		);
	};

	/* Setting the frame rate of the game and starting the game*/
	start = () => {
		const FRAMES = 60;
		const SECOND = 1000;
		const FPS = SECOND / FRAMES;

		this.context = this.canvas.getContext('2d');

		this.gameInterval = setInterval(this.updateGameArea, FPS);
	};

	/**
	 * Clear canvas
	 */
	clear = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	/* A function that is called in the start function. It is used to detect the key pressed by the user. */
	movementPlayer = () => {
		this.keyPressed = {};
		document.addEventListener('keydown', (e) => {
			this.movement = true;
			this.keyPressed[e.key] = true;
		});
		document.addEventListener('keyup', (e) => {
			this.movement = false;
			delete this.keyPressed[e.key];
		});
	};

	/**
	 * This function gives the actual movement activities
	 */
	movementAction = () => {
		let maxVelocity = 25;
		let minVelocity = -12;
		if (this.keyPressed['w'] || this.keyPressed['ArrowUp']) {
			this.velocity += 1;
			if (this.velocity > maxVelocity) {
				this.velocity = maxVelocity;
			}
		}
		if (this.keyPressed['s'] || this.keyPressed['ArrowDown']) {
			this.velocity -= 1;
			if (this.velocity < minVelocity) {
				this.velocity = minVelocity;
			}
		}
		if (this.keyPressed['a'] || this.keyPressed['ArrowLeft']) {
			if (this.velocity != 0) {
				if (Math.round(this.leftLimit) < Math.round(this.player.position)) {
					this.player.position -= 5;
				} else {
					this.velocity = Math.round(this.velocity / 2);
					this.player.position += 5;
				}
			}
		}
		if (this.keyPressed['d'] || this.keyPressed['ArrowRight']) {
			if (this.velocity != 0) {
				if (Math.round(this.rightLimit) > Math.round(this.player.position)) {
					this.player.position += 5;
				} else {
					this.player.position -= 5;
					this.velocity = Math.round(this.velocity / 2);
				}
			}
		}
	};

	/* Changing the velocity of the bike. */
	velocityChange = () => {
		const SPEED_LIMIT = 80;
		if (!this.movement) {
			if (this.velocity > 0) {
				this.velocity -= 0.5;
			} else if (this.velocity < 0) {
				this.velocity += 0.5;
			} else {
				this.velocity = 0;
			}
		}

		let nextIndex = this.index + this.velocity / SPEED_LIMIT;

		if (nextIndex + 10 < this.roadAssets[0].length - 1 && nextIndex >= 0)
			this.index = nextIndex;
	};

	/* The main function that is called in the start function. It is used to detect the key pressed by the
	user. */
	updateGameArea = async () => {
		this.clear();
		await this.createRoad();
		this.player.renderBike(this.canvas, this.context, this.playerBike);
		this.movementAction();
		this.velocityChange();
		this.player.transitionAnimation(this.velocity, this.keyPressed);
	};
}

const startGame = async () => {
	let newGame = new RoadRash('root', 'red');
	await newGame.loadAssets(false);
	newGame.start();
	newGame.movementPlayer();
};

startGame();
