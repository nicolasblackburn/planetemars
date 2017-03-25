var planetmars = (function(pm) { 
	function Collision() {
		this.collide = true; // Static final
		this.axis = [0,0]; // en fonction du type de collision, ex.: axe normal du segment de la collision pour calculer le glissement 
		this.shape1 = [];
		this.shape2 = [];
		this.time = 0; // temps de collision
		this.velocity = [0,0]; 
	}
 
	pm.collision = pm.collision || {};
	
	Collision.create = function (shape1, shape2, velocity, time, axis) {
		var collision = new pm.Collision();
		collision.shape1 = shape1;
		collision.shape2 = shape2;
		collision.velocity = velocity;
		collision.time = time;
		collision.axis = axis;
		
		return collision;
	}  
	
	pm.collision.Collision = Collision;
	
	return pm;
})(planetmars || {});
