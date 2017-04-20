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
	
	/**
	 * Collision point à segment
	 * Retourne un array [bool:collide,int:t,int:s,int:d] 
	 * où collide = true s'il y a collision, false sinon
	 *    t est le temps de la collision (relatif à d)
	 *    s est le multiplicateur (relatif à d) pour trouver le point de collision le long du segment
	 *    d est le ratio de comparaison
	 */
	collision.pointSegmentCollide = function(point, segment, velocity) {
		var a,b,c,d,det,s,t,p,q;

		a = velocity[0];
		b = segment[0][0]-segment[1][0];
		c = velocity[1];
		d = segment[0][1]-segment[1][1];

		det = a*d - b*c;

		p = segment[0][0] - point[0];
		q = segment[0][1] - point[1];

		if (det === 0) {
			
			// mouvement collinéaire

			if (c*p === a*q) {

				// mouvement confondu
				d = velocity[0];

				if (d !== 0) {

					// On compare la coordonnée en `x` si elle n'est pas nulle
					a = p;
					b = segment[1][0] - point[0];

				} else {

					// Sinon on compare la coordonnée en `y`
					d = velocity[1];
					a = q;
					b = segment[1][1] - point[1];

				}

				// Orientation négative
				if (d < 0) {
					d = -d
					a = -a;
					b = -b;
				}

				t = Math.min(a, b);

				if ( 0 <= t && t <= d) {
		
					// Collision
					return [true, t, 0, d];
				
				} else {

					// Pas de collision
					return [false, t, 0, d];

				} 

			} else {

				// mouvement parallèle mais non-confondu avec la droite du segment, donc il n'y a pas de collision
				return [false, 0, 0, det];

			}
		
		} else {
			
			// résoudre `s` et `t` avec la matrice inverse
			// [[a c],[b d]]^(-1) = [[d -c],[-b a]]/det

			t =  d*p - b*q;
			s = -c*p + a*q;

			// Orientation négative
			if (det < 0) {
				det = -det;
				s = -s;
				t = -t;
			} 

			if (0 <= s && s <= det && 0 <= t && t <= det) {
			
				// Collision
				return [true, t, s, det];
			
			} else {

				// Pas de collision
				return [false, t, s, det];

			} 
		}
	};
	
	collision.segmentsCollide = function(segmentA, segmentB, velocity) {
		var 
			geom = pm.geom,
			vec = pm.vector;
			
		var a,b,c,d,det,s,t,p,q,v0,v1,v,index, closest, r0, r1, r, min;

		a = segmentA[1][0]-segmentA[0][0];
		b = segmentB[1][0]-segmentB[0][0];
		c = segmentA[1][1]-segmentA[0][1];
		d = segmentB[1][1]-segmentB[0][1];

		det = a*d - b*c;
		
		p = (segmentB[0][0]-segmentA[0][0])*velocity[0] + (segmentB[0][1]-segmentA[0][1])*velocity[1];
		q = (segmentB[1][0]-segmentA[0][0])*velocity[0] + (segmentB[1][1]-segmentA[0][1])*velocity[1];
		
		index = 0;
		
		if (q < p) {
			index = 1;
		}
		
		closest = segmentB[index];
		
		p = segmentA[1];
		
		if (det < 0) {
			det = -det;
			a = -a;
			b = -b;
			c = -c;
			d = -d;
			p = segmentA[0];
		}
		
		v0 = [vec.add(closest, [b,d]), closest];
		v1 = [closest, vec.add(closest, [a,c])];
		
		r0 = collision.pointSegmentCollide(p, v0, velocity);
		r1 = collision.pointSegmentCollide(p, v1, velocity);
		
		if (!r0[0] && !r1[0]) {
			
			// Pas de collision
			return new pm.collision.NoCollision();
			
		} else {
			
			v = v0;
			r = r0;
			s = vec.add(closest, [b,d]);
			
			if (!r0[0] || (r1[0] && r1[1] < r0[1])) {
				v = v1;
				r = r1;
				s = vec.add(closest, [a,c]);
			}
			
			if (p[0] === s[0] && p[1] === s[1]) {
				
				// Pas de collision car le point frôle une extrémité
				return new pm.collision.NoCollision();
				
			} else {
			
				// Collision !
				return pm.collision.Collision.create(segmentA, v, segmentA, v, velocity, r[1]/r[3], r[2]/r[3], pm.vector.subtract(v[1], v[0]));
			
			}
			
		}
	};
 
	pm.collision = pm.collision || {};
	
	var i;
	
	for (i in collision) {
		pm.collision[i] = collision[i];
	}
	
	return pm;
})(planetmars || {});
