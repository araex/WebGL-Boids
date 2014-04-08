define([
	'underscore',
	'modules/swarm',
	'threejs',
	'detector',
	'stats',
	'orbitcontrols'
], function (_, Swarm, THREE, Detector, Stats, OrbitControls) {
	if (!Detector.webgl) Detector.addGetWebGLMessage();

	var container, stats;

	var camera, scene, renderer, swarm, clock;

	init();
	animate();

	function init() {

		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 200;
		controls = new THREE.OrbitControls(camera);

		scene = new THREE.Scene();

		var light, object;

		scene.add(new THREE.AmbientLight(0x404040));

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0, 1, 0);
		scene.add(light);

		swarm = new Swarm();
		var geometry = new THREE.SphereGeometry(swarm.preySize, 20, 10);
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0x37a635,
			transparent: true,
			opacity: 0.5
		});
		var boidMesh = new THREE.Mesh(geometry, material);

		_.each(swarm.getPrey(), function (element) {
			var object = boidMesh.clone();
			object.position = element.position;
			scene.add(object);
		});

		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);

		//

		window.addEventListener('resize', onWindowResize, false);

		clock = new THREE.Clock();

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	//

	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();
	}

	function render() {
		var deltaT = clock.getDelta();

		swarm.update(deltaT);

		renderer.render(scene, camera);

	}
});