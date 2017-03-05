var planetmars = (function(pm, undefined) { 
	var vector = {};
	
	vector.AXIS_ZERO_PI_RADIAN = [1,0];
	vector.AXIS_PI_OVER_SIX = [Math.sqrt(3),1];
	vector.AXIS_PI_OVER_FOUR = [1,1];
	vector.AXIS_PI_OVER_THREE = [1,Math.sqrt(3)];
	vector.AXIS_PI_OVER_TWO = [0,1];
	vector.AXIS_TWO_PI_OVER_THREE = [-1,Math.sqrt(3)];
	vector.AXIS_THREE_PI_OVER_FOUR = [-1,1];
	vector.AXIS_FIVE_PI_OVER_SIX = [-Math.sqrt(3),1];

	//Vector.linspace = function() {};

	vector.mult = function() {
		var args = Array.prototype.slice.call(arguments);
		return args.reduce(function(r, x) { return r*(isNaN(x) ? 0: x); },1);
	};

	//Vector.range = function() {};

	vector.sum = function() {
		var args = Array.prototype.slice.call(arguments);
		return args.reduce(function(r, x) { return r+(isNaN(x) ? 0: x); },0);
	};

	vector.zip = function() {
		var args = Array.prototype.slice.call(arguments);
		return Array.apply(null,Array(args[0].length)).map(function(_,i){
			return args.map(function(array){return array[i]});
		});
	};
	
	vector.angle = function(v, w) {
		return Math.acos(vector.dot(v,w)/vector.norm(v)/vector.norm(w));
	};
		
	// Vector.add(v, ...)
	vector.add = function() {
		var args = Array.prototype.slice.call(arguments);
		return vector.zip.apply(null, args).map(function(v) { return vector.sum.apply(null,v); });
	};
	
	// Vector.cross(v, w)
	vector.cross = function(v, w) {
		return [v[1]*w[2]-v[2]*w[1], v[2]*w[0]-v[0]*w[2], v[0]*w[1]-v[1]*w[0]];
	};
	
	// Vector.dot(v, ...)
	vector.dot = function(v, w) {
		var args = Array.prototype.slice.call(arguments);
		return vector.sum.apply(null, vector.zip.apply(null, args).map(function(v) { return vector.mult.apply(null,v); }));
	};
	
	vector.eq = function(v, w) {
		var args = Array.prototype.slice.call(arguments);
		return vector.zip.apply(null, args).reduce(function(a,b) { return b.reduce(function(c,d) {return c && d==b[0];}, true); }, true);
	};
	
	vector.floor = function() {
		var 
			args = Array.prototype.slice.call(arguments),
			v = args[0];

		return v.map(function(x) {return Math.floor(a);});
	};
	
	/*
	vector.modulo = function() {
		var args = Array.prototype.slice.call(arguments);
		return vector.sum.apply(null, vector.zip.apply(null, args).map(function(v) { return vector.mult.apply(null,v); }));
	};
	* */

	vector.minMaxProjection = function(points, v, fn) {
		var i, min, max, p;
		
		for (i = 0; i < points.length; i++) {
			p = pm.vector.projectOnto(points[i], v);
			p = v[0] ? p[0]: p[1];
			if (! i) {
				min = p;
				max = p;
			} else {
				if (p < min) {
					min = p;
				}
				if (p > max) {
					max = p;
				}
			}
		}
		
		if ("function" == typeof fn) {
			fn(min, max);
		}
		
		return [min, max];
	};

	vector.norm = function() {
		var args = Array.prototype.slice.call(arguments);

		if (args.length == 1) {
			var v = args[0];
			return Math.sqrt(vector.dot(v,v));
		} else if(args.length == 2) {
			var v = args[0];
			var p = args[1];
			//return Math.pow(sum.apply(v), 1/p);
			return undefined;
		}
		
		return undefined;
	};

	vector.orthogonalVector = function(v) {
		return [v[1], -v[0]];
	};

	vector.projectOnto = function(v, w) {
		return vector.scale(
			vector.dot(v, w) / vector.dot(w, w), 
			w );
	};

	vector.projectedLengthOnto = function(v, w) {
		return vector.norm( vector.projectOnto( v, w ) );
	};
	
	// vector.scale(a, v)
	// vector.scale(v, a)
	vector.scale = function() {
		var 
			args = Array.prototype.slice.call(arguments),
			a = args[0],
			v = args[1],
			swap;

		if (isNaN(a)) {
			swap = v;
			a = v;
			v = swap;
		}

		return v.map(function(x) {return a*x;});
	};
		
	// Vector.subtract(v, ...)
	vector.subtract = function() {
		var args = Array.prototype.slice.call(arguments);
		return vector.zip.apply(null, args).map(function(v) { return v.slice(1).reduce(function(r, x) { return r-(isNaN(x) ? 0: x); }, v[0]); });
	};
 
	pm.vector = pm.vector || {};
	
	var i;
	
	for (i in vector) {
		pm.vector[i] = vector[i];
	}
	
	return pm;
})(planetmars || {});
