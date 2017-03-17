var planetmars = (function(pm) { 
	function RoomExitEvent(source) {
		
		this.type = "RoomExit";
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.RoomExitEvent = RoomExitEvent;
	
	return pm;
})(planetmars || {});
