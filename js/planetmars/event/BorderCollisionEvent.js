var planetmars = (function(pm) { 
	function BorderCollisionEvent(border, source) {
		
		this.type = "BorderCollision";
		this.border = border;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	BorderCollisionEvent.NORTH_BORDER = 0;
	BorderCollisionEvent.EAST_BORDER = 1;
	BorderCollisionEvent.SOUTH_BORDER = 2;
	BorderCollisionEvent.WEST_BORDER = 3;
	
	pm.event = pm.event || {};
	
	pm.event.BorderCollisionEvent = BorderCollisionEvent;
	
	return pm;
})(planetmars || {});
