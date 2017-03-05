var planetmars = (function(pm) { 
	function TileMap(game, width, height, tilewidth, tileheight, tiles, tilesets) {
		this.game = game;
		
		this.width = width;
		this.height = height;

		this.tileWidth = tilewidth;
		this.tileHeight = tileheight;
		
		this.horizontalTileCount = parseInt(width / tilewidth);
		this.verticalTileCount = parseInt(height / tileheight);
		
		this.tiles = tiles;
		this.tilesets = tilesets;
	}
	
	TileMap.prototype.getTilesetByTileId = function(tileId) {
		var i, tileset, imageId;
		
		i = this.tilesets.length - 1;
		tileset = this.tilesets[i];
		for (; i >= 0 && tileset.firstTileId > tileId; i--) {
			tileset = this.tilesets[i];
		}
		
		return tileset;
	};
	
	TileMap.prototype.getTile = function(x, y) {
		var tile, tileId, tileset;
		
		tileId = this.tiles[x][y];
		tileset = this.getTilesetByTileId(this.tiles[x][y]);
		tile = {
			tileId: tileId,
			//terrain: tileset.tiles[tileId] && tileset.tiles[tileId].terrain || [0,0,0,0],
			//collisionMask: tileset.tiles[tileId] && tileset.tiles[tileId].terrain || [0,0,0,0],
			tileset: tileset
		};
		
		return tile;
	};
	
	TileMap.prototype.paint = function(g, x, y, width, height, offsetx, offsety) {
		var i, j, clipHorizontalTileCount, clipVerticalTileCount, tile;
		
		clipTileX = parseInt(x / this.tileWidth);
		clipTileY = parseInt(y / this.tileHeight);
		clipHorizontalTileCount = parseInt(width / this.tileWidth);
		clipVerticalTileCount = parseInt(height / this.tileHeight);
		
		for (j = 0; j < clipVerticalTileCount; j++) {
			for (i = 0; i < clipHorizontalTileCount; i++) {
				tile = this.getTile(clipTileX+i, clipTileY+j);
				if (tile.tileId > 0) {
					this.paintTile(g, tile, i*this.tileWidth, j*this.tileHeight, offsetx, offsety );
				}
			}
		}
	};
	
	TileMap.prototype.paintTile = function(g, tile, x, y, offsetx, offsety) {
		var tileset, image, tileid, imagex, imagey;

		image = this.game.resources.images[tile.tileset.imageId].imageElement;
		
		tileid = tile.tileId - tile.tileset.firstTileId;
		
		imagex = (tileid % tile.tileset.horizontalTileCount) * tile.tileset.tileWidth;
		imagey = parseInt(tileid / tile.tileset.horizontalTileCount) * tile.tileset.tileHeight;
		
		g.drawImage(image, 
			imagex, imagey, tile.tileset.tileWidth, tile.tileset.tileHeight, 
			x + offsetx, y + offsety, tile.tileset.tileWidth, tile.tileset.tileHeight);
	};
	
	TileMap.prototype.setTile = function(x, y, id) {
		this.tiles[x][y] = id;
	};
 
	pm.lang = pm.lang || {};
	
	pm.lang.TileMap = TileMap;
	
	return pm;
})(planetmars || {});
