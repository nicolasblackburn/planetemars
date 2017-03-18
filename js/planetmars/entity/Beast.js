var planetmars = (function(pm) { 
	function Beast(screen) {
		pm.lang.Sprite.call(this, screen, "Beast");
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["beast"].collisionmask.x, 
				this.screen.game.resources.sprites["beast"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["beast"].collisionmask.width, 
				this.screen.game.resources.sprites["beast"].collisionmask.height ] );
	} 
	
	Beast.prototype = new pm.lang.Sprite();
	
	Beast.prototype.onBulletCollision = function(event) {
		event.stopPropagation = true;
		
		this.screen.removeObject(this);
		this.screen.removeObject(event.bullet);
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Beast = Beast;
	
	return pm;
})(planetmars || {});
