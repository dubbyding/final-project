import { Player } from './Bikes/player.js';
import { Police } from './Bikes/police.js';
import { Opponent } from './Bikes/opponents.js';
import { Cars } from './obstacles/cars.js';
import { Farms } from './obstacles/farms.js';
import { Trees } from './obstacles/tree.js';
import { Road } from './road.js';
import { Audio } from './audio/audio.js';
import { MathImplement } from './math.js';
import { StartingPage } from './startingPage.js';
import { BustedPage } from './bustedPage.js';
import { Score } from './score.js';

import { getCurrentCoords, createText } from './utils.js';

class RoadRash {
	constructor(id, playerColor) {
		this.id = id;
		this.playerColor = playerColor;

		this.starter = new StartingPage();
		this.busted = new BustedPage();

		this.player = new Player(window.innerWidth);
		this.opponent = new Opponent();
		this.police = new Police();

		this.cars = new Cars();
		this.farms = new Farms();
		this.trees = new Trees();

		this.audio = new Audio();
		this.math = new MathImplement();
		this.score = new Score();

		this.canvas = document.getElementById(this.id);

		this.canvas.width = parseInt(window.innerWidth);
		this.canvas.height = parseInt(window.innerHeight);

		this.road = new Road(this.canvas.width, this.canvas.height);

		this.gameLoading = 0;
		this.gameLoadingTotal = 25;
	}
	/**
	 * @desc Loading all the assets of the game.
	 * */
	loadAssets = async () => {
		this.numberOfRoads = 25;
		this.numberOfPartition = 50;

		let playerList,
			policeList,
			carsList,
			farmList,
			treeList,
			roadBackgroundList;

		// Load Scores
		try {
			this.listOfScore = await this.score.getScore();
			this.loadingGame();
			await this.score.getHighScore(this.listOfScore);
			this.loadingGame();
		} catch {
			console.log('Error Getting Score');
		}

		// starter assets load

		try {
			await this.starter.getImage();
			this.loadingGame();
			await this.starter.createStartingAsset();
			this.loadingGame();
		} catch {
			console.log('Error loading starting image');
		}
		try {
			await this.busted.getImage();
			this.loadingGame();
			await this.busted.createBustedAsset();
			this.loadingGame();
		} catch (e) {
			console.log(e);
			console.log('Error loading starting image');
		}
		// Audio Assets load
		try {
			await this.audio.getAudios();
			this.loadingGame();

			await this.audio.createIdleSound();
			this.loadingGame();

			await this.audio.createRideSound();
			this.loadingGame();
		} catch {
			console.log('Error loading audio');
		}

		// Characters Assets load
		try {
			playerList = await this.player.playerAsset();
			this.loadingGame();

			policeList = await this.police.policeAsset();
			this.loadingGame();

			carsList = await this.cars.carAssets();
			this.loadingGame();

			farmList = await this.farms.farmAssets();
			this.loadingGame();

			treeList = await this.trees.treeAssets();
			this.loadingGame();

			this.roadAssets = await this.road.generateNVarietyOfRoads(
				this.numberOfRoads,
				this.numberOfPartition
			);

			this.loadingGame();
			roadBackgroundList = await this.road.getBackgroundImage();
			this.loadingGame();
		} catch (e) {
			console.log('Error Loading Assets');
		}

		try {
			this.playerAsset = await this.assetsLoad(playerList);
			this.loadingGame();

			this.policeAsset = await this.assetsLoad(policeList);
			this.loadingGame();

			this.carAsset = await this.assetsLoad(carsList);
			this.loadingGame();

			this.farmAsset = await this.assetsLoad(farmList);
			this.loadingGame();

			this.treeAsset = await this.assetsLoad(treeList);
			this.loadingGame();

			this.roadBackground = await this.assetsLoad(roadBackgroundList, false);
			this.loadingGame();
		} catch {
			console.log('Error loading assets images');
		}

		try {
			let bikeColorConsist = await this.player.playerBike(this.playerColor);
			this.loadingGame();

			this.playerBike = await this.assetsLoad(bikeColorConsist, false);
			this.loadingGame();

			this.playerBike = this.playerBike[0];

			this.opponentBike = this.opponent.getOpponentBike(
				this.playerAsset,
				this.playerColor
			);
			this.loadingGame();
		} catch {
			this.playerBike = this.playerAsset[0];
		}
	};

