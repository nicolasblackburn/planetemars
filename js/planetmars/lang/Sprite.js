var planetmars = (function(pm) { 

	function Sprite(screen) {
		if (! arguments.length) {
			return;
		}
		
		this.screen = screen;

		this.type = "Sprite";
		
		this.broadcastEventEnabled = true;
		
		// Graphiques
		this.height = 48;
		this.width = 48;
		
		// Physique
		this.position = [0,0];
		this.calculatedPosition = [0,0];
		this.velocity = [0,0];
		this.calculatedVelocity = [0,0];
		this.acceleration = [0,0];
		
		// Une liste de points énumérés dans le sens horaire
		this.collisionShape = pm.geom.rectangle(this.position, [this.width, this.height]); 
		
		// Animation
		this.spriteIndex = 0;
		this.animated = false;
		this.currentAnimation = "default";
		this.currentAnimationFrame = 0;
		this.animations = {"default": [0]};
	}
	
	Sprite.prototype.dispatchEvent = function(event) {
		var i;
		
		for (i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i]["on"+event.type]) {
				this.listeners[i]["on"+event.type](event);
			}
			
			if (event.stopPropagation) {
				break;
			}
		}
	};
	
	Sprite.prototype.getCollisionShape = function() {
		return this.collisionShape;
	};
	
	Sprite.prototype.onObjectRemoved = function(event) {
		if (event.object.type && this["on" + event.object.type + "Removed"]) {
			this["on" + event.object.type + "Removed"](event);
		}
	};
		
	Sprite.prototype.paint = function(g, offsetx, offsety) {
		g
			.attr("class", "sprite-" + this.spriteIndex)
			.css({
				"left": parseInt(this.position[0] + offsetx) + "px",
				"top": parseInt(this.position[1] + offsety) + "px"
			});
	};
	
	Sprite.prototype.update = function() {
		
		// Mettre à jour la position
		this.velocity = pm.vector.add(this.velocity, this.acceleration);
		
		// On ne vérifie les collisions que si la vitesse n'est pas nulle
		if (pm.vector.sum.apply(null, this.velocity)) {
			this.calculatedVelocity = pm.util.arrayCopy(this.velocity);
			this.calculatedPosition = pm.vector.add(this.position, this.calculatedVelocity);
			
			if ( this["onMapCollision"] && "function" == typeof this["onMapCollision"] ) {
				this.screen.processMapCollisions( this );
			}
			
			this.position = this.calculatedPosition;
			
			if ( this["onBorderCollision"] && "function" == typeof this["onBorderCollision"] ) {
				this.screen.processBorderCollisions( this );
			}
		}
		
		// Mettre à jour l'index de sprite correspondant à l'image d'animation courante
		if (this.animated) {
			this.currentAnimationFrame++;
			if (this.currentAnimationFrame >= this.animations[this.currentAnimation].length) {
				this.currentAnimationFrame = 0;
			}
		
			this.spriteIndex = this.animations[this.currentAnimation][this.currentAnimationFrame];
		}
		
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.Sprite = Sprite;
	
	return pm;
})(planetmars || {});
