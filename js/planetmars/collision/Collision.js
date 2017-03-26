var planetmars = (function(pm) { 
	function Collision() {
		this.collide = true; // Static final
		this.axis = [0,0]; // en fonction du type de collision, ex.: axe normal du segment de la collision pour calculer le glissement 
		this.shape1 = [];
		this.shape2 = [];
		this.segment1 = [];
		this.segment2 = [];
		this.time = 0; // temps de collision
		this.velocity = [0,0]; 
	}
 
	pm.collision = pm.collision || {};
	
	Collision.create = function (shape1, shape2, segment1, segment2, velocity, time, axis) {
		var collision = new Collision();
		collision.shape1 = shape1;
		collision.shape2 = shape2;
		collision.segment1 = segment1;
		collision.segment2 = segment2;
		collision.velocity = velocity;
		collision.time = time;
		collision.axis = axis;
		
		return collision;
	}  
	
	pm.collision.Collision = Collision;
	
	return pm;
})(planetmars || {});
