var planetmars = (function(pm) { 
	var KEYCODE_MAP = {
		 8: "Backspace",
		13: "Enter",
		27: "Esc",
		32: " ",
		65: "a",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z"
};
	var KEY_MAP = {
"Esc": 27, "F1": 112, "F2": 113, "F3": 114, "F4": 115, "F5": 116, "F6": 117, "F7": 118, "F8": 119, "F9": 120, "F10": 121, "F11": 122, "F12": 123, "F12": 123, "ScrollLock": 145, "Pause": 19, "/": 191, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "0": 48, "-": 173, "=": 61, "Backspace": 8, "Tab": 9, "q": 81, "w": 87, "e": 69, "r": 82, "t": 84, "y": 89, "u": 85, "i": 73, "o": 79, "p": 80, "DeadCircumflex": 0, "ç": 0, "Enter": 13, "CapsLock": 20, "a": 65, "s": 83, "d": 68, "f": 70, "g": 71, "h": 72, "j": 74, "k": 75, "l": 76, ";": 59, "è": 0, "à": 0, "Shift": 16, "z": 90, "x": 88, "c": 67, "v": 86, "b": 66, "n": 78, "m": 77, ",": 188, ".": 190, "é": 0, "Control": 17, "Alt": 18, " ": 32, "AltGraph": 225, "OS": 91, "AltGraph": 225, "Insert": 45, "Home": 36, "PageUp": 33, "Del": 46, "End": 35, "PageDown": 34, "Left": 37, "Up": 38, "Right": 39, "Down": 40, "NumLock": 144, "NumPad/": 111, "NumPad*": 106, "NumPad-": 109, "NumPad7": 103, "NumPad8": 104, "NumPad9": 105, "NumPad+": 107, "NumPad4": 100, "NumPad5": 101, "NumPad6": 102, "NumPad1": 97, "NumPad2": 98, "NumPad3": 99, "NumPad0": 96, "NumPad.": 110
};

	function KeyEvent(nativeEvent, keyStates, keyStack, source) {
		var maps = {"keydown": "KeyDown", "keyup": "KeyUp"};
		
		this.type = maps[nativeEvent.type];
		
		this.keyCode = 0;
		
		if (nativeEvent.keyCode) {
			this.keyCode = nativeEvent.keyCode;
		} else if (nativeEvent.which) {
			this.keyCode = nativeEvent.which;
		}
		
		this.key = String.fromCharCode(this.keyCode);
		this.keyStates = keyStates;
		this.keyStack = keyStack;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	KeyEvent.KEYCODE_MAP = KEYCODE_MAP;
	KeyEvent.KEY_MAP = KEY_MAP;
	
	pm.event = pm.event || {};
	
	pm.event.KeyEvent = KeyEvent;
	
	return pm;
})(planetmars || {});
