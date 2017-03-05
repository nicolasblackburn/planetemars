var planetmars = (function(pm) { 
	function NoCollision() {
		this.collide = false; // Static final
	}
 
	pm.collision = pm.collision || {};
	
	pm.collision.NoCollision = NoCollision;
	
	return pm;
})(planetmars || {});
