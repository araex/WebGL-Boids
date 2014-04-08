define([
	'modules/prey',
	'threejs',
	'underscore'
], function (Prey, THREE, _) {
	/* constructor */
	function Swarm() {
		var self = this;

		// config
		self.preyCenterForce = 0.0002;
		self.preySize = 0.5;
		self.preyDistance = 2;
		self.preyAttract = 2;
		self.preyRepel = -5;
		self.preyAcceleration = 0.5;
		self.preyMaxSpeed = 10;
		var INIT_ROW_COUNT = 40;
		var INIT_COL_COUNT = 40;

		// private vars
		var prey = [];
		var flatPrey;

		self.update = function (deltaT) {
			_.each(flatPrey, function (element) {
				element.update(self, deltaT);
			});
		};

		self.getPrey = function () {
			return flatPrey;
		};

		var __init = function () {
			__initPrey();
			__setupNeighbors();
		};

		var __initPrey = function () {
			var i, j;
			for (i = 0; i < INIT_ROW_COUNT; i++) {
				prey[i] = [];
				for (j = 0; j < INIT_COL_COUNT; j++) {
					var pos = new THREE.Vector3(i * self.preyDistance, getRandomInt(25, 50), j * self.preyDistance);
					prey[i][j] = new Prey(pos);
				}
			}
			flatPrey = _.flatten(prey);
		};

		var __setupNeighbors = function () {
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