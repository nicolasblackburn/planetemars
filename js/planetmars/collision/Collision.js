var planetmars = (function(pm) { 
	function Collision() {
		this.collide = true; // Static final
		this.axis = [0,0]; // axe normal de la collision
		this.shape1 = [];
		this.shape2 = [];
		this.time = 0; // temps de collision
		this.velocity = [0,0]; 
	}
 
	pm.collision = pm.collision || {};
	
	pm.collision.Collision = Collision;
	
	return pm;
})(planetmars || {});