	/**
	 * @desc Showing loading percent as the game is loaded
	 */
	loadingGame = () => {
		this.gameLoading++;

		let percentLoad = (this.gameLoading / this.gameLoadingTotal) * 100;

		this.displayLoading(percentLoad);
		if (Math.round(percentLoad) >= 100) {
			this.clear();
			this.startingPageDisplay();
		}
	};

	/**
	 * Display Loading screen
	 * @param {Number} percent
	 */
	displayLoading = (percent) => {
		this.clear();
		this.context.fillStyle = '#000000';
		this.context.font = '40px Arial';
		let top = window.innerHeight / 2;
		let left = window.innerWidth / 2;

		this.context.fillText('Loading...', left, top);

		this.context.font = '20px Arial';
		this.context.fillText(`${Math.round(percent)}%`, left, top + 20);
	};

	/**
	 * @desc Loads Necessary Assets
	 * @param {array} list
	 * @param {boolean} array
	 * @returns {Array} array of new elements created
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
	 * @returns {Promise} promise of new image object using that url
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
		let newleftCoordinates,
			newrightCoordinates,
			initialLeftCoordinates,
			initialRightCoordinates;
		[
			newleftCoordinates,
			newrightCoordinates,
			initialLeftCoordinates,
			initialRightCoordinates,
		] = getCurrentCoords(this.index, this.roadAssets);

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

		[newleftCoordinates, newrightCoordinates] =
			await this.road.generateProjectedCoordinates([
				currentCoordinatesLeft,
				currentCoordinatesRight,
			]);

		let rightDiffX = this.canvas.width - newrightCoordinates[0][0] - 100;
		let rightDiffY = this.canvas.height / newrightCoordinates[0][1];

		let leftDiffX = -newleftCoordinates[0][0] + 100;

		this.rightLimit = newrightCoordinates[0][0] + rightDiffX;
		this.leftLimit = newleftCoordinates[0][0] + leftDiffX;

		this.xMin = newleftCoordinates[this.playerIndex][0] + leftDiffX;
		this.xMax = newrightCoordinates[this.playerIndex][0] + rightDiffX;

		this.road.backgroundImageAdd(
			this.context,
			newleftCoordinates,
			leftDiffX,
			this.roadBackground
		);

		[this.xleft, this.xright] = this.road.roadGenerate(
			this.context,
			newleftCoordinates,
			newrightCoordinates,
			rightDiffX,
			rightDiffY,
			leftDiffX,
			this.index
		);

		this.road.colorRoad(
			this.context,
			newrightCoordinates,
			newleftCoordinates,
			rightDiffX,
			rightDiffY,
			leftDiffX
		);

		this.road.sideRoadLines(
			this.context,
			newleftCoordinates,
			newrightCoordinates,
			rightDiffX,
			rightDiffY,
			leftDiffX,
			this.index
		);
		if (Math.round(this.index) + 40 >= this.roadAssets[0].length - 1) {
			this.road.createFinishLine(
				this.context,
				newleftCoordinates,
				newrightCoordinates,
				rightDiffX,
				rightDiffY,
				leftDiffX
			);
		}
	};

	/**
	 * @desc This function displays the starting page
	 */
	startingPageDisplay = () => {
		this.clear();
		this.gameEnd = true;
		let font = '40px italic Arial';
		let playText = 'Play';
		let scoreText = 'Scores';

		let positionX = 350;
		let positionY = 400;

		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.starter.drawImageBackground(this.context);

		this.context.font = font;
		this.context.fillStyle = 'white';
		this.context.fillText(playText, positionX, positionY);
		this.context.fillText(scoreText, positionX, positionY + 50);

		this.mouseEvent = document.addEventListener('mousedown', this.startButton);
	};

