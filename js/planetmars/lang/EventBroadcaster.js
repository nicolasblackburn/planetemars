var planetmars = (function(pm) { 
		
	function EventBroadcaster(game) {
	  this.game = game;
		this.element = null;
		
		this.eventQueue = [];
		this.keyStates = {};
		this.keyStack = [];

		this.listeners = [];
		
		this.paused = false;
		
		this.setElement(game.containerElement);
	} 
	
	EventBroadcaster.prototype.addListener = function(listener) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener) {
				return;
			}
		}
		
		this.listeners.push(listener);
	};
	
	// Notifie les écouteurs d'événements d'un nouvel événement
	EventBroadcaster.prototype.dispatchEvent = function(event) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i]["on"+event.type]) {
				this.listeners[i]["on"+event.type](event);
				
				if (event.stopPropagation) {
					break;
				}
			}
		}
	};
	
	EventBroadcaster.prototype.setElement = function(element) {
		var self = this;
		
		this.element = element;
		
		// Attacher les écouteurs d'événements
		
		$(this.element).on("mousedown", function(nativeEvent) {
			if (! self.paused ) {
				if (!nativeEvent) {
					nativeEvent = window.event;
				}
				self.postMouseEvent(nativeEvent, this);
			}
		});
		
		$(this.element).on("mousemove", function(nativeEvent) {
			if (! self.paused ) {
				if (!nativeEvent) {
					nativeEvent = window.event;
				}
				self.postMouseEvent(nativeEvent, this);
			}
		});
		
		$(this.element).on("mouseup", function(nativeEvent) {
			if (! self.paused ) {
				if (!nativeEvent) {
					nativeEvent = window.event;
				}
				self.postMouseEvent(nativeEvent, this);
			}
		});
		
		$(window).on("keydown", function(nativeEvent) {
			if (!self.paused) {
				if (!nativeEvent) {
					nativeEvent = window.event;
				}
				self.postKeyEvent(nativeEvent, this);
			}
			
		});
		
		$(window).on("keyup", function(nativeEvent) {
			if (!self.paused) {
				if (!nativeEvent) {
					nativeEvent = window.event;
				}
				self.postKeyEvent(nativeEvent, this);
			}
		});
	};
	
	// Ajoute un nouvel événement clavier natif dans la queue 
	EventBroadcaster.prototype.postKeyEvent = function(nativeEvent, source) {
		var event, pos;
		
		event = new pm.event.KeyEvent(nativeEvent, this.keyStates, this.keyStack, source);
		
		if (event.type == "KeyDown") {
			
			if (typeof this.keyStates[event.keyCode] == "undefined") {
				
				this.keyStates[event.keyCode] = {};
				this.keyStates[event.keyCode].isDown = true;
				this.keyStates[event.keyCode].isPressed = true;
				this.keyStates[event.keyCode].isReleased = false;
				this.keyStack.push(event.keyCode);
				this.eventQueue.push(event);
				
			} else if (! this.keyStates[event.keyCode].isDown) {
				
				this.keyStates[event.keyCode].isDown = true;
				this.keyStates[event.keyCode].isPressed = true;
				this.keyStates[event.keyCode].isReleased = false;
				this.keyStack.push(event.keyCode);
				this.eventQueue.push(event);
				
			}
			
		} else if (event.type == "KeyUp") {
		
			if (typeof this.keyStates[event.key] == "undefined") {
				this.keyStates[event.keyCode] = {};
				this.keyStates[event.keyCode].isDown = false;
				this.keyStates[event.keyCode].isPressed = false;
				this.keyStates[event.keyCode].isReleased = true;
		
				pos = this.keyStack.indexOf(event.keyCode);
				
				if (pos >= 0) {
					this.keyStack.splice(pos, 1);
				}
			
				this.eventQueue.push(event);
				
			} else if (this.keyStates[event.keyCode].isDown) {
				this.keyStates[event.keyCode].isDown = false;
				this.keyStates[event.keyCode].isPressed = false;
				this.keyStates[event.keyCode].isReleased = true;
		
				pos = this.keyStack.indexOf(event.keyCode);
				
				if (pos >= 0) {
					this.keyStack.splice(pos, 1);
				}
			
				this.eventQueue.push(event);
			}
				
		}
	};
	
	// Ajoute un nouvel événement souris natif dans la queue 
	EventBroadcaster.prototype.postMouseEvent = function(nativeEvent, source) {
		var event = new pm.event.MouseEvent(nativeEvent, source);
		
		if (event.type) {
			this.eventQueue.push(event);
		}
	};
	
	// Traite la queue d'événements
	EventBroadcaster.prototype.processEvents = function() {
		
		var i, key, event;
		
		while (this.eventQueue.length) {
			
			event = this.eventQueue.shift();
			
			switch (event.type) {
				case "KeyDown":
				case "KeyUp":
				
					this.dispatchEvent(event);
					
					break;
					
				case "MouseDown":
				case "MouseUp":
				case "MouseMove":
				
					this.dispatchEvent(event);
					
					break;
			}
			
		}
		
		for (key in this.keyStates) {
			this.keyStates[key].isPressed = false;
			this.keyStates[key].isReleased = false;
		}
		
	};
	
	EventBroadcaster.prototype.removeListener = function(listener) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener) {
				this.listeners.splice(i, 1);
				break;
			}
		}
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.EventBroadcaster = EventBroadcaster;
	
	return pm;
})(planetmars || {});
