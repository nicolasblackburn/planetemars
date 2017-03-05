var planetmars = (function(pm) { 
	function TiledMapReader(data) {
		this.data = data;
		this.height = null;
		this.layers = null;
		this.tilesets = null;
		this.width = null;
	} 
	
	TiledMapReader.prototype.getHeight = function() {
		if (null == this.height) {
			this.height = this.data.height * this.data.tileheight;
		}
		return this.height;
	};
	
	TiledMapReader.prototype.getLayer = function(name) {
		var i, layers; 

		layers = this.getLayers();

		for (i = 0; i < layers.length; i++) {
			if (layers[i].name == name) {
				return layers[i];
			}
		}

		return null;
	};
	
	TiledMapReader.prototype.getLayers = function() {
		var i, j, k, layerData, layer, object, tiles;
		
		if (null == this.layers) {
			this.layers = [];

			for (i = 0; i < this.data.layers.length; i++) {
				layerData = this.data.layers[i];
					
				layer = {
					name: layerData.name,
					width: layerData.width,
					height: layerData.width,
					opacity: layerData.opacity,
					type: layerData.type,
					visible: layerData.visible,
					x: layerData.x,
					y: layerData.y
				};

				if ( layerData.type == "objectgroup" ) {
					layer.objects = [];

					for (j = 0; j < layerData.objects.length; j++) {
					  object = {};
					  
					  for (k in layerData.objects[j]) {
					    object[k] = layerData.objects[j][k];
					  }
					  
						layer.objects.push(object);
						
					}

				} else if ( layerData.type == "tilelayer" ) {
						
					layer.tiles = new Array(layerData.width);
					
					for (j = 0; j < layerData.width; j++) {
						layer.tiles[j] =  new Array(layerData.height);
						
						for (k = 0; k < layerData.height; k++) {
							layer.tiles[j][k] = layerData.data[k * layerData.width + j];
						}	
					}

				} 
					
				this.layers.push(layer);
			}
		}
		
		return this.layers;
	};
	
	TiledMapReader.prototype.getObjects = function() {
		if (null == this.objects) {
			this.getLayers();
		}
		return this.objects;
	};
	
	TiledMapReader.prototype.getTilesets = function() {
		var i, j, k, tile, tiles, tileset, tilesetData, terrains, imageId;
		if (null == this.tilesets) {
			this.tilesets = [];
			
			for (i = 0; i < this.data.tilesets.length; i++) {
				tilesetData = this.data.tilesets[i];
				/*
				terrains = [];
				if (typeof tilesetData.terrains != "undefined") {
					for (j = 0; j < tilesetData.terrains.length; j++) {
						terrains.push({
							name: tilesetData.terrains[j].name,
							tile: tilesetData.terrains[j].tile,
						});
					}
				}
				
				tiles = [];
				if (typeof tilesetData.tiles != "undefined") {
					for (j in tilesetData.tiles) {
						tiles[j] = {
							id: j,
							collisionMap: tilesetData.tileproperties[j] && tilesetData.tileproperties[j].collisionmask && tilesetData.tileproperties[j].collisionmask.split(",") || [0,0,0,0],
							terrain: tilesetData.tiles[j].terrain || [0,0,0,0]
						};
					}
				}

				if (typeof tilesetData.tileproperties != "undefined") {
					for (j in tilesetData.tileproperties) {
						if ("undefined" == typeof tiles[j]) {
							tiles[j] = {
								id: j,
								collisionMask: tilesetData.tileproperties[j].collisionmask && tilesetData.tileproperties[j].collisionmask.split(",") || [0,0,0,0],
								terrain:  tilesetData.tiles[j] && tilesetData.tiles[j].terrain || [0,0,0,0]
							};
						}
					}
				}
				*/
				
				imageId = tilesetData.image.split("/").slice(-1)[0].split(".").slice(0,-1).join(".");
				
				this.tilesets.push({
					name: tilesetData.name,
					image: tilesetData.image,
					imageId: imageId,
					height: tilesetData.imageheight,
					width: tilesetData.imagewidth,
					tileHeight: tilesetData.tileheight,
					tileWidth: tilesetData.tilewidth,
					horizontalTileCount: parseInt(tilesetData.imageheight / tilesetData.tileheight),
					verticalTileCount: parseInt(tilesetData.imagewidth / tilesetData.tilewidth),
					firstTileId: tilesetData.firstgid,
					tiles: tiles,
					terrains: terrains
				});
			}
		}
		return this.tilesets;
	};
	
	TiledMapReader.prototype.getTileHeight = function() {
		return this.data.tileheight;
	};
	
	TiledMapReader.prototype.getTileWidth = function() {
		return this.data.tileheight;
	};
	
	TiledMapReader.prototype.getWidth = function() {
		return this.data.width * this.data.tilewidth;
	};
 
	pm.io = pm.io || {};
	
	pm.io.TiledMapReader = TiledMapReader;
	
	return pm;
})(planetmars || {});
