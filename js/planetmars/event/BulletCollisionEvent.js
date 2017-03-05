var planetmars = (function(pm) { 
	function BulletCollisionEvent(bullet, source) {
		
		this.type = "BulletCollision";
		this.bullet = bullet;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.BulletCollisionEvent = BulletCollisionEvent;
	
	return pm;
})(planetmars || {});