	/**
	 * Reset values of all parameters
	 */
	resetValues = () => {
		this.carY = 1.452;
		this.carZ = 0.01;

		this.index = 0;

		this.velocity = 0;

		this.movement = false;

		this.playerIndex = 2;

		this.opponent.zIndex = 20;
		this.player.z = 1;
		this.player.position = 0;

		this.opponent.posChange = 1;

		this.cars.carsPerRoad = 20;
		this.cars.carStatus = false;
		this.cars.multiplyFactor = 1;

		this.cars.currentX = undefined;

		this.police.zIndex = Math.floor(this.roadAssets[0].length / 2);
	};

	/**
	 * @desc Creating a function that will be called when the user clicks on the start button.
	 * @param e - Event of mousedown
	 */
	startButton = async (e) => {
		if (
			e.clientX >= 350 &&
			e.clientX <= 420 &&
			e.clientY >= 350 &&
			e.clientY <= 420
		) {
			/**
			 * Resetting values;
			 */
			this.resetValues();
			/**
			 * Removing event listener
			 */
			document.removeEventListener('mousedown', this.startButton);
			this.initialCount = 3;

			/**
			 * Starting game
			 */
			await this.startCounter();

			const FRAMES = 60;
			const SECOND = 1000;
			const FPS = SECOND / FRAMES;

			this.gameInterval = setInterval(this.updateGameArea, FPS);

			this.movementPlayer();
			this.addObstacles();

			this.startingSecond = Date.now();
		}
		if (
			e.clientX >= 350 &&
			e.clientX <= 450 &&
			e.clientY >= 425 &&
			e.clientY <= 445
		) {
			document.removeEventListener('mousedown', this.startButton);

			this.showScoreArea();
		}
	};

	/**
	 * Display Scores
	 */
	showScoreArea = () => {
		let scoreToBeDisplayed = this.score.scoreArray.slice(0, 5);

		this.clear();

		let currentIndex = 100;
		createText(
			this.context,
			'50px Ariel',
			'#000',
			this.canvas.width / 2 - 100,
			50,
			'High Score'
		);
		for (let index in scoreToBeDisplayed) {
			createText(
				this.context,
				'20px Ariel',
				'#000',
				this.canvas.width / 2 - 100,
				currentIndex,
				`${parseInt(index) + 1}: ${scoreToBeDisplayed[index]} second`
			);
			currentIndex += 50;
		}
		createText(this.context, '30px Ariel', '#ff0000', 20, 60, 'Main Menu');

		this.highScoreMouseEvent = document.addEventListener(
			'mousedown',
			this.highScoreMouseClick
		);
	};

	/**
	 * Event Listener for highScore page
	 * @param {Object} e - Event on click
	 */
	highScoreMouseClick = (e) => {
		if (e.clientX > 20 && e.clientX < 160 && e.clientY > 40 && e.clientY < 60) {
			document.removeEventListener('mousedown', this.highScoreMouseClick);
			this.startingPageDisplay();
		}
	};

	/**
	 * Display Starting counter ingame
	 * @returns promise to make game pause
	 */
	startCounter = () => {
		return new Promise((resolve) => {
			let currentInterval = setInterval(async () => {
				this.clear();
				this.backgroundColorSet();
				await this.createRoad();
				this.renderPlayer();
				this.context.fillStyle = '#ffffff';
				this.context.font = `40px Ariel`;

				this.context.fillText(
					this.initialCount,
					this.canvas.width / 2,
					this.canvas.height / 2
				);
				if (this.initialCount <= 0) {
					clearInterval(currentInterval);
					resolve();
				}
				this.initialCount--;
			}, 1000);
		});
	};

	/**
	 * @desc Setting the frame rate of the game and starting the game
	 */
	start = () => {
		this.context = this.canvas.getContext('2d');
	};

