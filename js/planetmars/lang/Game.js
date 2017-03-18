var planetmars = (function (pm, $) {

	function Game(element, options) {
		
		// options
		this.options = {};
		this.options.autoplay = options.autoplay || true;
		this.options.resources = {};
		this.options.resources.images = (options.resources && options.resources.images) || [];
		this.options.resources.maps = (options.resources && options.resources.maps) || [];
		this.options.resources.sounds = (options.resources && options.resources.sounds) || [];
		this.options.resources.sprites = (options.resources && options.resources.sprites) || [];
		this.options.init = options.init || function() {};

		// Dimensions du canvas
		this.height = 600;
		this.width = 720;
		
		// Éléments HTML
		this.containerElement = element;
		
		this.paused = true;
		
		this.afterTime = 0;
		this.beforeTime = 0;
		this.currentFrame = 0;
		this.currentTime = 0;
		this.frameRate = 0;
		this.overSleepTime = 0;
		this.timeDifference = 0;
		this.timePeriod = 0;
		this.sleepTime = 0;
		this.timeoutId = null;
		
		this.setFrameRate(50);
		
		// Ressources
		this.resources = {};
		this.resources.images = {};
		this.resources.maps = {};
		this.resources.sounds = {};
		this.resources.sprites = {};
		
		// Gestion des événements d'entrée
		this.eventBroadcaster = new pm.lang.EventBroadcaster(this);
		
		// Association des touches du clavier et des contrôles
		this.keyboardMap = new pm.lang.KeyboardMap(this);
		
		// Calculateur de dimensions;
		this.textComputationElement = document.createElement("div");
		this.textComputationElement.setAttribute("class", "compute-text");
		this.textComputationElement.style.display = "inline-block";
		this.textComputationElement.style.position = "fixed";
		this.textComputationElement.style.visibility = "hidden";
		this.textComputationElement.style.whiteSpace = "nowrap";
		this.containerElement.appendChild(this.textComputationElement);
		
		// Vues
		this.screens = [];
		this.currentScreen = null;
		
		var i, j, type, resources = [], types = ["images", "sounds", "sprites", "maps"];
		
		// Construit une liste de ressources à précharger
		for (i = 0; i < types.length; i++) {
			type = types[i];
			for (j = 0; j < this.options.resources[type].length; j++) {
				resources.push({
					type: type,
					url: this.options.resources[type][j]
				});
			}
		}
		
		var self = this;
		
		// Charge la liste de ressources
		this.loadResources(resources).done(function(loaded) {
			if (options.init && typeof options.init == "function") {
				if (self.options.autoplay) {
					self.play();
				}
				options.init.call(self);
			}
		});
	}
	
	Game.prototype.computeTextWidth = function(context, text) {
			
		var 
			self = this, 
			textProperties = ["direction", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "letterSpacing", "textDecoration", "wordBreak", "wordSpacing", "wordWrap"], 
			computedStyle = window.getComputedStyle(context);
		
		textProperties.forEach(function(propertyName) {
			self.textComputationElement.style[propertyName] = computedStyle[propertyName];
		});
		
		this.textComputationElement.innerHTML = text;
		
		return parseInt(window.getComputedStyle(this.textComputationElement).width);
		
	};
	
	Game.prototype.loadResources = function(resources) {
		var self = this;
		
		function resolve(deferred, resources, loaded, error) {
			var resource, id;
			
			if (resources.length) {
				resource = resources[0];
				
				id = resource.url.split("/").slice(-1)[0].split(".").slice(0,-1).join(".");
				
				if (resource.type == "images") {
					
					if (! self.resources.images[id]) {
						$(new Image())
							.on("abort error", function() {
								deferred.reject();
							})
							.on("load", function() {
								self.resources.images[id] = {
									id: id,
									url: resource.url,
									width: this.width,
									height: this.height,
									imageElement: this
								};
								
								loaded.push(resource.type + " " + resource.url);
								
								resolve(deferred, resources.slice(1), loaded);
							})
							.attr("src", resource.url);
					} else {
						resolve(deferred, resources.slice(1), loaded);
					}
					
				} else {
					
					if (! self.resources[resource.type] ) {
						self.resources[resource.type] = {};
					}
					
					if (! self.resources[resource.type][id]) {
						$.getJSON(resource.url)
							.fail(function(err) {
								deferred.reject();
							})
							.done(function(data) {
								var i, animations;
								
								data.id = id;
								data.url = resource.url;
								
								self.resources[resource.type][id] = data;
								
								if (resource.type == "sprites") {
									
									// Nommer les animations
									animations = {};
									
									for (i = 0; i < data.animations.length; i++) {
										animations[data.animations[i].name] = data.animations[i].sequence;
									}
									
									self.resources[resource.type][id].animations = animations;
								}
								
								loaded.push(resource.type + " " + resource.url);
								
								resolve(deferred, resources.slice(1), loaded);
							});
					} else {
						resolve(deferred, resources.slice(1), loaded);
					}
				}
				
			} else {
				deferred.resolve(loaded);
			}
		}
		
		return $.Deferred(function(deferred) {
			resolve(deferred, resources, [], null);
		}).promise();
	};
	
	Game.prototype.paint = function() {
		if (this.currentScreen && this.currentScreen.paint) {
			this.currentScreen.paint();
		}
	};
	
	Game.prototype.pause = function() {
		var i, currentScreen;
		
		this.paused = true;
		this.eventBroadcaster.paused = true;
		
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	};
	
	Game.prototype.play = function() {
		var self = this, i, currentScreen;
		
		this.paused = false;
		this.eventBroadcaster.paused = false;
		
		this.beforeTime = new Date().getTime();
		this.sleepTime = 0;
		
		function update() {
			if (! self.paused ) {
				
				self.run();
				
				self.currentFrame++;
				self.currentTime += self.timePeriod;
				
				self.timeDifference = new Date().getTime() - self.beforeTime;
				self.sleepTime = self.timePeriod - self.timeDifference;
				
				if (self.sleepTime <= 0) {
					self.sleepTime = 2;
				} 
				
				self.beforeTime = new Date().getTime();
				clearTimeout(this.timeoutId);
				this.timeoutId = setTimeout(update, self.sleepTime);
			}
		}
		
		this.timeoutId = setTimeout(update);
	};
	
	Game.prototype.processEvents = function() {
		
		this.eventBroadcaster.processEvents();
		
	};
	
	Game.prototype.removeState = function(state) {
	  var i;
	  
	  for (i = 0; i < this.states.length; i++) {
	    if (this.states[i] === state) {
	      this.states.splice(i,1);
	    }
	  }
		
		return this;
	};
	
	Game.prototype.run = function() {
		this.processEvents();
		
		this.update();
		
		this.paint();
	};
	
	Game.prototype.setFrameRate = function(val) {
		this.frameRate = val;
		this.timePeriod = 1000 / this.frameRate;
	};
	
	Game.prototype.setScreen = function(id) {
		if (this.currentScreen) {
			this.eventBroadcaster.removeListener(this.currentScreen);
			
			this.currentScreen.hide();
			
			if (this.currentScreen.tearDown) {
				this.currentScreen.tearDown();
			}
		}
		
		this.currentScreen = this.screens[id];
		this.screens[id].show();
		
		this.eventBroadcaster.addListener(this.currentScreen);
	};
	
	Game.prototype.update = function() {
		if (this.currentScreen && this.currentScreen.update) {
			this.currentScreen.update();
		}
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.Game = Game;
	
	return pm;
})(planetmars || {}, jQuery);
