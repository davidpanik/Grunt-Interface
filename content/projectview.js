;(function() {
	'use strict';

	module.exports = function(Ractive) {
		var ProjectModel = require('./projectmodel')();

		var ProjectView = Ractive.extend({
			template: '#project_template',

			oninit: function(options) {
				var projectModel = new ProjectModel();

				projectModel.loadGruntFile(this.get('path'))
				.then(function() {
					projectModel.writeLog('Finished loading');
				});

				this.set('model', projectModel);

				this.on('runNpm', function() {
					if (this.get('model').state === 'loaded') {
						this.get('model').npmInstall();
					}
				});

				this.on('runTask', function(e, task) {
					if (this.get('model').state === 'loaded') {
						this.get('model').runTask(task);
					}
				});

				this.on('delete', function() {
					if (this.get('model').state === 'loaded') {
						this.get('model').delete();
					}
				});
			}
		});

		return ProjectView;
	};
})();