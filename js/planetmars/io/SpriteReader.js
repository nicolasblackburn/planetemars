var planetmars = (function(pm) { 
	function SpriteReader(data) {
		this.data = data;;
	} 

	pm.io = pm.io || {};
	
	pm.io.SpriteReader = SpriteReader;
	
	return pm;
})(planetmars || {});
