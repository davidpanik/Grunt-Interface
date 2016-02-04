;(function() {
	'use strict';

	/*
		TODO

		Style project name
		Display sooner on adding new project
		Handle display of error messages
		Handle a non Grunt file being added
		Better display of log
		Make log stick to end
		Show loading animation
		Avoid project duplicates
		Delete project functionality
		Check npm is installed on first run?
		Store settings between session
		Style interface
		Add to GitHub
	*/

	var ControllerView = require('./controllerview')(Ractive);
	var ControllerModel = require('./controllermodel')();

	// http://stackoverflow.com/questions/28681820/ractivejs-component-nesting
	// http://docs.ractivejs.org/latest/components
	var controllerView = new ControllerView({
		el:    '#container',
		magic: true,
		data:  new ControllerModel()
	});

	function maximiseWindow() {
		var nwin = require('nw.gui').Window.get(); // Get the current window
		nwin.maximize();
	}

	maximiseWindow();
})();