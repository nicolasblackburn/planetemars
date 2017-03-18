var planetmars = (function(pm) { 
	function Bullet(screen) {
		pm.lang.Sprite.call(this, screen, "Bullet");
		
		this.MAX_VELOCITY = 6;
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["bullet"].collisionmask.x, 
				this.screen.game.resources.sprites["bullet"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["bullet"].collisionmask.width, 
				this.screen.game.resources.sprites["bullet"].collisionmask.height ] );
	}
	
	Bullet.prototype = new pm.lang.Sprite();
	
	Bullet.prototype.onBorderCollision = function(event) {
	  this.screen.removeObject(this);
	};
	
	Bullet.prototype.setDirection = function(value) {
		this.direction = value;
		
		if (this.direction == "up" || this.direction == "down") {
			this.spriteIndex = "bullet-vertical-00";
		} else {
			this.spriteIndex = "bullet-horizontal-00";
		}
		
		switch (this.direction) {
			case "right":
				this.velocity = [this.MAX_VELOCITY, 0];
				break;
			case "left":
				this.velocity = [-this.MAX_VELOCITY, 0];
				break;
			case "up":
				this.velocity = [0, -this.MAX_VELOCITY];
				break;
			case "down":
				this.velocity = [0, this.MAX_VELOCITY];
				break;
		}
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Bullet = Bullet;
	
	return pm;
})(planetmars || {});
