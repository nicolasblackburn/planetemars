var planetmars = (function(pm) { 
	function ObjectRemovedEvent(object, source) {
		
		this.type = "ObjectRemoved";
		this.object = object;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.ObjectRemovedEvent = ObjectRemovedEvent;
	
	return pm;
})(planetmars || {});
