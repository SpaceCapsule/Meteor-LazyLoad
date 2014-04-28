/*

Meteor-LazyLoad, by RaiX

Credit goes to @awatson1978 and @zeroasterisk

MIT License

 */
LazyLoad = (function() {
	var self = this;

	// Init queryString
	self.queryString = (function() {
		var s1 = location.search.substring(1, location.search.length).split('&'),
		r = {}, s2, i;
		for (i = 0; i < s1.length; i += 1) {
			s2 = s1[i].split('=');
			if (s2.length > 1)
				r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]).replace(/\/$/, "");
		}
		return r;
	})();

	// Rig script dependency loading
	self._dependencyTree = {};
	self._loadedFiles = {};

	// eg. addFile('android-2.6.0', '/cordova-2.6.0/android.js')
	self.addFile = function(filePaths, dependencies) {
		// containing all the files and plugins to load
		// {
		//		'android-2.6.0': ['/cordova-2.6.0/android.js']
		//		'ios-2.6.0': ['/cordova-2.6.0/ios.js']
		// }
		if (typeof filePaths === 'string')
			filePaths = [filePaths];

		if (typeof dependencies === 'string')
			dependencies = [dependencies];

		if (!Match.test(filePaths, [String]) || !Match.test(dependencies, [String]))
			throw new Error('LazyLoad.addFile expects filePaths and dependencies to be either string or array of strings');


		// Iterate through dependencies
		_.each(dependencies, function(dependencies) {
			// Prepare dependencyTree
			if (typeof self._dependencyTree[dependencies] === 'undefined')
				self._dependencyTree[dependencies] = [];

			// Iterate through filePaths
			_.each(filePaths, function(filePath) {
				self._dependencyTree[dependencies].push(filePath);
			});
		});

	};

	// eg. require(queryString['cordova-dependency']);
	self.require = function(dependency, onReady) {
		var files = (self._dependencyTree[dependency] || []);
		var numFilesToLoad = 0;

		if (typeof onReady !== 'function')
			onReady = function() {};

		if (files.length) {
			var head = document.getElementsByTagName('head').item(0);
			var numFilesLoaded = 0;

			while (files.length) {
				// Append script load to html
				var fileToLoad = files.shift();
				if (typeof self._loadedFiles[fileToLoad] === 'undefined') {
					// File not yet loaded
					numFilesToLoad++;

					self._loadedFiles[fileToLoad] = false;
					var script = document.createElement('script');
					script.onload = function() {
						self._loadedFiles[fileToLoad] = true;
						numFilesLoaded++;
						// If all files are loaded then callback
						if (numFilesToLoad == numFilesLoaded)
							onReady();
					};
					script.type = 'text/javascript';
					script.src = fileToLoad;
					head.appendChild(script);
				}
			}
		}
		// All files allready loaded
		if (numFilesToLoad === 0)
			onReady();
	};

	return self;
})();