define([
    'modules/boid',
    'threejs',
    'underscore'
], function (Boid, THREE, _) {
    Predator.prototype = new Boid();

    /* constructor */
    function Predator(pos) {
        var self = this;

        // public vars
        self.target;

        // state variables
        var deltaT;
        var swarm;
        var vectorToTarget;

        self.update = function (_swarm, _deltaT) {
            deltaT = _deltaT;
            swarm = _swarm;

            if(self.target === null || vectorToTarget.lengthSq() < swarm.killRadius * swarm.killRadius){
                self.target = __pickNewTarget();
            }
            __calcVelocity();

            self.throttleSpeed(swarm.predatorMaxSpeed);
            self.applyVelocity(self.velocity, deltaT);
        };

        var __pickNewTarget = function () {
            return swarm.getPrey()[getRandomInt(0,swarm.getPrey().length-1)];
        };

        var __calcVelocity = function () {
            var velocityUpdate = new THREE.Vector3();
            vectorToTarget.subVectors(self.target.position, self.position);
            velocityUpdate.add(vectorToTarget);
            velocityUpdate.multiplyScalar(swarm.preyAcceleration * swarm.predatorAcceleration * deltaT);
            self.velocity.add(velocityUpdate);
        };

        var __init = function () {
            self.position = pos;
            self.target = new THREE.Vector3();
            self.velocity = new THREE.Vector3();
            vectorToTarget = new THREE.Vector3();
        };

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        __init();
    }

    return Predator;
});
