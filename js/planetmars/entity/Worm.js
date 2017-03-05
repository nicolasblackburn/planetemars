var planetmars = (function(pm) { 
	function Worm(screen) {
		pm.lang.Sprite.call(this, screen);

		this.type = "Worm";
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["worm"].collisionmask.x, 
				this.screen.game.resources.sprites["worm"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["worm"].collisionmask.width, 
				this.screen.game.resources.sprites["worm"].collisionmask.height ] );
				
		this.animated = true;
		this.currentAnimation = "worm";

		var i, animations;
		animations = this.screen.game.resources.sprites["worm"].animations;
		for (i = 0; i < animations.length; i++) {
			this.animations[animations[i].name] = animations[i].sequence;
		}
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
