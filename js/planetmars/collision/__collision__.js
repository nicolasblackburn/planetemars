var planetmars = (function(pm) { 
	var collision = {};
	
	collision.polygonsCollideProjective = function(shape1, shape2, velocity) {
		var collision, firstcollision, 
			i, j,
			visible1, visible2;
		
		firstcollision = new pm.collision.NoCollision();
			
		if (! shape1.length || ! shape2.length) {
			return firstcollision;
		}

		visible1 = pm.geom.visibleVertexes(shape1, pm.vector.scale(-1, velocity));
		visible2 = pm.geom.visibleVertexes(shape2, velocity);
		
		// Trouver le plus proche point d'intersection
		
		for (i = 1 ; i < visible1.length; i++) {
			
			for (j = 1; j < visible2.length; j++) {
				
				collision = pm.collision.segmentsCollide([visible1[i], visible1[i - 1]], [visible2[j], visible2[j - 1]], velocity);
				if (collision.collide && ( ! firstcollision.collide || collision.time < firstcollision.time ) ) {
					collision.shape1 = shape1;
					collision.shape2 = shape2;
					collision.velocity = velocity;
					collision.axis = collision.axis;
					firstcollision = collision;
				}
				
			}
		}
		
		return firstcollision;
	};
	
	collision.polygonsCollideSAT = function(shape1, shape2, velocity, fn) {
		var axis, collision, i, inter, proj1, proj2, j, k, mtvaxis, mtvoverlap, mtvsegment, n, nmin, nmax, p, pmin, pmax, segment, shape, shapes, v;
		
		// Vecteur de translation minimal
		mtvaxis = [0,0];
		mtvoverlap = 0;
		mtvsegment = [[0,0],[0,0]];
			
		shapes = [shape1, shape2];
		
		// Énumérer les shapes
		for (i = 0; i < shapes.length; i++) {
		  
		  shape = shapes[i];
		
		  // Énumérer les segments du polygone 'shape1'
		  for (j = 1; j <= shape.length; j++) {
		  
		    segment = [shape1[j % shape1.length], shape1[j - 1]];
		  
		    // Vecteur représentant le segment
		    v = pm.vector.subtract(segment[0], segment[1]);
		    
		    // Axe orthogonal utilisé pour le SAT
		    axis = pm.vector.orthogonalVector(v);
		    
		    // Projection de 'shape1' sur l'axe
		    pmin = 0;
		    pmax = 0;
		    nmin = 0;
		    nmax = 0;
		
			  for (k = 0; k < shape1.length; k++) {
			    p = shape1[k];
			    n = pm.vector.dot(p, axis);
			    
			    if (! k) {
		        pmin = p;
		        nmin = n;
		        pmax = p;
		        nmax = n;
			    } else {
			      if (n < nmin) {
			        nmin = n;
			        pmin = p;
			      }
			      if (n > nmax) {
			        nmax = n;
			        pmax = p;
			      }
			    }
			  }
			
			  proj1 = [nmin, nmax];
		    
		    // Projection de 'shape2' sur l'axe
		    pmin = 0;
		    pmax = 0;
		    nmin = 0;
		    nmax = 0;
		    
			  for (k = 0; k < shape2.length; k++) {
			    p = shape2[k];
			    n = pm.vector.dot(p, axis);
			    
			    if (! k) {
		        pmin = p;
		        nmin = n;
		        pmax = p;
		        nmax = n;
			    } else {
			      if (n < nmin) {
			        nmin = n;
			        pmin = p;
			      }
			      if (n > nmax) {
			        nmax = n;
			        pmax = p;
			      }
			    }
			  }
			
		    proj2 = [nmin, nmax];
			  
			  // Est-ce que l'intersection des deux projections est vide ?
			  
			  inter = [Math.max(proj1[0], proj2[0]), Math.min(proj1[1], proj2[1])];
			  
			  if (inter[0] > inter[1]) {
			    inter = [0, 0];
			  }
			  
			  if ( inter[1] - inter[0] == 0 ) {
			
			    // Oui, il n'y a pas de collision
			    return new pm.collision.NoCollision();
			    
			  } else {
			    
			    // On calcule le vecteur de translation minimal
			    if (i == 0 && j == 1) {
			      mtvaxis = axis;
			      mtvoverlap = inter[1] - inter[0];
		        mtvsegment = segment;
			      
			    } else if (inter[1] - inter[0] < mtvoverlap) {
			      mtvaxis = axis;
			      mtvoverlap = inter[1] - inter[0];
		        mtvsegment = segment;
			      
			    }
			  
			  }
		  }
		}
		
		// Pas d'axe séparateur alors il y a intersection
		collision = new pm.collision.Collision();
		collision.shape1 = shape1;
		collision.shape2 = shape2;
		collision.velocity = velocity;
		collision.axis = mtvsegment;
		return collision;
	};
	
	collision.segmentsCollide = function (u, v, w) {
		var axis, collision, finalaxis, p, segment, time, tmin, umin, umax, vmin, vmax, segments;
		
		collision = new pm.collision.NoCollision();
		segments = [];

		// Projection sur l'axe de u
		
		segment = pm.vector.subtract(u[1], u[0]);
		axis = pm.vector.orthogonalVector(segment);
		
		pm.vector.minMaxProjection([u[0], u[1]], axis, function(min, max) {
			umin = min;
			umax = max;
		});
		
		pm.vector.minMaxProjection([v[0], v[1]], axis, function(min, max) {
			vmin = min;
			vmax = max;
		});
		
		if ( ! pm.geom.intervalsIntersectStrict([umin, umax], [vmin, vmax]) ) {

			// Pas de collision statique
			p = pm.vector.projectOnto(w, axis);
			p = axis[0] ? p[0] : p[1];

			if ( p == 0 || 
				( p < 0 && umin < vmax && umin + p > vmax ) || 
				( p < 0 && umax < vmin ) || 
				( p > 0 && umax < vmin && umax + p < vmin ) || 
				( p > 0 && umin > vmax ) ) {

				// console.log("pas de collision u dynamique", umin, umax, vmin, vmax, p, axis);

				return new pm.collision.NoCollision();;

			} else {

				time = p < 0 ? (vmax - umin) / p : (vmin - umax) / p;

				// console.log("collision u dynamique", umin, umax, vmin, vmax, p, time, axis);
				
				if ( ! collision.collide || time < collision.time ) {

					collision = new pm.collision.Collision();
					collision.time = time;
					collision.axis = axis;
					collision.velocity = v;

				}

			}
		
		} else {

			// console.log("collision u statique", umin, umax, vmin, vmax, axis);

			if (umin == vmin || umin == vmax) {
				finalaxis = axis;
			}

		}

		// Projection sur l'axe de v
		
		segment = pm.vector.subtract(v[1], v[0]);
		axis = pm.vector.orthogonalVector(segment);
		
		pm.vector.minMaxProjection([u[0], u[1]], axis, function(min, max) {
			umin = min;
			umax = max;
		});
		
		pm.vector.minMaxProjection([v[0], v[1]], axis, function(min, max) {
			vmin = min;
			vmax = max;
		});
		
		if ( ! pm.geom.intervalsIntersectStrict([umin, umax], [vmin, vmax]) ) {
			
			// Pas de collision statique
			p = pm.vector.projectOnto(w, axis);
			p = axis[0] ? p[0] : p[1];

			if ( p == 0 || 
				( p < 0 && umin < vmax && umin + p > vmax ) || 
				( p < 0 && umin > vmax && umin + p > vmax ) || 
				( p < 0 && umax < vmin ) || 
				( p > 0 && umax < vmin && umax + p < vmin ) || 
				( p > 0 && umin > vmax ) ) {

				// console.log("pas de collision v dynamique", umin, umax, vmin, vmax, p, axis);

				return new pm.collision.NoCollision();;

			} else {

				time = p < 0 ? (vmax - umin) / p : (vmin - umax) / p;

				// console.log("collision v dynamique", umin, umax, vmin, vmax, p, time, axis);
				
				if ( ! collision.collide || time < collision.time ) {

					collision = new pm.collision.Collision();
					collision.time = time;
					collision.axis = axis;
					collision.velocity = v;

				}

			}

		} else {

			// console.log("collision v statique", umin, umax, vmin, vmax, axis);

			if ( vmin == umin || vmin == umax ) {
				finalaxis = axis;
			}

		}

		// Projection sur l'axe de w
		axis = pm.vector.orthogonalVector(w);
		
		pm.vector.minMaxProjection([u[0], u[1]], axis, function(min, max) {
			umin = min;
			umax = max;
		});
		
		pm.vector.minMaxProjection([v[0], v[1]], axis, function(min, max) {
			vmin = min;
			vmax = max;
		});

		if ( ! pm.geom.intervalsIntersectStrict([umin, umax], [vmin, vmax]) ) {

			return new pm.collision.NoCollision();

		} else {


		}
				
		if ( ! collision.collide ) {

			collision = new pm.collision.Collision();
			collision.time = 0;
			collision.axis = finalaxis;
			collision.velocity = v;

		}
		
		// console.log("final", collision.time, collision.axis);

		return collision;
		
	};
 
	pm.collision = pm.collision || {};
	
	var i;
	
	for (i in collision) {
		pm.collision[i] = collision[i];
	}
	
	return pm;
})(planetmars || {});
