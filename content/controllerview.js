;(function() {
	'use strict';

	module.exports = function(Ractive) {
		var ProjectView = require('./projectview')(Ractive);

		var ControllerView = Ractive.extend({
			template: '#controller_template',
			components: {
				project: ProjectView
			},
			oninit: function(options) {
				var self = this;

				window.ondragover = function(e) { e.preventDefault(); return false; };
				window.ondrop = function(e) {
					e.preventDefault();

					self.get().add(e.dataTransfer.files[0].path);

					return false;
				};
			}
		});

		return ControllerView;
	};
})();