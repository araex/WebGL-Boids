define([
	'modules/prey',
	'modules/predator',
	'threejs',
	'underscore'
], function (Prey, Predator, THREE, _) {
	/* constructor */
	function Swarm() {
		var self = this;

		// config
		self.simulationSpeed = 1.0;
		self.preyCenterForce = 0.0000;
		self.preySize = 0.5;
		self.preyDistance = 4;
		self.preyAttractForce = 10;
		self.preyRepelForce = -20;
		self.preyAcceleration = 0.9;
		self.preyMaxSpeed = 25;
		self.killRadius = 10;
		self.fearRadius = 40;
		self.fearForce = -200000;
		self.predatorSize = 1.5;
		self.predatorAcceleration = 3;
		self.predatorMaxSpeed = 90;
		var INIT_ROW_COUNT = 40;
		var INIT_COL_COUNT = 40;
		var INIT_PRED_COUNT = 4;

		// private vars
		var prey = [];
		var flatPrey;
		var predators = [];

		self.update = function (_deltaT) {
			// prevent the boids from floating off if the window is not in focus.
			_deltaT = Math.min(_deltaT, 0.1);
			_deltaT *= self.simulationSpeed;
			_.each(predators, function (element){
				element.update(self, _deltaT);
			});

			_.each(flatPrey, function (element) {
				element.update(self, _deltaT);
			});
		};

		self.getPredators = function () {
			return predators;
		}

		self.getPrey = function () {
			return flatPrey;
		};

		var __init = function () {
			__initPrey();
			__initPredators();
			__setupNeighbors();
		};

		var __initPrey = function () {
			var i, j, pos;

			for (i = 0; i < INIT_ROW_COUNT; i++) {
				prey[i] = [];
				for (j = 0; j < INIT_COL_COUNT; j++) {
					pos = new THREE.Vector3((i - INIT_ROW_COUNT / 2) * self.preyDistance, getRandomInt(25, 50), (j - INIT_COL_COUNT / 2)  * self.preyDistance);
					prey[i][j] = new Prey(pos);
				}
			}
			flatPrey = _.flatten(prey);
		};

		var __initPredators = function () {
			var spawnAreaMin = 50;
			var spawnAreaMax = 100;
			var i, pos;

			for (i = 0; i < INIT_PRED_COUNT; i++){
				pos = new THREE.Vector3(getRandomInt(spawnAreaMin, spawnAreaMax), getRandomInt(spawnAreaMin, spawnAreaMax), getRandomInt(spawnAreaMin, spawnAreaMax));
				predators.push(new Predator(pos));
			}
		};

		var __setupNeighbors = function () {
			var i;
			for (i = 0; i < INIT_ROW_COUNT; i++) {
				for (j = 0; j < INIT_COL_COUNT; j++) {
					__connectNeighbors(i, j);
				}
			}
		};

		var __connectNeighbors = function (row, col) {
			var obj = prey[row][col];
			obj.neighbors.length = 0;
			/*
			 * NW N NE
			 * W obj E
			 * SW S SE
			 */

			// N
			if (row > 0) {
				obj.neighbors.push(prey[row - 1][col]);
				// NW
				if (col > 0) {
					obj.neighbors.push(prey[row - 1][col - 1]);
				}
				// NE
				if (col < prey[row].length - 1) {
					obj.neighbors.push(prey[row - 1][col + 1]);
				}
			}
			// W
			if (col > 0) {
				obj.neighbors.push(prey[row][col - 1]);
				// E
				if (col < prey[row].length - 1) {
					obj.neighbors.push(prey[row][col + 1]);
				}
			}
			// S
			if (row < prey.length - 1) {
				obj.neighbors.push(prey[row + 1][col]);
				// SW
				if (col > 0) {
					obj.neighbors.push(prey[row + 1][col - 1]);
				}
				// SE
				if (col < prey[row + 1].length - 1) {
					obj.neighbors.push(prey[row + 1][col + 1]);
				}
			}
		};

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		__init();
	}

	return Swarm;
});
