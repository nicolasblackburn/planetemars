var planetmars = (function(pm) { 
	function Crab(screen) {
		pm.lang.Sprite.call(this, screen);

		this.type = "Crab";
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["crab"].collisionmask.x, 
				this.screen.game.resources.sprites["crab"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["crab"].collisionmask.width, 
				this.screen.game.resources.sprites["crab"].collisionmask.height ] );
		
		this.animated = true;
		this.currentAnimation = "crab";

		var i, animations;
		animations = this.screen.game.resources.sprites["crab"].animations;
		for (i = 0; i < animations.length; i++) {
			this.animations[animations[i].name] = animations[i].sequence;
		}
	} 
	
	Crab.prototype = new pm.lang.Sprite();
	
	Crab.prototype.onBulletCollision = function(event) {
		event.stopPropagation = true;
		
		this.screen.removeObject(this);
		this.screen.removeObject(event.bullet);
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Crab = Crab;
	
	return pm;
})(planetmars || {});
