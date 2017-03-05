var planetmars = (function(pm) { 
	var MOUSE_BUTTONS = ["button0", "button1", "button2"];
	
	function MouseEvent(nativeEvent, source) {
		var maps = {"mousedown": "MouseDown", "mousemove": "MouseMove", "mouseup": "MouseUp"};
		
		this.type = maps[nativeEvent.type];
		this.source = source;
		
		this.button = 1; // 1 = left, 2 = right
		
		if (
		(nativeEvent.which && nativeEvent.which == 3)
		|| (nativeEvent.button && nativeEvent.button == 2) ) {
			this.button = 2;
		}
		
		this.x = 0;
		this.y = 0;
		
		if (nativeEvent.pageX || nativeEvent.pageY) 	{
			this.x = nativeEvent.pageX;
			this.y = nativeEvent.pageY;
		} else if (nativeEvent.clientX || nativeEvent.clientY) 	{
			this.x = nativeEvent.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			this.y = nativeEvent.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		
		this.stopPropagation = false;
	} 
	
	MouseEvent.MOUSE_BUTTONS = MOUSE_BUTTONS;
	
	pm.event = pm.event || {};
	
	pm.event.MouseEvent = MouseEvent;
	
	return pm;
})(planetmars || {});
