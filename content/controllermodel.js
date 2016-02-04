;(function() {
	'use strict';

	module.exports = function() {
		var ControllerModel = function() {
			this.projects = [];
			this.empty = true;

			return this;
		};

		ControllerModel.prototype.add = function(path) {
			console.log('PROCESSING...');

			var targetFile = path.substring(path.lastIndexOf('\\') + 1);

			if (targetFile.toLowerCase() !== 'gruntfile.js') {
				alert('Not a grunt file');
				return false;
			}

			this.empty = false;

			this.projects.push(path);

			return this;
		};

		return ControllerModel;
	};
})();