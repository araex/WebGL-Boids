define([], function () {
	function Boid() {
		this.position;
		this.velocity;

		this.applyVelocity = function (v, t) {
			var v2 = v.clone();
			v2.multiplyScalar(t);
			this.position.add(v2);
		};
	}
	return Boid;
});
