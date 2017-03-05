var planetmars = (function(pm, $) { 
	function Tile(id, collisionMask, terrain) {
		this.id = id;

		this.collisionMask = collisionMask;
		
		this.terrain = terrain;
	}
 
	pm.lang = pm.lang || {};
	
	pm.lang.Tile = Tile;
	
	return pm;
})(planetmars || {});
