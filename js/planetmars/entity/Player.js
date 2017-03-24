var planetmars = (function(pm) { 
	function Player(screen) {
		pm.lang.Sprite.call(this, screen, "Player");
		
		this.MAX_VELOCITY = 1.5;
		
		this.broadcastEventEnabled = true;
		
		this.collisionShape = pm.geom.rectangle(
			[ this.screen.game.resources.sprites["player"].collisionmask.x, 
				this.screen.game.resources.sprites["player"].collisionmask.y ], 
			[ this.screen.game.resources.sprites["player"].collisionmask.width, 
				this.screen.game.resources.sprites["player"].collisionmask.height ] );

		this.direction = "down";
		this.running = false;
		this.bulletCount = 0;
		
		this.isVisible = true;
		
		this.isStunned = false;
		this.stunnedTimeout = 0;
		this.velocityBeforeStunned = [0,0];
		this.animationBeforeStunned = null;
		
		this.isBlinking = false;
		this.blinkingTimeout = 0;
	}
	
	Player.prototype = new pm.lang.Sprite();
	
	Player.prototype.blinkForNFrames = function(count) {
	   this.blinkingTimeout = count;
	   this.isBlinking = true;
	};
	
	Player.prototype.handleMovementControls = function(control) {
		switch (control) {
			case "move_left":
				this.running = true;
				this.direction = "left";
				if (this.isStunned) {
				  this.velocityBeforeStunned = [-this.MAX_VELOCITY,0];
				  this.animationBeforeStunned = "running-left";
				} else {
				  this.velocity = [-this.MAX_VELOCITY,0];
				  this.currentAnimation = "running-left";
				}
				break;
			
			case "move_down":
				this.running = true;
				this.direction = "down";
				if (this.isStunned) {
				  this.velocityBeforeStunned = [0,this.MAX_VELOCITY];
				  this.animationBeforeStunned = "running-down";
				} else {
				  this.velocity = [0,this.MAX_VELOCITY];
				  this.currentAnimation = "running-down";
				}
				break;
				
			case "move_right":
				this.running = true;
				this.direction = "right";
				if (this.isStunned) {
				  this.velocityBeforeStunned = [this.MAX_VELOCITY,0];
				  this.animationBeforeStunned = "running-right";
				} else {
				  this.velocity = [this.MAX_VELOCITY,0];
				  this.currentAnimation = "running-right";
				}
				break;
				
			case "move_up":
				this.running = true;
				this.direction = "up";
				if (this.isStunned) {
				  this.velocityBeforeStunned = [0,-this.MAX_VELOCITY];
				  this.animationBeforeStunned = "running-up";
				} else {
				  this.velocity = [0,-this.MAX_VELOCITY];
				  this.currentAnimation = "running-up";
				}
				break;
		}
	};
	
	Player.prototype.onKeyDown = function(event) {
	  
		var control = this.screen.game.keyboardMap.get(event.keyCode);
		
		this.handleMovementControls(control);
		
		if ("action_fire" == control && this.bulletCount < 3 && ! this.isStunned) {
			var bullet = new this.screen.bulletClass(this.screen);
			bullet.position = pm.util.arrayCopy(this.position);
			if (this.velocity[0] || this.velocity[1]) {
				bullet.countdown += 8;
			}
			bullet.setDirection(this.direction);
			this.bulletCount++;
			this.screen.addObject(bullet, true);
		}
	};
	
	Player.prototype.onKeyUp = function(event) {
		var control, i, found, nextControl;
		
		control = this.screen.game.keyboardMap.get(event.keyCode);
		
		switch (control) {
			case "move_left":
			case "move_down":
			case "move_right":
			case "move_up":
			
				// Cherche la dernière touche de mouvement enfoncée
			 found = false;
			 
				if (event.keyStack.length) {
					for (i = event.keyStack.length - 1; i >= 0 && ! found; i--) {
						nextControl = this.screen.game.keyboardMap.get(event.keyStack[i]);
						if (nextControl == "move_left" || nextControl == "move_down" || nextControl == "move_right" || nextControl == "move_up") {
							found = true;
						}
					}
				}	
					
				if (found) {
					this.handleMovementControls(nextControl);
					
				} else {
				
					this.running = false;
					this.currentAnimationFrame = 0;
					
					if (this.isStunned) {
					  this.velocityBeforeStunned = [0,0];
					
					  switch (this.direction) {
						  case "right":
							  this.animationBeforeStunned = "standing-right";
							  break;
							
						  case "left":
							  this.animationBeforeStunned = "standing-left";
							  break;
							
						  case "up":
							  this.animationBeforeStunned = "standing-up";
							  break;
							
						  case "down":
							  this.animationBeforeStunned = "standing-down";
							  break;
					  }
					  
					 } else {
					 
					  this.velocity = [0,0];
					
					  switch (this.direction) {
						  case "right":
							  this.currentAnimation = "standing-right";
							  break;
							
						  case "left":
							  this.currentAnimation = "standing-left";
							  break;
							
						  case "up":
							  this.currentAnimation = "standing-up";
							  break;
							
						  case "down":
							  this.currentAnimation = "standing-down";
							  break;
					  }
					 }
				}
				
				break;
		}
	};
	
	Player.prototype.onBorderCollision = function(event) {
		var lastRoomX = this.screen.roomX, lastRoomY = this.screen.roomY;
		switch (event.border) {
			case pm.event.BorderCollisionEvent.NORTH_BORDER:
			  roomCoordinates = this.screen.getTopRoomCoordinates();
			  if (false !== roomCoordinates) {
				  
				this.screen.freeRoom();
				
			    this.screen.setPlayerPosition(
			      roomCoordinates[0], 
			      roomCoordinates[1], 
			      this.position[0], 
			      this.position[1] + this.screen.viewportHeight
			    );
			  }
				break;
				
			case pm.event.BorderCollisionEvent.EAST_BORDER:
			  roomCoordinates = this.screen.getLeftRoomCoordinates();
			  if (false !== roomCoordinates) {
				  
				this.screen.freeRoom();
				
			    this.screen.setPlayerPosition(
			      roomCoordinates[0], 
			      roomCoordinates[1], 
			      this.position[0] + this.screen.viewportWidth, 
			      this.position[1]
			    );
			  }
				break;
				
			case pm.event.BorderCollisionEvent.SOUTH_BORDER:
			  roomCoordinates = this.screen.getBottomRoomCoordinates();
			  if (false !== roomCoordinates) {
				  
				this.screen.freeRoom();
				
			    this.screen.setPlayerPosition(
			      roomCoordinates[0], 
			      roomCoordinates[1], 
			      this.position[0], 
			      this.position[1] - this.screen.viewportHeight
			    );
			  }
				break;
				
			case pm.event.BorderCollisionEvent.WEST_BORDER:
			  roomCoordinates = this.screen.getRightRoomCoordinates();
			  if (false !== roomCoordinates) {
				  
				this.screen.freeRoom();
				
			    this.screen.setPlayerPosition(
			      roomCoordinates[0], 
			      roomCoordinates[1], 
			      this.position[0] - this.screen.viewportWidth, 
			      this.position[1] 
			    );
			  }
				break;
		}
		
	};
	
	Player.prototype.onBulletRemoved = function(event) {
		this.bulletCount--;
		if (this.bulletCount < 0) {
			this.bulletCount = 0;
		}
	};
	
	Player.prototype.onEnemyCollision = function(event) {
	  if (this.isStunned || this.isBlinking) {
	    return ;
	  }
	  
	  this.isBlinking = true;
	  this.blinkingTimeout = 150;
	  this.isStunned = true;
	  this.stunnedTimeout = 10;
	  this.controlDisabled = true;
	  this.velocityBeforeStunned[0] = this.velocity[0];
	  this.velocityBeforeStunned[1] = this.velocity[1];
	  this.animationBeforeStunned = this.currentAnimation;
	  
	  if (this.velocity[0]) {
		this.velocity[0] = -this.velocity[0]*2;
	} else if (event.enemy.velocity[0]) {
		this.velocity[0] = event.enemy.velocity[0]/Math.abs(event.enemy.velocity[0])*this.MAX_VELOCITY*2;
	}
	
	  if (this.velocity[1]) {
		this.velocity[1] = -this.velocity[1]*2;
	} else if (event.enemy.velocity[1]) {
		this.velocity[1] = event.enemy.velocity[1]/Math.abs(event.enemy.velocity[1])*this.MAX_VELOCITY*2;
	}
	  this.currentAnimation = 'standing-'+this.direction;
	};
	
	Player.prototype.onMapCollision = function(event) {
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
	
	Player.prototype.paint = function(g, offsetx, offsety) {
	  if (! this.isVisible && g.css("visibility") != "hidden") {
		  g.css("visibility", "hidden");
	  } else if (this.isVisible && g.css("visibility") == "hidden") {
		  g.css("visibility", "");
	  }
	  
	  pm.lang.Sprite.prototype.paint.call(this, g, offsetx, offsety);
	};
	
	Player.prototype.update = function() {
	  
	  pm.lang.Sprite.prototype.update.call(this);
	  
	  if (this.blinkingTimeout <= 0 && this.isBlinking) {
	    this.isBlinking = false;
      this.isVisible = true;
	  }
	  
	  if (this.isBlinking) {
	    if (this.isVisible) {
	      this.isVisible = false;
	    } else {
	      this.isVisible = true;
	    }
	    
	    this.blinkingTimeout--;
	  }
	  
	  if (this.stunnedTimeout <= 0 && this.isStunned) {
	    this.isStunned = false;
	    this.controlDisabled = false;
      this.velocity[0] = this.velocityBeforeStunned[0];
      this.velocity[1] = this.velocityBeforeStunned[1];
      this.currentAnimation = this.animationBeforeStunned;
	  }
	  
	  if (this.isStunned) {
	    this.stunnedTimeout--;
	  }
	};
 
	pm.entity = pm.entity || {};
	
	pm.entity.Player = Player;
	
	return pm;
})(planetmars || {});
