var planetmars = (function(pm) { 
	function Crab(screen) {
		pm.lang.Sprite.call(this, screen, "Crab");
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["crab"].collisionmask.x, 
				this.screen.game.resources.sprites["crab"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["crab"].collisionmask.width, 
				this.screen.game.resources.sprites["crab"].collisionmask.height ] );
		
		randomDir(this);
	} 
	
	Crab.prototype = new pm.lang.Sprite();
	
	Crab.prototype.onBulletCollision = function(event) {
		event.stopPropagation = true;
		
		this.screen.removeObject(this);
		this.screen.removeObject(event.bullet);
	};
	
	Crab.prototype.onMapCollision = function(event) {
		if (! event.collision.axis) {
			return;
		}
		
		var axis, box, future, interv1, interpos1, mov, newvelocity, newposition, 
			oldposition, oldvelocity, shape;
		
		oldposition = pm.vector.subtract(
			this.calculatedPosition, 
			this.calculatedVelocity );
		
		oldvelocity = this.calculatedVelocity;
			
		interv1 = pm.vector.scale(
			event.collision.time, 
			this.calculatedVelocity );
			
		interpos1 = pm.vector.add(
			oldposition, 
			interv1 );
		
		axis = pm.vector.orthogonalVector(event.collision.axis);

		newvelocity = pm.vector.subtract(
			pm.vector.projectOnto( oldvelocity, axis ),
			pm.vector.projectOnto( interv1, axis ) );

		newposition = pm.vector.add(interpos1, newvelocity);;

		this.calculatedVelocity = newvelocity;
		this.calculatedPosition = newposition;
				
	};
	
	Crab.prototype.onRoomEnter = function(event) {
		randomDir(this);
	};
	
	Crab.prototype.update = function() {
	  
	  pm.lang.Sprite.prototype.update.call(this);
		if (this.position[0] < -this.collisionShape[0][0]) {
			this.position[0] = -this.collisionShape[0][0];
		}
		
		if (this.position[0] >= this.screen.viewportWidth - this.collisionShape[1][0]) {
			this.position[0] = this.screen.viewportWidth - this.collisionShape[1][0];
		}
		
		if (this.position[1] < -this.collisionShape[0][1]) {
			this.position[1] = -this.collisionShape[0][1];
		}
		
		if (this.position[1] >= this.screen.viewportHeight - this.collisionShape[1][1] - 48 + this.collisionShape[0][1]) {
			this.position[1] = this.screen.viewportHeight - this.collisionShape[1][1] - 48 + this.collisionShape[0][1];
		}
		
		if (this.changeDirectionCountDown) {
			this.changeDirectionCountDown--;
		} else {
			randomDir(this);
		}
	}
	
	function randomDir(self) {
		switch (Math.floor(Math.random() * 4)) {
			case 0:
				self.velocity = [-1,0];
				break;
			
			case 1:
				self.velocity = [0,1];
				break;
				
			case 2:
				self.velocity = [1,0];
				break;
				
			case 3:
				self.velocity = [0,-1];
		}
		self.changeDirectionCountDown = 50;
	}
 
	pm.entity = pm.entity || {};
	
	pm.entity.Crab = Crab;
	
	return pm;
})(planetmars || {});
