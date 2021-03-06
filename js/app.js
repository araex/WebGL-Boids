define([
	'underscore',
	'modules/swarm',
	'threejs',
	'detector',
	'stats',
	'orbitcontrols',
	'datgui'
], function(_, Swarm, THREE, Detector, Stats, OrbitControls, dat) {
	if (!Detector.webgl) Detector.addGetWebGLMessage();

	// THREE & GUI
	var camera, scene, renderer, clock, stats, gui, container;

	// simulation
	var swarm, meshes = [];

	init();
	animate();

	function init() {
		prepareDom();
		initCamera();
		initScene();
		initRenderer();
		initStats();
		initGui();

		window.addEventListener('resize', onWindowResize, false);
		clock = new THREE.Clock();
	}

	function prepareDom() {
		container = document.createElement('div');
		document.body.appendChild(container);
	}

	function initCamera() {
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 300;
		controls = new THREE.OrbitControls(camera);
	}

	function initScene() {
		scene = new THREE.Scene();
		scene.add(new THREE.AmbientLight(0x404040));
		var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(0, 1, 0);
		scene.add(directionalLight);

		swarm = new Swarm();
		var geometryPrey = new THREE.SphereGeometry(swarm.preySize, 20, 10);
		var materialPrey = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0x37a635,
			transparent: true,
			opacity: 0.5
		});

		var materialPredator= new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0xa83636,
			transparent: true,
			opacity: 0.5
		});
		var geometryPredator= new THREE.SphereGeometry(swarm.predatorSize, 20, 10);

		var meshPrey = new THREE.Mesh(geometryPrey, materialPrey);
		var meshPradator = new THREE.Mesh(geometryPredator, materialPredator);

		_.each(swarm.getPrey(), function(element) {
			var object = meshPrey.clone();
			object.position = element.position;
			scene.add(object);
			meshes.push(object);
		});

		_.each(swarm.getPredators(), function(element) {
			var object = meshPradator.clone();
			object.position = element.position;
			scene.add(object);
		});
	}

	function initRenderer() {
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
	}

	function initStats() {
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);
	}

	function initGui() {
		gui = new window.dat.GUI();
		gui.add(swarm, 'simulationSpeed', 0, 2);
		gui.add(swarm, 'preyDistance', 0, 20);
		gui.add(swarm, 'preyMaxSpeed', 0, 100);
		gui.add(swarm, 'preyAcceleration', 0, 5);
		gui.add(swarm, 'preyCenterForce', -0.002, 0.002);
		gui.add(swarm, 'preyAttractForce', -10, 30);
		gui.add(swarm, 'preyRepelForce', -60, 20);
		gui.add(swarm, 'predatorAcceleration', 0, 10);
		gui.add(swarm, 'predatorMaxSpeed', 0, 200);
		gui.add(swarm, 'killRadius', 5, 30);
		gui.add(swarm, 'fearRadius', 10, 100);
		gui.add(swarm, 'fearForce', -800000, 0);

		var colorWrapper = {
			color: '#37a635'
		};
		var colorController = gui.addColor(colorWrapper, 'color');
		colorController.onChange(function(colorValue) {
			var colorObject = new THREE.Color(colorValue);
			colorObject.setStyle(colorValue);
			_.each(meshes, function(obj) {
				obj.material.emissive = colorObject;
			});
		});
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

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
