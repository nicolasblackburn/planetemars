var planetmars = (function(pm) { 
	function MapCollisionEvent(collision, source) {
		
		this.type = "MapCollision";
		this.collision = collision;
		this.iterationCount = 0;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.MapCollisionEvent = MapCollisionEvent;
	
	return pm;
})(planetmars || {});
