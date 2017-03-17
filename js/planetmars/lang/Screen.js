var planetmars = (function(pm) { 
	function Screen(game, domElement) {
		this.game = game;
		this.listeners = [];
		this.screen = null;
		
		if (domElement) {
			this.bindDomElement(domElement);
		}
	} 
	
	Screen.prototype.addListener = function(listener) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener) {
				return;
			}
		}
		
		this.listeners.push(listener);
	};
	
	Screen.prototype.bindDomElement = function(domElement) {
		this.screen = $(domElement)
            .remove()
            .appendTo(game.containerElement);
        
        this.hide();
        
        return this;
	};
	
	Screen.prototype.dispatchEvent = function(event) {
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
		
	Screen.prototype.hide = function() { 
		if (this.screen) {
			this.screen.addClass("hidden");
		}
        
        return this;
	};
	
	Screen.prototype.onKeyDown = function(event) { 
		this.dispatchEvent(event);
	};
	
	Screen.prototype.onKeyUp = function(event) { 
		this.dispatchEvent(event);
	};
	
	Screen.prototype.onMouseDown = function(event) { 
		this.dispatchEvent(event);
	};
	
	Screen.prototype.onMouseUp = function(event) { 
		this.dispatchEvent(event);
	};
	
	Screen.prototype.onMouseMove = function(event) { 
		this.dispatchEvent(event);
	};
	
	Screen.prototype.removeListener = function(listener) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] == listener) {
				this.listeners.splice(i, 1);
				break;
			}
		}
	};
		
	Screen.prototype.show = function() { 
		if (this.screen) {
			this.screen.removeClass("hidden");
		}
        
        return this;
	};
		
	Screen.prototype.paint = function() { };
	
	Screen.prototype.update = function() { };
	
	pm.lang = pm.lang || {};
	
	pm.lang.Screen = Screen;
	
	return pm;
})(planetmars || {});