	/**
	 * @desc Clear canvas
	 */
	clear = () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	/**
	 * @desc A function that is called in the start function. It is used to detect the key pressed by the user.
	 */
	movementPlayer = () => {
		this.keyPressed = {};
		this.movementDownEvent = document.addEventListener(
			'keydown',
			this.keyDownEventHandler
		);
		this.movementUpEvent = document.addEventListener(
			'keyup',
			this.keyUpEventHandler
		);
	};

	/* A function that is being called when a key is pressed. */
	keyDownEventHandler = (e) => {
		this.movement = true;
		this.keyPressed[e.key] = true;
	};

	/* A function that is called when a key is released. */
	keyUpEventHandler = (e) => {
		this.movement = false;
		delete this.keyPressed[e.key];
	};
	/**
	 * @desc Project Player from 3d space to 2d space
	 */
	renderPlayer = async () => {
		[this.top, this.left, this.height, this.width] =
			await this.player.bikeCoordinates(this.canvas, this.road);
		let opponentPos = [
			this.opponentTop,
			this.opponentLeft,
			this.opponentWidth,
			this.opponentHeight,
		];
		let policePos = [
			this.policeTop,
			this.policeLeft,
			this.policeHeight,
			this.policeWidth,
		];
		let playerPos = [this.top, this.left, this.width, this.height];

		let opponentKicked = this.player.kickCheck(opponentPos, playerPos);
		if (opponentKicked) {
			this.opponent.position += opponentKicked;
		}
		let policeKicked = this.player.kickCheck(policePos, playerPos);
		if (policeKicked) {
			this.police.position += policeKicked;
		}

		this.player.renderBike(
			this.context,
			this.playerBike,
			this.left,
			this.top,
			this.width,
			this.height
		);
	};

	/**
	 * @desc Check Collision with cars
	 */
	checkObstacleCollision = () => {
		if (
			this.carTop * 2 + this.carHeight + 100 > this.top &&
			this.top + this.height > this.carTop * 2 + 100 &&
			this.carLeft < this.left + this.width &&
			this.carLeft + this.carWidth > this.left
		) {
			this.velocity = 0;
			this.carY = 0;
			this.carZ = 0;
		} else {
			this.carY = 1.452;
			this.carZ = 0.01;
		}
	};

	/**
	 * @desc This function gives the actual movement activities
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
			if (Math.round(this.xMin) < Math.round(this.left)) {
				this.player.position -= 5;
			} else {
				this.velocity = Math.round(this.velocity / 2);
				this.player.position += 5;
			}
		}
		if (this.keyPressed['d'] || this.keyPressed['ArrowRight']) {
			if (Math.round(this.xMax) > Math.round(this.left)) {
				this.player.position += 5;
			} else {
				this.player.position -= 5;
				this.velocity = Math.round(this.velocity / 2);
			}
		}
		if (this.keyPressed['Escape']) {
			this.clearEventsAfterGame();
			this.endGame();
		}
	};

	/**
	 * @desc Changing the velocity of the bike when bike when no key pressed
	 */
	velocityChange = async () => {
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
		if (nextIndex + 10 > this.roadAssets[0].length - 1) {
			this.clearEventsAfterGame();

			// Game End flag so that double score won't be posted
			if (this.gameEnd) {
				this.gameEnd = false;
				if (await this.score.setScore(Math.floor(this.currentTime / 1000))) {
					this.endGame();
				}
			}
		}
	};

	/**
	 * @desc Clear screen and remove eventlistners after game finish
	 */
	clearEventsAfterGame = () => {
		clearInterval(this.gameInterval);
		document.removeEventListener('keydown', this.keyDownEventHandler);
		document.removeEventListener('keyup', this.keyUpEventHandler);
	};

	/**
	 * @desc Sets highScore and shows highScore area
	 */
	endGame = async (complete = true) => {
		this.audio.stopSound();
		this.listOfScore = await this.score.getScore();
		await this.score.getHighScore(this.listOfScore);
		if (!complete) await this.bustedPageDisplay();
		this.showScoreArea();
	};

