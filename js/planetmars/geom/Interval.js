var planetmars = (function(pm, undefined) { 
	function Interval() {
	}

	Interval.intersect = function(a, b) {
		var 
			a1 = a[0],
			a2 = a[1],
			b1 = b[0],
			b2 = b[1];
			
		if (a1 > a2) {
			a1 = a[1];
			a2 = a[0];
		}
			
		if (b1 > b2) {
			b1 = b[1];
			b2 = b[0];
		}
		
		if (a2 >= b1 && a2 <= b2 && b1 >= a1 && b1 <= a2) {
			return [b1, a2];
		} else if (a1 >= b1 && a1 <= b2 && b2 >= a1 && b2 <= a2) {
			return [a1, b2];
		}  else if (a1 >= b1 && a2 <= b2) {
			return [a1, a2];
		}   else if (b1 >= a1 && b2 <= a2) {
			return [b1, b2];
		} else {
			return [0, 0];
		}
	};

	Interval.difference = function(a, b) {
		var 
			a1 = a[0],
			a2 = a[1],
			b1 = b[0],
			b2 = b[1];
			
		if (a1 > a2) {
			a1 = a[1];
			a2 = a[0];
		}
			
		if (b1 > b2) {
			b1 = b[1];
			b2 = b[0];
		}
		
		if (a2 >= b1 && a2 <= b2 && b1 >= a1 && b1 <= a2) {
			return [[a1, b1]];
		} else if (a1 >= b1 && a1 <= b2 && b2 >= a1 && b2 <= a2) {
			return [[b1, a1]];
		}  else if (a1 >= b1 && a2 <= b2) {
			return [[b1, a1], [a2, b2]];
		}   else if (b1 >= a1 && b2 <= a2) {
			return [[a1, b1], [b2, a2]];
		} else {
			return [];
		}
	};
 
	pm.geom = pm.geom || {};
	
	pm.geom.Interval = Interval;
	
	return pm;
})(planetmars || {});
