var planetmars = (function(pm) { 
	function Bat(screen) {
		pm.lang.Sprite.call(this, screen, "Bat");
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["bat"].collisionmask.x, 
				this.screen.game.resources.sprites["bat"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["bat"].collisionmask.width, 
				this.screen.game.resources.sprites["bat"].collisionmask.height ] );
	} 
	
	Bat.prototype = new pm.lang.Sprite();
	
	Bat.prototype.onBulletCollision = function(event) {
		event.stopPropagation = true;
		
		this.screen.removeObject(this);
		this.screen.removeObject(event.bullet);
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Bat = Bat;
	
	return pm;
})(planetmars || {});
