var planetmars = (function(pm) { 
	function Worm(screen) {
		pm.lang.Sprite.call(this, screen, "Worm");
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["worm"].collisionmask.x, 
				this.screen.game.resources.sprites["worm"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["worm"].collisionmask.width, 
				this.screen.game.resources.sprites["worm"].collisionmask.height ] );
	} 
	
	Worm.prototype = new pm.lang.Sprite();
	
	Worm.prototype.onBulletCollision = function(event) {
		event.stopPropagation = true;
		
		this.screen.removeObject(this);
		this.screen.removeObject(event.bullet);
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Worm = Worm;
	
	return pm;
})(planetmars || {});
