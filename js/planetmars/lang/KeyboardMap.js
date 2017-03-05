var planetmars = (function(pm) { 
	function KeyboardMap(game) {
		this.game = game;
		
		this.keycodes = {};
	} 
	
	KeyboardMap.prototype.get = function(keycode) {
	  return this.keycodes[keycode];
	};
		
	KeyboardMap.prototype.load = function() { };
	
	KeyboardMap.prototype.save = function() { };
	
	KeyboardMap.prototype.set = function(keycode, name) { 
	  return this.keycodes[keycode] = name;
	};
	
	pm.lang = pm.lang || {};
	
	pm.lang.KeyboardMap = KeyboardMap;
	
	return pm;
})(planetmars || {});
