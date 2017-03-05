var planetmars = (function(pm) { 
	var geom = {};

	geom.boundingBox = function (points) {
		var box = [], i, maxx, maxy, minx, miny;
		
		minx = points[0][0];
		maxx = points[0][0];
		miny = points[0][1];
		maxy = points[0][1];

		for (i = 0; i < points.length; i++ ) {
			if (points[i][0] < minx) {
				minx = points[i][0];
			}
			if (points[i][0] > maxx) {
				maxx = points[i][0];
			}
			if (points[i][1] < miny) {
				miny = points[i][1];
			}
			if (points[i][1] > maxy) {
				maxy = points[i][1];
			}
		}

		return [[minx,miny], [maxx, miny], [maxx, maxy], [minx, maxy]];
	};

	geom.furthestVertex = function (points, v) {
		return points[geom.furthestVertexIndex(points, v)];
	};

	geom.furthestVertexIndex = function (points, v) {
		var maxi, maxp;
	
		maxi = 0;
		maxp = pm.vector.dot(points[maxi], v);

		for (i = 0; i < points.length; i++ ) {
			p = pm.vector.dot(points[i], v);

			if (p > maxp) {
				maxi = i;
				maxp = p;
			}
		}

		return maxi;
	};

	geom.intervalsIntersect = function (inter1, inter2) {
		var umin, umax, vmin, vmax;
		
		umin = inter1[0];
		umax = inter1[1];
		
		if (umin > umax) {
			umin = inter1[1];
			umax = inter1[0];
		}
		
		vmin = inter2[0];
		vmax = inter2[1];
		
		if (vmin > vmax) {
			vmin = inter2[1];
			vmax = inter2[0];
		}
		
		if ( ( umin <= vmin && vmin <= umax ) ||
			( umin <= vmin && vmax <= umax ) ||
			( vmin <= umin && umin <= vmax ) ||
			( vmin <= umin && umax <= vmax ) ) {
			
			return true;
			
		} else {
			
			return false;
			
		}
	};

	geom.intervalsIntersection = function (inter1, inter2) {
		var umin, umax, vmin, vmax;
		
		umin = inter1[0];
		umax = inter1[1];
		
		if (umin > umax) {
			umin = inter1[1];
			umax = inter1[0];
		}
		
		vmin = inter2[0];
		vmax = inter2[1];
		
		if (vmin > vmax) {
			vmin = inter2[1];
			vmax = inter2[0];
		}
		
		if ( ( umin <= vmin && vmin <= umax ) ||
			( umin <= vmin && vmax <= umax ) ||
			( vmin <= umin && umin <= vmax ) ||
			( vmin <= umin && umax <= vmax ) ) {
			
			return true;
			
		} else {
			
			return false;
			
		}
	};

	geom.intervalsIntersectStrict = function (inter1, inter2) {
		var umin, umax, vmin, vmax;
		
		umin = inter1[0];
		umax = inter1[1];
		
		if (umin > umax) {
			umin = inter1[1];
			umax = inter1[0];
		}
		
		vmin = inter2[0];
		vmax = inter2[1];
		
		if (vmin > vmax) {
			vmin = inter2[1];
			vmax = inter2[0];
		}
		
		if ( ( umin <= vmin && vmin < umax ) ||
			( umin <= vmin && vmax <= umax ) ||
			( vmin <= umin && umin < vmax ) ||
			( vmin <= umin && umax <= vmax ) ) {
			
			return true;
			
		} else {
			
			return false;
			
		}
	};
	
	geom.rectangle = function (position, dimension) {
		if (
			( dimension[0] < 0 && dimension[1] > 0 )
			|| ( dimension[0] > 0 && dimension[1] < 0 ) ) {
			
			return [
				position,
				pm.vector.add(position, [0, dimension[1]]),
				pm.vector.add(position, dimension),
				pm.vector.add(position, [dimension[0], 0]) ];
				
		} else {
			
			return [
				position,
				pm.vector.add(position, [dimension[0], 0]),
				pm.vector.add(position, dimension),
				pm.vector.add(position, [0, dimension[1]]) ];
				
		}
	};
	
	geom.regularPolygon = function (edgesCount, radius, origin) {
		var freq, i, points;

		points = [];
		
		for (i = 0, freq = 2*Math.PI/edgesCount; i < edgesCount; i++) {
			points.push( pm.vector.add(origin, [Math.cos(i*freq)*radius, Math.sin(i*freq)*radius]) );
		}

		return points;
	};
	
	geom.rightTriangle = function (position, dimension) {
		if (
			( dimension[0] < 0 && dimension[1] > 0 )
			|| ( dimension[0] > 0 && dimension[1] < 0 ) ) {
				
			return [
				position,
				pm.vector.add(position, [0, dimension[1]]),
				pm.vector.add(position, [dimension[0], 0]) ];
				
		} else {
			
			return [
				position,
				pm.vector.add(position, [dimension[0], 0]),
				pm.vector.add(position, [0, dimension[1]]) ];
				
		 }
	};
	
	geom.segmentsIntersect = function (u0, u1, v0, v1, fn) {
		var c, d, k, l, s, t, x0, x1, x2, x3, mint, maxt;
		
		c = v1[0]*u1[1] - v1[0]*u0[1] - v0[0]*u1[1] + v0[0]*u0[1] - v1[1]*u1[0] + v1[1]*u0[0] + v0[1]*u1[0] - v0[1]*u0[0];
		
		// segments colinéaires
		if (! c) {
			
			k = (u0[1]*u1[0] - u0[0]*u1[1]) / (u1[1] - u0[1]);
			l = (v0[1]*v1[0] - v0[0]*v1[1]) / (v1[1] - v0[1]);
			
			if (k != l) {
				// les deux droites des segments ne sont pas confondues, les segments ne se rencontrent jamais 
				
				return false;
				
			} else {
				// les deux droites des segments sont confondues, on vérifie si les segments se rencontrent
				
				x0 = u0[0];
				x1 = u1[0];
				
				if (x0 > x1) {
					
					x0 = u1[0];
					x1 = u0[0];
					
				}
				
				x2 = v0[0];
				x3 = v1[0];
				
				if (x2 > x3) {
					
					x2 = v1[0];
					x3 = v0[0];
					
				}
				
				mint = 1;
				maxt = 0;
				
				if (x0 <= x2 && x2 <= x1) {
					
					mint = (x2 - x0) / (x1 - x0);
					
				}
				
				if (x0 < x3 && x3 > x1) {
					
					maxt = (x3 - x0) / (x1 - x0);
					
				}
				
				if (x2 <= x0 && x0 <= x3) {
					
					mint = 0;
					
				}
				
				if (x2 < x1 && x1 > x3) {
					
					maxt = 1;
					
				}
				
				if (mint <= maxt) {
					
					if ("function" == typeof fn) {
						fn.call(null, mint, maxt);
					}
					
					return true;
					
				} else {
					
					return false;
					
				}
				
			}
			
		} else {
			// On pose u0 + s*(u1 - u0) = v0 + t*(v0 - v1) et on résoud s et t
			// Si s et t compris entre 0 et 1 alors il y a croisement des segments
			
			s = (v1[1]*u0[0] - v0[1]*u0[0] - v1[1]*v0[0] - v1[0]*u0[1] + v0[0]*u0[1] + v1[0]*v0[1]) / c;
			
			if (! (0 <= s && s < 1) ) {
				
				return false;
				
			} else {
				
				d = u1[1]*v1[0] - u1[1]*v0[0] - u0[1]*v1[0] + u0[1]*v0[0] - u1[0]*v1[1] + u1[0]*v0[1] + u0[0]*v1[1] - u0[0]*v0[1];
				t = (u1[1]*u0[0] - u1[1]*v0[0] + u0[1]*v0[0] - u1[0]*u0[1] + u1[0]*v0[1] - u0[0]*v0[1]) / d;
				
				if (! (0 <= t && t < 1) ) {
					
					return false;
					
				} else {
					
					if ("function" == typeof fn) {
						fn.call(null, s, s);
					}
					
					return true;
					
				}
				
			}
			
		}
		
	};
		
	geom.transform = function (points, t) {
		
	};
		
	geom.translate = function (points, t) {
		var i, translatedPoints = [];
		
		for (i = 0; i < points.length; i++) {
			translatedPoints[i] = pm.vector.add(points[i], t);
		}
		
		return translatedPoints;
	};
		
	geom.visibleVertexes = function (points, v) {
		var a, i, n, p0, p1, support, visibleVertexes = [], w;
		
		// Vecteur perpendiculaire
		w = [v[1], -v[0]];
		
		// Point de support
		support = geom.furthestVertexIndex(points, pm.vector.scale(-1, v));
		
		// Énumérer les segments visibles de polyA dans le sens anti-horaire

		n = 0;
		i = support;
		p0 = points[i];
		visibleVertexes.push(p0);

		i = i - 1 < 0 ? points.length - 1: i - 1;
		p1 = points[i];
		a = pm.vector.dot(pm.vector.subtract(p1, p0), w);

		while (n < points.length && a < 0) {
			visibleVertexes.unshift(p1);
			
			n++;
			i = i - 1 < 0 ? points.length - 1: i - 1;
			p0 = p1;
			p1 = points[i];
			a = pm.vector.dot(pm.vector.subtract(p1, p0), w);
		}

		// Énumérer les segments visibles de polyA dans le sens horaire
		n = 0;
		i = support;
		p0 = points[i];
		
		i = i + 1 > points.length - 1 ? 0: i + 1;
		p1 = points[i];
		a = pm.vector.dot(pm.vector.subtract(p1, p0), w);

		while (n < points.length && a > 0) {
			visibleVertexes.push(p1);

			n++;
			i = i + 1 > points.length - 1 ? 0: i + 1;
			p0 = p1;
			p1 = points[i];
			a = pm.vector.dot(pm.vector.subtract(p1, p0), w);
		}
		
		return visibleVertexes;
	};
 
	pm.geom = pm.geom || {};
	
	var i;
	
	for (i in geom) {
		pm.geom[i] = geom[i];
	}
	
	return pm;
})(planetmars || {});
