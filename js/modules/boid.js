define([], function() {
	function Boid() {
		this.position;
		this.velocity;

		this.applyVelocity = function (v, t) {
			var v2 = v.clone();
			v2.multiplyScalar(t);
			this.position.add(v2);
		};

		this.throttleSpeed = function (maxSpeed) {
			if (this.velocity.lengthSq() > maxSpeed * maxSpeed) {
				this.velocity.normalize();
				this.velocity.multiplyScalar(maxSpeed);
			}
		};
	}
	return Boid;
});
