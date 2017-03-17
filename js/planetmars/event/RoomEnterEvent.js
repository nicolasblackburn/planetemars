var planetmars = (function(pm) { 
	function RoomEnterEvent(source) {
		
		this.type = "RoomEnter";
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.RoomEnterEvent = RoomEnterEvent;
	
	return pm;
})(planetmars || {});
