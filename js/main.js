require.config({
	baseUrl: 'js',
	paths: {
		threejs: 'libs/three',
		underscore: 'libs/underscore-min',
		threejs: 'libs/three',
		stats: 'libs/stats.min',
		detector: 'libs/detector',
		orbitcontrols: 'libs/orbitcontrols',
		datgui: 'libs/dat.gui.min'
	},

	shim: {
		threejs: {
			"exports": "THREE" //attaches "Backbone" to the window object
		},
		stats: {
			"exports": "Stats"
		},
		detector: {
			"exports": "Detector"
		},
		orbitcontrols: {
			"deps": ['threejs'],
			"exports": "OrbitControls"
		}
	}
});



require([
	'app'
], function (App) {

});