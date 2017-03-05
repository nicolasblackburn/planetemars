var planetmars = (function (pm, undefined) {

	function Graphics(g) {
		this.g = g;
	}
	
	Graphics.prototype.each = function(v, fn) {
		var i;
		for (i = 0; i < v.length; i++) {
			fn.call(this, v[i], i);
		}
		
		return this;
	};
	
	Graphics.prototype.fillCenteredRect = function(p, l) {
		this.g.fillRect(p[0] - l/2, p[1] - l/2, l, l);
		
		return this;
	};
	
	Graphics.prototype.fillShape = function(shape) {
		// « shape » : une liste de points
		
		var i = 0;
		
		if (! shape.length) {
			return;
		}
		
		this.g.beginPath();
		this.g.moveTo(shape[0][0] + 0.5, shape[0][1] + 0.5);
		
		for (i = 0; i < shape.length; i++) {
			this.g.lineTo(shape[i][0] + 0.5, shape[i][1] + 0.5);
		}
		
		this.g.closePath();
		this.g.fill();
		
		return this;
	};
	
	Graphics.prototype.fillStyle = function() {
		if (arguments.length) {
			this.g.fillStyle = arguments[0];
			return this;
		} else {
			return this.g.fillStyle;
		}
	};
	
	Graphics.prototype.lineWidth = function() {
		if (arguments.length) {
			this.g.lineWidth = arguments[0];
			return this;
		} else {
			return this.g.lineWidth;
		}
	};
	
	Graphics.prototype.restore = function() {
		this.g.restore();
		return this;
	};
	
	Graphics.prototype.save = function() {
		this.g.save();
		return this;
	};
	
	Graphics.prototype.setFillAndStrokeStyle = function(style) {
		this.g.strokeStyle = style;
		this.g.fillStyle = style;
		
		return this;
	};
	
	Graphics.prototype.strokeLine = function(p0, p1) {
		this.g.beginPath();
		this.g.moveTo(p0[0], p0[1]);
		this.g.lineTo(p1[0], p1[1]);
		this.g.stroke();
		
		return this;
	};
	
	Graphics.prototype.strokePoints = function(shape) {
		
		var i = 0;
		
		if (! shape.length) {
			return;
		}
		
		this.g.beginPath();
		this.g.moveTo(shape[0][0] + 0.5, shape[0][1] + 0.5);
		
		for (i = 0; i < shape.length; i++) {
			this.g.lineTo(shape[i][0] + 0.5, shape[i][1] + 0.5);
		}
		
		this.g.stroke();
		
		return this;
	};
	
	Graphics.prototype.strokeShape = function(shape) {
		// « shape » : une liste de points
		
		var i = 0;
		
		if (! shape.length) {
			return;
		}
		
		this.g.beginPath();
		this.g.moveTo(shape[0][0] + 0.5, shape[0][1] + 0.5);
		
		for (i = 0; i < shape.length; i++) {
			this.g.lineTo(shape[i][0] + 0.5, shape[i][1] + 0.5);
		}
		
		this.g.closePath();
		this.g.stroke();
		
		return this;
	};
	
	Graphics.prototype.strokeStyle = function() {
		if (arguments.length) {
			this.g.strokeStyle = arguments[0];
			return this;
		} else {
			return this.g.strokeStyle;
		}
	};
 
	pm.util = pm.util || {};
	
	pm.util.Graphics = Graphics;
	
	return pm;
})(planetmars || {});
