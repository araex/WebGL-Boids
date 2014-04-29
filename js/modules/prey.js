define([
	'modules/boid',
	'threejs',
	'underscore'
], function (Boid, THREE, _) {
	Prey.prototype = new Boid();

	/* constructor */
	function Prey(pos) {
		var self = this;

		// public vars
		self.neighbors;

		// private vars
		var swarm;
		var deltaT;

		self.update = function (_swarm, _deltaT) {
			swarm = _swarm;
			deltaT = _deltaT;

			var attraction = __calcNeighbourAttraction();
			__applyCenterForce(attraction);
			__applyPredatorAvoidance(attraction);
			__updateVelocity(attraction);
			self.applyVelocity(self.velocity, deltaT);
		};

		var __calcNeighbourAttraction = function () {
			var attraction = new THREE.Vector3(0, 0, 0);
			var i;

			_.each(self.neighbors, function (neighbor) {
				var distance = new THREE.Vector3(0, 0, 0);
				distance.subVectors(neighbor.position, self.position);

				// using the squared length to increase performance
				if (distance.lengthSq() >= swarm.preyDistance * swarm.preyDistance) {
					// too far away, go towards it
					attraction.add(distance.multiplyScalar(swarm.preyAttractForce));
				} else {
					// to close, go away
					attraction.add(distance.multiplyScalar(swarm.preyRepelForce));
				}
			});

			return attraction;
		};

		var __applyPredatorAvoidance = function (attraction){
			var distanceToPredator = new THREE.Vector3();
			_.each(swarm.getPredators(), function (predator) {
				distanceToPredator.subVectors(predator.position, self.position);
				if (distanceToPredator.lengthSq() < swarm.fearRadius * swarm.fearRadius){
					attraction.add(distanceToPredator.normalize().multiplyScalar(swarm.fearForce));
				}
			});
		};

		var __applyCenterForce = function (attraction) {
			var centerDistance = new THREE.Vector3(0, 0, 0);
			centerDistance.sub(self.position);
			attraction.add(centerDistance.multiplyScalar(swarm.preyCenterForce * centerDistance.lengthSq()));
		};

		var __updateVelocity = function (attraction) {
			var velocityUpdate = attraction.clone();
			velocityUpdate.multiplyScalar(swarm.preyAcceleration * deltaT);
			self.velocity.add(velocityUpdate);

			if (self.velocity.lengthSq() > swarm.preyMaxSpeed * swarm.preyMaxSpeed) {
				self.velocity.normalize();
				self.velocity.multiplyScalar(swarm.preyMaxSpeed);
			}
		};

		var __init = function () {
			self.position = pos;
			self.velocity = new THREE.Vector3(0, 0, 0);
			self.neighbors = [];
		};

		__init();
	}

	return Prey;
});
