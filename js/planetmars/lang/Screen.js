var planetmars = (function(pm) { 
	function Screen(game) {
		this.game = game;
	} 
	
	Screen.prototype.dispatchEvent = function(event) {
		this.game.eventBroadcaster.dispatchEvent(event);
	};
		
	Screen.prototype.paint = function() { };
	
	Screen.prototype.update = function() { };
	
	pm.lang = pm.lang || {};
	
	pm.lang.Screen = Screen;
	
	return pm;
})(planetmars || {});
