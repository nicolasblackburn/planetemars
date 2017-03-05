var planetmars = (function(pm) { 

	function Layer(game) {
		if (! arguments.length) {
			return;
		}
		
		this.game = game;
		
	  this.layerElement = $('<div class="layer">')
			  .attr("height", game.height)
			  .attr("width", game.width)
			  .appendTo(game.containerElement);
		
	  this.canvas = $("<canvas>")
			  .attr("height", game.height)
			  .attr("width", game.width)
			  .appendTo(this.layerElement);
		
		this.graphics = this.canvas[0].getContext("2d");
		
	  this.containerElement = $('<div class="container">')
			  .attr("height", game.height)
			  .attr("width", game.width)
			  .appendTo(this.layerElement);
	}
 
	pm.lang = pm.lang || {};
	
	pm.lang.Layer = Layer;
	
	return pm;
})(planetmars || {});
