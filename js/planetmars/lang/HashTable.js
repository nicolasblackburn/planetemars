var planetmars = (function(pm) { 
	function Map(game, width, height, tilewidth, tileheight, layers, tilesets) {
		this.game = game;
		
		this.width = width;
		this.height = height;

		this.tileWidth = tilewidth;
		this.tileHeight = tileheight;
		
		this.horizontalTileCount = parseInt(width / tilewidth);
		this.verticalTileCount = parseInt(height / tileheight);
		
		this.layers = layers;
		this.tilesets = tilesets;
		
		this.needRepaint = true;
	}
	
	Map.prototype.getTilesetByTileId = function(tileId) {
		var i, tileset, imageId;
		
		i = this.tilesets.length - 1;
		tileset = this.tilesets[i];
		for (; i >= 0 && tileset.firstTileId > tileId; i--) {
			tileset = this.tilesets[i];
		}
		
		return tileset;
	};
	
	Map.prototype.getTile = function(layer, x, y) {
		/*
		var tile;
		
		
		tile = {
			tileId: this.layers[layer].tiles[x][y],
			terrain: [0, 0, 0, 0]
		};
		*/
		
		/*
		if ( typeof this.tiles[tile.tile] != "undefined" ) {
			tile.terrain[0] = this.tiles[tile.tile][0];
			tile.terrain[1] = this.tiles[tile.tile][1];
			tile.terrain[2] = this.tiles[tile.tile][2];
			tile.terrain[3] = this.tiles[tile.tile][3];
		}
		*/
		
		return tile;
	};
	
	Map.prototype.paint = function(g, x, y, width, height) {
		var i, j, k, clipHorizontalTileCount, clipVerticalTileCount, tile;
		
		if (! this.needRepaint) {
			return;
		}
		
		clipTileX = parseInt(x / this.tileWidth);
		clipTileY = parseInt(y / this.tileHeight);
		clipHorizontalTileCount = parseInt(width / this.tileWidth);
		clipVerticalTileCount = parseInt(height / this.tileHeight);
		
		for (i = 0; i < this.layers.length; i++) {
			if (this.layers[i].visible && this.layers[i].opacity > 0 && this.layers[i].type == 'tilelayer') {
				for (k = 0; k < clipVerticalTileCount; k++) {
					for (j = 0; j < clipHorizontalTileCount; j++) {
						tile = this.getTile(i, clipTileX+j, clipTileY+k);
						if (tile.tileId > 0) {
							this.paintTile(g, tile, j*this.tileWidth, k*this.tileHeight );
						}
					}
				}
			}
		}

		this.needRepaint = false;
	};
	
	Map.prototype.paintTile = function(g, tile, x, y) {
		var tileset, image, tileId, offsetX, offsetY;
		
		tileset = this.getTilesetByTileId(tile.tileId);
		image = this.game.resources.images[tileset.imageId].imageElement;
		
		tileId = tile.tileId - tileset.firstTileId;
		
		offsetX = (tileId % tileset.horizontalTileCount) * tileset.tileWidth;
		offsetY = parseInt(tileId / tileset.horizontalTileCount) * tileset.tileHeight;
		
		g.drawImage(image, 
			offsetX, offsetY, tileset.tileWidth, tileset.tileHeight, 
			x, y, tileset.tileWidth, tileset.tileHeight);
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.Map = Map;
	
	return pm;
})(planetmars || {});
