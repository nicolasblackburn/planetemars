var planetmars = (function(pm) { 

	function Sprite(screen, type) {
		if (! arguments.length) {
			return;
		}
		
		if (! type) {
			type = "Sprite";
		}
		
		this.screen = screen;
		
		this.type = type;
		
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
		this.animated = true;
		this.currentAnimation = "default";
		this.currentAnimationFrame = 0;
		
		var animation = [0], name = this.screen.objectTypeNames[this.type];
		
		if (this.screen.game.resources.sprites[name] && this.screen.game.resources.sprites[name].defaultanimation) {
			this.currentAnimation = this.screen.game.resources.sprites[name].defaultanimation;
			
			if (this.screen.game.resources.sprites[name] && this.screen.game.resources.sprites[name].animations[this.currentAnimation]) {
				animation = this.screen.game.resources.sprites[name].animations[this.currentAnimation];
			}
			
			this.spriteIndex = animation[this.currentAnimationFrame];
		}
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
	
	Sprite.prototype.getState = function() {
		var data = {};
		
		data.type = this.Type;
		
		// Graphiques
		data.height = this.height;
		data.width = this.width;
		
		// Physique
		data.position = [this.position[0], this.position[1]];
		data.velocity = [this.velocity[0], this.velocity[0]];
		data.acceleration = [this.acceleration[0], this.acceleration[1]];
		
		// Animation
		data.spriteIndex = this.spriteIndex;
		data.currentAnimation = this.currentAnimation;
		data.currentAnimationFrame = this.currentAnimationFrame;
		
		return data;
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
	
	Sprite.prototype.setState = function(data) {
		// Graphiques
		this.height = data.height;
		this.width = data.width;
		
		// Physique
		this.position = [data.position[0], data.position[1]];
		this.velocity = [data.velocity[0], data.velocity[0]];
		this.acceleration = [data.acceleration[0], data.acceleration[1]];
		
		// Animation
		this.spriteIndex = data.spriteIndex;
		this.currentAnimation = data.currentAnimation;
		this.currentAnimationFrame = data.currentAnimationFrame;
		
		return this;
	};
	
	Sprite.prototype.update = function() {
		var animation = [0], name = this.screen.objectTypeNames[this.type];
		
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
			
			if (this.screen.game.resources.sprites[name] && this.screen.game.resources.sprites[name].animations[this.currentAnimation]) {
				animation = this.screen.game.resources.sprites[name].animations[this.currentAnimation];
			}
			
			this.currentAnimationFrame++;
			
			if (this.currentAnimationFrame >= animation.length) {
				this.currentAnimationFrame = 0;
			}
			
			this.spriteIndex = animation[this.currentAnimationFrame];
		}
		
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.Sprite = Sprite;
	
	return pm;
})(planetmars || {});
