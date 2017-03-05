var planetmars = (function(pm, $) {
	var util = {};

	util.arrayCopy = function(a) {
		var b = [], i;
		for (i = 0; i < a.length; i++) {
			b[i] = a[i];
		}
		return b;
	};

	util.arrayRepeat = function(a, n) {
		var b = [];
		while (n > 0) {
			b.concat(a);
			n--;
		}
		return b;
	};

	util.floatEqual = function(a, b) {
		//return a == b;
		a = Math.abs(a);
		b = Math.abs(b);
		d = Math.abs(a - b);
		if (a == b) {
			return true;
		} else {
			return d / (a + b) < 0.00000000001;
		}
	};
	
	util.loadImages = function(images) {
		return $.Deferred(function(deferred) {
			var loaded = [], errors = [], i, src;
			
			for (i = 0; i < images.length; i++) {
				src = images[i];
				$(new Image())
					.on("abort error", function() {
						errors.push(src);
						if (errors.length + loaded.length >= images.length) {
							if (errors.length) {
								deferred.reject(errors, loaded);
							} else {
								deferred.resolve(loaded);
							}
						}
					})
					.load(function() {
						loaded.push(src);
						if (errors.length + loaded.length >= images.length) {
							if (errors.length) {
								deferred.reject(errors, loaded);
							} else {
								deferred.resolve(loaded);
							}
						}
					})
					.attr("src", src);
			}
		}).promise();
	};
	
	util.loadLevels = function(requests, seedData) {
		var seed = $.Deferred(),
		finalPromise;

		finalPromise = requests.reduce(function(promise, request) {
			return promise.pipe(function(input) {
				return $.getJSON(request).pipe(function(json) {
					if (typeof input == "undefined") {
						return [json];
					} else {
						input.push(json);
						return input;
					}
				});
			});
		}, seed.promise());

		// Start the chain with the provided seed data
		seed.resolve(seedData);

		return finalPromise;
	};
	
	util.loadJSON = function(requests, seedData) {
		var seed = $.Deferred(),
		finalPromise;

		finalPromise = requests.reduce(function(promise, request) {
			return promise.pipe(function(input) {
				return $.getJSON(request).pipe(function(json) {
					if (typeof input == "undefined") {
						return [json];
					} else {
						input.push(json);
						return input;
					}
				});
			});
		}, seed.promise());

		// Start the chain with the provided seed data
		seed.resolve(seedData);

		return finalPromise;
	};

	/*
	function objectExtend(base, members) {
		var member;
		for (member in members) {
			base[member] = members[member];
		}
		return base;
	}
	*/
	
	util.xdn = function(x, n) {
		var i, y;
		
		for (i = 0, y = 0; i < x; i ++) {
			y += parseInt(Math.random() * n) + 1;
		}
		
		return y;
	};
	
	pm.util = pm.util || {};
	
	var prop;
	for (prop in util) {
		pm.util[prop] = util[prop];
	}
	
	return pm;
})(planetmars || {}, jQuery);