	/**
	 * @desc The above code is used to display the car on the canvas.
	 */
	addObstacles = async () => {
		let newleftCoordinates,
			newrightCoordinates,
			initialLeftCoordinates,
			initialRightCoordinates,
			currentPlayerPosX,
			currentPlayerPosY,
			currentCarY,
			currentCarZ;
		let roadAssets = this.roadAssets;
		let carDisplayStatus = this.cars.getCarAssets(
			this.carAsset,
			roadAssets,
			this.index
		);
		if (carDisplayStatus) {
			[
				newleftCoordinates,
				newrightCoordinates,
				initialLeftCoordinates,
				initialRightCoordinates,
			] = getCurrentCoords(this.index, this.roadAssets);

			let carXMin = newleftCoordinates[newleftCoordinates.length - 1][0];
			let carXMax = newrightCoordinates[newrightCoordinates.length - 1][0];
			let currentCarX = this.math.generateRandomNumber(carXMin, carXMax);

			// Used for translation
			this.cars.xLeftPos = -carXMin;

			currentCarY =
				initialLeftCoordinates[initialLeftCoordinates.length - 1][1];
			currentCarZ =
				initialLeftCoordinates[initialLeftCoordinates.length - 1][2];

			this.cars.carZAxis = currentCarZ;

			let currentWidth = this.cars.carPosition.width;
			let currentHeight = this.cars.carPosition.height;
			currentPlayerPosX = [
				[currentCarX, currentCarY, currentCarZ],
				[currentCarX, currentCarY + currentHeight, currentCarZ],
			];
			currentPlayerPosY = [
				[currentCarX + currentWidth, currentCarY, currentCarZ],
				[currentCarX + currentWidth, currentCarY + currentHeight, currentCarZ],
			];

			let carindex = this.math.generateRandomNumber(
				0,
				this.carAsset.length - 1
			);
			this.cars.setCurrentXAndY(currentPlayerPosX, currentPlayerPosY, carindex);
		} else {
			try {
				let x, y, z;
				[x, y, z] = this.cars.currentX[0];
				y += this.carY;
				z -= this.carZ;
				this.cars.currentX[0] = [x, y, z];

				[x, y, z] = this.cars.currentX[1];
				y += this.carY;
				z -= this.carZ;
				this.cars.currentX[1] = [x, y, z];
				currentPlayerPosX = this.cars.currentX;

				[x, y, z] = this.cars.currentY[0];
				y += this.carY;
				z -= this.carZ;
				this.cars.currentY[0] = [x, y, z];

				[x, y, z] = this.cars.currentY[1];
				y += this.carY;
				z -= this.carZ;
				this.cars.currentY[1] = [x, y, z];
				currentPlayerPosY = this.cars.currentY;
				this.cars.carZAxis = z;
			} catch {
				// console.log('Not Loaded');
			}
		}
		try {
			[newleftCoordinates, newrightCoordinates] =
				await this.road.generateProjectedCoordinates([
					currentPlayerPosX,
					currentPlayerPosY,
				]);

			this.carTop = Math.round(newleftCoordinates[0][1]);
			this.carLeft = newleftCoordinates[0][0] + this.cars.xLeftPos;
			this.currentZCheckCar = currentPlayerPosX[0][2];

			this.carHeight = Math.round(newleftCoordinates[1][1] - this.carTop);
			this.carWidth = Math.round(
				newrightCoordinates[1][0] - this.carLeft + this.cars.xLeftPos
			);
			if (this.currentZCheckCar > 0) {
				let diffLeft =
					this.xleft[Math.round(this.currentZCheckCar)] - this.carLeft;
				let diffRight =
					this.carLeft +
					this.carWidth -
					this.xright[Math.round(this.currentZCheckCar)];
				if (diffLeft < 0) {
					this.carLeft += diffLeft;
				}
				if (diffRight < 0) {
					this.carLeft -= diffRight;
				}
			}

			this.cars.displayCar(
				this.context,
				this.carLeft,
				this.carTop,
				this.carWidth,
				this.carHeight
			);
		} catch {
			// console.log('Nothing to be displayed');
		}
	};

