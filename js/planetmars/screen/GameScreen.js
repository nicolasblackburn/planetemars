var planetmars = (function(pm, undefined) { 
	function GameScreen(game) {
		pm.lang.Screen.call(this, game);
		
		this.debug = false;
		
		this.element =  $('<div class="screen" id="game-screen">')
			  .appendTo(game.containerElement);
		
	  this.canvas = $("<canvas>")
			  .attr("height", game.height)
			  .attr("width", game.width)
			  .appendTo(this.element);
		
	  this.containerElement = $('<div class="sprites-container">')
			  .appendTo(this.element);
		
		this.graphics = this.canvas[0].getContext("2d");
    
    // Ajoute la screen au broadcaster d'événements
		this.game.eventBroadcaster.addListener(this);
		
		this.bulletClass = pm.entity.Bullet;
		this.playerClass = pm.entity.Player;
		
		// Gestion des objets
		this.spawnQueue = [];
		this.objectElements = [];
		
		this.foreground = null;
		this.background = null;
		this.layers = [];
		this.mapWidth = 0;
		this.mapHeight = 0;
		this.needRepaint = true;

		this.viewportWidth = 720;
		this.viewportHeight = 528;
		this.hudWidth = 720;
		this.hudHeight = 72;
		
		this.player = new this.playerClass(this);
		this.savePoints = [];
		
		this.rooms = [];
		this.roomX = 0;
		this.roomY = 0;

		this.enemiesMapData = [];
		
		// Initialisation
		
		// Charger la map
		this.loadMap("world");
		
		// Initialiser les masques de collision pour les tuiles
		this.initTileCollisionShapes();

		// Distribuer les objets dans les rooms
		this.populateRooms();

		// Initialiser la position du joueur
		this.setPlayerPosition(
		  this.savePoints[0].roomX, this.savePoints[0].roomY, 
		  this.savePoints[0].position[0], this.savePoints[0].position[1]
		);
	}
	
	GameScreen.prototype = new pm.lang.Screen();
	
	GameScreen.prototype.addObject = function(object, delayed, roomX, roomY) {
		var element;

		if (typeof roomX == "undefined") {
			roomX = this.roomX;
		}

		if (typeof roomY == "undefined") {
			roomY = this.roomY;
		}
		
		if (delayed) {
			this.spawnQueue.push({
				object: object,
				roomX: roomX,
				roomY: roomY
			});
			
		} else {
			this.rooms[roomX][roomY].push(object);
			
			if (this.roomX == roomX && this.roomY == roomY) {
				element = $('<div class="sprite">')
					.appendTo(this.containerElement);
					
				this.objectElements.push(element);
				
				if (object.broadcastEventEnabled) {
					this.game.eventBroadcaster.addListener(object);
				}
			}
		}
	};
	
	GameScreen.prototype.clearRooms = function() {
		var i, j;
		
		this.freeRoom();
		
		for (i = 0; i < this.rooms.length; i++) {
		  for (j = 0; j < this.rooms[i].length; j++) {
		    this.rooms[i][j] = [];
		  }
		}
	};
	
  // Libère les ressources de la chambre actuelle (éléments html et écouteurs d'événements) 
	GameScreen.prototype.freeRoom = function() {
		var objects, i, element;

		objects = this.getCurrentRoomObjects();

		for (i = 0; i < objects.length; i++) {
			object = objects[i];
			
			if (this.objectElements[i]) {
			  this.objectElements[i].remove();
			}
			
			if (object.mouseEventEnabled || object.keyEventEnabled) {
				this.eventBroadcaster.removeListener(object);
			}
		}
    
    // Supprime les éléments orphelins
		for (; i < this.objectElements.length; i++) {
			this.objectElements[i].remove();
		}

		this.objectElements = [];
	};
	
	GameScreen.prototype.getBottomRoomCoordinates = function() {
		if (this.roomY < this.verticalRoomCount) {
			return [this.roomX, this.roomY + 1];
		}
		
		return false;
	};
	
	GameScreen.prototype.getCurrentRoomObjects = function() {
		return this.rooms[this.roomX][this.roomY];
	};
	
	GameScreen.prototype.getLeftRoomCoordinates = function() {
		if (this.roomX > 0) {
			return [this.roomX - 1, this.roomY];
		}
		
		return false;
	};
	
	GameScreen.prototype.getRightRoomCoordinates = function() {
		if (this.roomX < this.horizontalRoomCount) {
			return [this.roomX + 1, this.roomY];
		}
		
		return false;
	};
	
	GameScreen.prototype.getRoomTile = function(x, y) {
		if (x < 0) {
			x = 0;
		}
		if (y < 0) {
			y = 0;
		}
		if (x > this.horizontalRoomCount * this.horizontalViewportTileCount - 1)  {
			x = this.horizontalRoomCount * this.horizontalViewportTileCount;
		}
		if (y > this.verticalRoomCount * this.verticalViewportTileCount - 1)  {
			y = this.verticalRoomCount * this.verticalViewportTileCount;
		}
		return this.foreground.getTile(
			x + this.roomX * this.horizontalViewportTileCount,
			y + this.roomY * this.verticalViewportTileCount);
	};
	
	GameScreen.prototype.getTopRoomCoordinates = function() {
		if (this.roomY > 0) {
			return [this.roomX, this.roomY - 1];
			return true;
		}
		return false;
	};
		
	GameScreen.prototype.initTileCollisionShapes = function() {
		this.tileCollisionShapes = {
			3: pm.geom.rectangle([0, 0], [this.tileWidth, this.tileHeight] ), // Carré
				
			35: pm.geom.rightTriangle(
				[this.tileWidth, this.tileHeight],
				[-this.tileWidth, -this.tileHeight] ), // Triangle rectangle coin inférieur droit
				
			36: pm.geom.rightTriangle(
				[0, this.tileHeight],
				[this.tileWidth, -this.tileHeight] ), // Triangle rectangle coin inférieur gauche
				
			68: pm.geom.rightTriangle(
				[0, 0],
				[this.tileWidth, this.tileHeight] ), // Triangle rectangle coin supérieur gauche
				
			67: pm.geom.rightTriangle(
				[this.tileWidth, 0], 
				[-this.tileWidth, this.tileHeight] ) // Triangle rectangle coin supérieur droit
		};
	};
	
	GameScreen.prototype.loadMap = function(mapName) {
		var i, j, layers, mapReader, roomX, roomY, savePoint, savePoints;
		
		// Construire la map
		mapReader = new planetmars.io.TiledMapReader(game.resources.maps[mapName]);

		this.mapWidth = mapReader.getWidth();
		this.mapHeight = mapReader.getHeight();
		this.horizontalRoomCount = parseInt(this.mapWidth / this.viewportWidth);
		this.verticalRoomCount = parseInt(this.mapHeight / this.viewportHeight);

		layers = mapReader.getLayers();
    
    // Préparer les layers
		for (i = 0; i < layers.length; i++) {
			if (layers[i].name == "enemies") {
				this.enemiesMapData = layers[i];
			} else if (layers[i].name == "savepoints") {
				savePoints = layers[i];
			} else if (layers[i].type == "tilelayer") {
				layer = new planetmars.lang.TileMap(
					game,
					layers[i].width * mapReader.getTileWidth(),
					layers[i].height * mapReader.getTileHeight(),
					mapReader.getTileWidth(),
					mapReader.getTileHeight(),
					layers[i].tiles,
					mapReader.getTilesets()
				);

				this.layers.push(layer);

				if (layers[i].name == "background") {
					this.background = layer;
				}  else if (layers[i].name == "foreground") {
					this.foreground = layer;
				}
			} 
		} 
		
		// Dimensions des tuiles
		this.horizontalViewportTileCount = parseInt(this.viewportWidth / this.foreground.tileWidth);
		this.verticalViewportTileCount = parseInt(this.viewportHeight / this.foreground.tileHeight);
		this.tileWidth = this.foreground.tileWidth;
		this.tileHeight = this.foreground.tileHeight;
		
	  // Créer les rooms
		this.rooms = Array(this.horizontalRoomCount);
		for (i = 0; i < this.rooms.length; i++) {
			this.rooms[i] = Array(this.verticalRoomCount);
			for (j = 0; j < this.rooms[i].length; j++) {
				this.rooms[i][j] = [];
			}
		}
		
		// Préparer les points de sauvegarde
		this.savePoints = [];
		for (i = 0; i < savePoints.objects.length; i++) {
		  savePoint = savePoints.objects[i];
			savePoint.position = [ parseInt(savePoint.x % this.viewportWidth),
				parseInt(savePoint.y % this.viewportHeight) ];
			savePoint.roomX = parseInt(savePoint.x / this.viewportWidth);
			savePoint.roomY = parseInt(savePoint.y / this.viewportHeight);
		  this.savePoints.push(savePoint);
		}
		
	};
	
	GameScreen.prototype.mapObjectCollide = function(object) {
		var box, collision, firstcollision, i, j, event, p, shape1, shape2,
			t, tileheight, tileshapes, tileshape, tilewidth, tilex, tilexstart, 
			tilexstop, tiley, tileystart, tileystop;
		
		shape1 = pm.geom.translate(
			object.getCollisionShape(),
			pm.vector.subtract(
				object.calculatedPosition,
				object.calculatedVelocity ) );
				
		box = pm.geom.boundingBox(shape1);
		
		// Position relative à l'écran	
		t = [ (box[0][0] % this.viewportWidth) - box[0][0],
			  (box[0][1] % this.viewportHeight) - box[0][1] ];
			  
		box = pm.geom.translate(box, t);
		shape1 = pm.geom.translate(shape1, t);
		
		tilewidth = this.tileWidth;
		tileheight = this.tileHeight;
		
		// Intervalle de tuiles à vérifier
		tilexstart = parseInt((box[0][0] + object.calculatedVelocity[0]) / tilewidth), 
		tileystart = parseInt((box[0][1] + object.calculatedVelocity[1]) / tileheight), 
		tilexstop = parseInt((box[2][0] + object.calculatedVelocity[0] + tilewidth) / tilewidth), 
		tileystop = parseInt((box[2][1] + object.calculatedVelocity[1] + tileheight) / tileheight);
		
		firstcollision = new pm.collision.NoCollision();
		tileshapes = [];
		
		// Vérifier si les tuiles entrent en collision avec le masque
		var trace = "";
		for (j = tileystart; j < tileystop; j++) {
			for (i = tilexstart; i < tilexstop; i++) {
				
				tilex = i * tilewidth;
				tiley = j * tileheight;
				tile = this.getRoomTile(i, j);

				if (this.tileCollisionShapes[tile.tileId]) {
					shape2 = pm.geom.translate(
						this.tileCollisionShapes[tile.tileId],
						[tilex, tiley] );
						
					tileshapes.push([[i,j], shape2]);
					
					collision = pm.collision.polygonsCollideProjective(shape1, shape2, object.calculatedVelocity);
					if ( collision.collide && ( ! firstcollision.collide || collision.time < firstcollision.time ) ) {
								
						firstcollision = collision;
						
					}
				} 
			}
		}
		
		return firstcollision;
	};
	
	GameScreen.prototype.onEnemyRemoved = function(event) {
		// Marquer que l'ennemi est mort
	};
		
	GameScreen.prototype.paint = function() {
		var i, g, objects;
		
		// Peindre le background
		if (this.needRepaint) {
			this.paintBackground();
			this.needRepaint = false;
		}
		
		// Peindre les objets
		objects = this.getCurrentRoomObjects();

		for (i = 0; i < objects.length; i++) {
		  // Si les ressources de la room ont été libérées, il n'y aura plus d'élément graphique pour l'objet
		  if (this.objectElements[i]) {
			  g = this.objectElements[i];
			  objects[i].paint(g, 0, this.hudHeight);
		  }
		}
	};
		
	GameScreen.prototype.paintBackground = function() {
		var i;
		
		for (i = 0; i < this.layers.length; i++) {
			this.layers[i].paint(this.graphics, this.roomX*this.viewportWidth, this.roomY*this.viewportHeight, this.viewportWidth, this.viewportHeight, 0, this.hudHeight);
		}
	};
		
	GameScreen.prototype.populateRooms = function(initializePlayer) {
		var i, object, objectClass, objectClassPath, objectData, roomX, roomY;
		for (i = 0; i < this.enemiesMapData.objects.length; i++) {
		  objectData = this.enemiesMapData.objects[i];
			objectClassPath = objectData.type.split(".");
			
			if (typeof window[objectClassPath[0]] == "undefined") {
				continue;
			}

			objectClass = window[objectClassPath[0]];

			objectClassPath = objectClassPath.slice(1);
			while (objectClassPath.length) {
				if (typeof objectClass[objectClassPath[0]] == "undefined") {
					break;
					continue;
				}
				objectClass = objectClass[objectClassPath[0]];
				objectClassPath = objectClassPath.slice(1);
			}

			object = new objectClass(this);
			object.position = [ parseInt(objectData.x % this.viewportWidth),
				parseInt(objectData.y % this.viewportHeight) ];
				
			object.width = objectData.width;
			object.height = objectData.height;

			roomX = parseInt(objectData.x / this.viewportWidth);
			roomY = parseInt(objectData.y / this.viewportHeight);

			this.rooms[roomX][roomY].push(object);
		}
	};
	
	GameScreen.prototype.processBorderCollisions = function(object) {
		var box, event, p, shape;
		
		shape = pm.geom.translate(
			object.collisionShape,
			pm.vector.add(
				object.position,
				object.velocity ) );
				
		box = pm.geom.boundingBox(shape);
		
		p = pm.vector.add(
			box[0],
			pm.vector.scale(
				1/2,
				pm.vector.subtract( 
					box[2], 
					box[0] ) ) );
			
		if (p[0] < 0) {
			event = new pm.event.BorderCollisionEvent(
				pm.event.BorderCollisionEvent.EAST_BORDER, 
				this );
			
			object["on"+event.type](event);
			
			return true;
			
		} else if (p[0] > this.viewportWidth) {
			event = new pm.event.BorderCollisionEvent(
				pm.event.BorderCollisionEvent.WEST_BORDER, 
				this );
				
			object["on"+event.type](event);
			
			return true;
			
		} else if (p[1] < 0) {
			event = new pm.event.BorderCollisionEvent(
				pm.event.BorderCollisionEvent.NORTH_BORDER, 
				this );
				
			object["on"+event.type](event);
			
			return true;
			
		} else if (p[1] > this.viewportHeight) {
			event = new pm.event.BorderCollisionEvent(
				pm.event.BorderCollisionEvent.SOUTH_BORDER, 
				this );
				
			object["on"+event.type](event);
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	};
	
	GameScreen.prototype.processBulletCollisions = function(bullet) {
		var collision, event, i, objects, bulletShape, objectShape;
		
		// Collisions avec les projectiles
		event = new pm.event.BulletCollisionEvent(bullet);

		objects = this.getCurrentRoomObjects();
		
		bulletShape = pm.geom.translate(
			bullet.getCollisionShape(),
			pm.vector.subtract(bullet.position, bullet.velocity) );
		
		for (i = 0; i < objects.length; i++) {
			
			// On ne vérifie seulement que les objets qui répondent à une collision avec un projectile
			if ( objects[i]["on"+event.type] && "function" == typeof objects[i]["on"+event.type] ) {
				
				objectShape = pm.geom.translate(
					objects[i].getCollisionShape(),
					objects[i].position );
						
				collision = pm.collision.polygonsCollideSAT(bulletShape, objectShape, bullet.velocity);
				
				if ( collision && collision.collide ) {
						
					objects[i]["on"+event.type](event);
					
					if (event.stopPropagation) {
						break;
					}
				}
				
			}
		}
	};
	
	GameScreen.prototype.processEnemyCollisions = function(enemy) {
		var collision, event, i, objects, enemyShape, objectShape;
		
		// Collisions avec les projectiles
		event = new pm.event.EnemyCollisionEvent(enemy);

		objects = this.getCurrentRoomObjects();
		
		enemyShape = pm.geom.translate(
			enemy.getCollisionShape(),
			pm.vector.subtract(enemy.position, enemy.velocity) );
		
		for (i = 0; i < objects.length; i++) {
			
			// On ne vérifie seulement que les objets qui répondent à une collision avec un projectile
			if ( objects[i]["on"+event.type] && "function" == typeof objects[i]["on"+event.type] ) {
				
				objectShape = pm.geom.translate(
					objects[i].getCollisionShape(),
					objects[i].position );
					
				pm.collision.debug = true;
				collision = pm.collision.polygonsCollideSAT(enemyShape, objectShape, enemy.velocity);
				
				//console.log(enemyShape, objectShape, enemy.velocity);
				
				if ( collision && collision.collide ) {
					objects[i]["on"+event.type](event);
					
					if (event.stopPropagation) {
						break;
					}
				}
				
			}
		}
	};
	
	GameScreen.prototype.processMapCollisions = function(object) {
		var collide, collision, count = 1, movement, event;
		
		collision = this.mapObjectCollide(object);
		
		if (collision.collide) {
		
			event = new pm.event.MapCollisionEvent(collision, this);
			event.iterationCount = count;
			object["on"+event.type](event);
			
			if (! event.stopPropagation && collision.collide && count < 10) {
		
				collision = this.mapObjectCollide(object);
		
				if (collision.collide) {
					event = new pm.event.MapCollisionEvent(collision, this);
					event.iterationCount = count;
					object["on"+event.type](event);
				}
				
				count++;
			}

		}
	};

	GameScreen.prototype.removeBulletsInRoom = function(roomX, roomY) {
		var i;
		
		for (i = 0; i < this.rooms[roomX][roomY].length;) {
			if (this.rooms[roomX][roomY][i] instanceof this.bulletClass) {
				
				this.removeObjectIndexInRoom(i, roomX, roomY);
				
			} else {
				i++;
			}
		}
	};

	GameScreen.prototype.removeObject = function(object) {
		var i;
		
		for (i = 0; i < this.rooms[this.roomX][this.roomY].length; i++) {
			if (this.rooms[this.roomX][this.roomY][i] == object) {
				
				this.removeObjectIndex(i);
				
				break;
			}
		}
	};
	
	GameScreen.prototype.removeObjectIndex = function(index) {
		var object, event;
		
		object = this.rooms[this.roomX][this.roomY][index];
		this.rooms[this.roomX][this.roomY].splice(index, 1);

		this.objectElements[index].remove();
		this.objectElements.splice(index, 1);
		
		if (object.mouseEventEnabled || object.keyEventEnabled) {
			this.eventBroadcaster.removeListener(object);
		}
		
		event = new pm.event.ObjectRemovedEvent(object);
		
		if (event.object.type && this["on" + event.object.type + "Removed"]) {
			this["on" + event.object.type + "Removed"](event);
		}
		
		if (! event.stopPropagation) {
			this.dispatchEvent(event);
		}
	};
	
	GameScreen.prototype.removeObjectIndexInRoom = function(index, roomX, roomY) {
		var object, event;

		object = this.rooms[roomX][roomY][index];
		this.rooms[roomX][roomY].splice(index, 1);

		if (roomX == this.roomX && roomY == this.roomY) {
			this.objectElements[index].remove();
			this.objectElements.splice(index, 1);
		}
		
		if (object.mouseEventEnabled || object.keyEventEnabled) {
			this.eventBroadcaster.removeListener(object);
		}
		
		event = new pm.event.ObjectRemovedEvent(object);
		
		if (event.object.type && this["on" + event.object.type + "Removed"]) {
			this["on" + event.object.type + "Removed"](event);
		}
		
		if (! event.stopPropagation) {
			this.dispatchEvent(event);
		}
	};
	
	GameScreen.prototype.setPlayerPosition = function(roomX, roomY, positionX, positionY) {
    this.removeObject(this.player);
		this.removeBulletsInRoom(this.roomX, this.roomY);
    this.setRoom(roomX, roomY);
    this.addObject(this.player, false, roomX, roomY);
    this.player.position[0] = positionX;
    this.player.position[1] = positionY;
	};
	
	GameScreen.prototype.setRoom = function(roomX, roomY) {
	  this.freeRoom();
	  this.roomX = roomX;
	  this.roomY = roomY;
	  this.setupRoom();
	  this.needRepaint = true;
	};
	
	GameScreen.prototype.setRoomTile = function(x, y, id) {
		if (x < 0) {
			x = 0;
		}
		if (y < 0) {
			y = 0;
		}
		if (x > this.horizontalRoomCount * this.horizontalViewportTileCount - 1)  {
			x = this.horizontalRoomCount * this.horizontalViewportTileCount;
		}
		if (y > this.verticalRoomCount * this.verticalViewportTileCount - 1)  {
			y = this.verticalRoomCount * this.verticalViewportTileCount;
		}
		return this.foreground.setTile(
			x + this.roomX * this.horizontalViewportTileCount,
			y + this.roomY * this.verticalViewportTileCount,
			id);
	};
  
  // Prépare les ressources de la chambre actuelle (éléments html et écouteurs d'événements) 
	GameScreen.prototype.setupRoom = function() {
		var objects, i, element;

		objects = this.getCurrentRoomObjects();
		for (i = 0; i < objects.length; i++) {
			object = objects[i];

			if (object.broadcastEventEnabled) {
				this.game.eventBroadcaster.addListener(object);
			}

			element = $('<div class="sprite">')
				.appendTo(this.containerElement);

			this.objectElements.push(element);
		}
	};
	
	GameScreen.prototype.update = function() {
		var self = this, spawn, i, objects, oldPosition, oldVelocity;
		
		// Détection des collisions entre les objets
		
		objects = this.getCurrentRoomObjects();

		for (i = 0; i < objects.length; i++) {
			
			switch (objects[i].type) {
				case 'Bullet':
					this.processBulletCollisions(objects[i]);
					break;
					
				case 'Bat':
				case 'Beast':
				case 'Crab':
				case 'Worm':
					this.processEnemyCollisions(objects[i]);
					break;
			}
			
		};
		
		// Mettre à jour l'état des objets
		
		for (i = 0; i < objects.length; i++) {
			
			if (objects[i].update && "function" == typeof objects[i].update) {
				objects[i].update();
			}
			
		};
		
		// Inséré les objets mis en queue
		
		while (this.spawnQueue.length) {
			spawn = this.spawnQueue.shift();
			this.addObject(spawn.object, false, spawn.roomX, spawn.roomY);
		}
	};
 
	pm.screen = pm.screen || {};
	
	pm.screen.GameScreen = GameScreen;
	
	return pm;
})(planetmars || {});
