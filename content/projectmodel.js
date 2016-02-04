;(function() {
	'use strict';

	module.exports = function() {
		var stream = require('stream');
		var childProcess = require('child_process');
		var q = require('q');

		var ProjectModel = function(name) {
			this.name = name || '';
			this.tasks = [];
			this.log = [];
			this.grunt = require('grunt');
			this.loadedModule = null;
			this.targetFile = '';
			this.basePath = '';
			this.state = 'loading';
			this.stream = new stream.Writable();
			this.stream._write = (function(chunk, encoding, done) {
				this.log.push(chunk.toString());

				console.log('> ' + chunk.toString());

				done();
			}).bind(this);

			return this;
		};

		ProjectModel.prototype.delete = function() {
			if (!confirm('Are you sure you want to delete ' + this.name + '?')) {
				this.writeLog('Cancelled delete');
				return false;
			}

			alert('TODO');
			// TODO
		};

		ProjectModel.prototype.loadGruntFile = function(path) {
			var deferred = q.defer();

			this.writeLog('Loading ' + path);
			this.targetFile = path.substring(path.lastIndexOf('\\') + 1);
			this.basePath   = path.substring(0, path.lastIndexOf('\\'));

			if (this.targetFile.toLowerCase() !== 'gruntfile.js') {
				this.writeLog('Not a grunt file');
				return false;
			}

			this.npmInstall()
			.then((function() {
				deferred.resolve();
			}).bind(this));

			this.loadedModule = require(path); // Import the gruntfile

			this.grunt.file.setBase(this.basePath); // Set the filepath to be where the gruntfile was loaded from

			this.grunt.log.options.outStream = this.stream; // Make grunt use our custom stream

			this.loadedModule(this.grunt); // Run the loaded gruntfile

			this.parseTasks();

			this.state = 'loaded';

			return deferred.promise;
		};

		ProjectModel.prototype.parseTasks = function() {
			this.writeLog('Parsing available tasks');

			this.tasks = [];

			for (var task in this.grunt.task._tasks) {
				if (!this.grunt.task._tasks[task].meta.filepath) {
					this.tasks.push(task);
				}
			}

			return this;
		};

		ProjectModel.prototype.runTask = function(task) {
			var deferred = q.defer();

			this.writeLog('Running task ' + task);

			this.grunt.tasks([task], {}, function() {
				deferred.resolve();
			});

			return deferred.promise;
		};

		ProjectModel.prototype.npmInstall = function() {
			var deferred = q.defer();

			this.writeLog('Running npm install');

			var runNpm = childProcess.exec('npm install', { cwd: this.basePath }, (function (err, stdout, stderr) {
				if (err) {
					this.writeLog(err.stack);
					this.writeLog('Error code: ' + err.code);
					this.writeLog('Signal received: ' + err.signal);
				}

				this.writeLog(stdout);
				this.writeLog(stderr);

				deferred.resolve();
			}).bind(this));

			runNpm.on('exit', (function (code) {
				this.writeLog('Child process exited with exit code ' + code);

			}).bind(this));

			return deferred.promise;
		};

		ProjectModel.prototype.writeLog = function(str) {
			this.stream.write(str);

			return this;
		};

		return ProjectModel;
	};
})();