	/**
	 * @desc Playing a different sound when in different velocity
	 */
	setAudio = () => {
		if (this.velocity <= 0) {
			this.audio.playIdleSound();
		} else {
			this.audio.playRideSound();
		}
	};

	/**
	 * @desc Setting the background color of the canvas to lightblue.
	 */
	backgroundColorSet = () => {
		this.context.fillStyle = 'lightblue';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	};

	/**
	 * @desc Display time in the screen for high score
	 */
	displayTime = () => {
		this.currentTime = Date.now() - this.startingSecond;
		this.context.fillStyle = '#000000';
		this.context.font = `20px Ariel`;
		this.context.fillText(
			`Time:- ${Math.floor(this.currentTime / 1000)}s`,
			this.canvas.width - 120,
			this.canvas.height / 3
		);
	};

	/**
	 * @desc Add opponents to the screen
	 */
	addOpponent = async () => {
		this.opponent.setZValue(this.index);
		[
			this.opponentTop,
			this.opponentLeft,
			this.opponentHeight,
			this.opponentWidth,
		] = await this.opponent.bikeCoordinates(this.canvas, this.road);

		let carPos = [this.carTop, this.carLeft, this.carWidth, this.carHeight];
		let playerPos = [this.top, this.left, this.width, this.height];
		let border = [this.xleft, this.xright];
		let opponentPos = [
			this.opponentTop,
			this.opponentLeft,
			this.opponentWidth,
			this.opponentHeight,
		];

		this.opponent.moveBike(carPos, playerPos, opponentPos, border, 5);

		if (this.opponent.conditionToDisplay()) {
			this.opponent.renderBike(
				this.context,
				this.opponentBike,
				this.opponentLeft,
				this.opponentTop,
				this.opponentWidth,
				this.opponentHeight
			);
		}
	};

	/**
	 * @desc Add opponents to the screen
	 */
	addPolice = async () => {
		[this.policeTop, this.policeLeft, this.policeHeight, this.policeWidth] =
			await this.police.bikeCoordinates(this.canvas, this.road);

		let carPos = [this.carTop, this.carLeft, this.carWidth, this.carHeight];
		let playerPos = [this.top, this.left, this.width, this.height];
		let border = [this.xleft, this.xright];
		let opponentPos = [
			this.opponentTop,
			this.opponentLeft,
			this.opponentWidth,
			this.opponentHeight,
		];
		let policePos = [
			this.policeTop,
			this.policeLeft,
			this.policeHeight,
			this.policeWidth,
		];

		this.police.setZValue(this.index);

		if (this.police.conditionToDisplay()) {
			this.police.moveBike(carPos, playerPos, policePos, border, 3);
			this.opponent.moveBike(carPos, opponentPos, policePos, border, 3);
			this.police.renderBike(
				this.context,
				this.policeAsset[0],
				this.policeLeft,
				this.policeTop,
				this.policeWidth,
				this.policeHeight
			);
			if (this.police.bustedStatus(this.velocity)) {
				this.clearEventsAfterGame();
				this.endGame(false);
			}
		}
	};

	/**
	 * @desc This function displays the starting page
	 */
	bustedPageDisplay = () => {
		this.clear();
		this.gameEnd = true;

		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.busted.drawImageBackground(this.context);

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 3000);
		});
	};

	/**
	 * @desc The main function that is called in the start function. It is used to detect the key pressed by the
	user. 
	*/
	updateGameArea = async () => {
		this.clear();
		this.backgroundColorSet();
		await this.createRoad();
		this.renderPlayer();
		this.displayTime();
		this.player.transitionAnimation(this.velocity, this.keyPressed);
		this.setAudio();
		this.movementAction();
		this.checkObstacleCollision();
		this.addObstacles();
		this.velocityChange();
		this.addOpponent();
		this.addPolice();
	};
}

/**
 * Starting game function
 */
const startGame = async () => {
	let newGame = new RoadRash('root', 'red');
	newGame.start();
	await newGame.loadAssets();
};

startGame();
