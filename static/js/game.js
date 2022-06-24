import { Player } from './Bikes/player.js';
import { Police } from './Bikes/police.js';
import { Cars } from './obstacles/cars.js';
import { Farms } from './obstacles/farms.js';
import { Trees } from './obstacles/tree.js';
import { Road } from './road.js';

import { MathImplement } from './math.js';

class RoadRash {
	constructor(id, playerColor) {
		this.id = id;
		this.playerColor = playerColor;

		this.player = new Player();
		this.police = new Police();
		this.cars = new Cars();
		this.farms = new Farms();
		this.trees = new Trees();

		this.math = new MathImplement();

		this.canvas = document.getElementById(this.id);

		this.canvas.width = parseInt(window.innerWidth);
		this.canvas.height = parseInt(window.innerHeight);

		this.road = new Road(this.canvas.width, this.canvas.height);

		this.index = 2;
	}
	/**
	 *  Loading all the assets of the game.
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
			console.log(this.roadAssets);
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
	 *
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

	createRoad = async () => {
		let leftCoordinates, rightCoordinates;
		[leftCoordinates, rightCoordinates] = this.roadAssets;
		let initialLeftCoordinates = [...leftCoordinates].slice(0, 50);
		let initialRightCoordinates = [...rightCoordinates].slice(0, 50);
		let newleftCoordinates = [...leftCoordinates].slice(
			this.index,
			this.index + 50
		);
		let newrightCoordinates = [...rightCoordinates].slice(
			this.index,
			this.index + 50
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

		let rightDiffX = this.canvas.width - newrightCoordinates[0][0] - 100;
		let rightDiffY = this.canvas.height / newrightCoordinates[0][1];

		let leftDiffX = -newleftCoordinates[0][0] + 100;

		for (let i = 0; i < 49; i++) {
			let x, y;

			[x, y] = newrightCoordinates[i];
			this.context.moveTo(x + rightDiffX, y * rightDiffY);

			[x, y] = newrightCoordinates[i + 1];
			this.context.lineTo(x + rightDiffX, y * rightDiffY);

			this.context.stroke();

			[x, y] = newleftCoordinates[i];
			this.context.moveTo(x + leftDiffX, y * rightDiffY);

			[x, y] = newleftCoordinates[i + 1];
			this.context.lineTo(x + leftDiffX, y * rightDiffY);
			this.context.stroke();
		}
	};

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

	updateGameArea = () => {
		this.clear();
		this.index += 0.2;
		this.player.renderBike(this.canvas, this.context, this.playerBike);
		this.createRoad();
	};
}

const startGame = async () => {
	let newGame = new RoadRash('root', 'red');
	await newGame.loadAssets(false);
	newGame.start();
};

startGame();
