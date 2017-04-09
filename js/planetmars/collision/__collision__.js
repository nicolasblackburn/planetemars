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
				
				collision = pm.collision._segmentsCollide([visible1[i], visible1[i - 1]], [visible2[j], visible2[j - 1]], velocity);
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
	 * u: segment 1
	 * v: segment 2
	 */
	collision.pointSegmentCollide = function(p, v, dr) {
		var vec = planetmars.vector;
		var a, b, c, d, x, y, D, s, t, u;
		
		// Résoudre le système u[0] + s*(u[1] - u[0]) = v[0] + t*(v[1]- v[0])
		
		// Précalculs
		u = [p, vec.add(p, dr)];
		a = u[1][0] - u[0][0];
		b = v[0][0] - v[1][0];
		c = u[1][1] - u[0][1];
		d = v[0][1] - v[1][1];
		x = v[0][0] - u[0][0];
		y = v[0][1] - u[0][1];
		
		// Déterminant
		D = a*d - b*c;
		
		// Solution du système (fois le déterminant)
		s = d*x - b*y;
		t = a*y - c*x;
		
		// Solution des contraintes
		if (0 <= s && s <= D && 0 <= t && t <= D) {
			// Collision!
			return [true, s/D, t/D];
			
		} else {
			// Pas de collision
			return [false, s/D, t/D];
		}
	}
	
	// segmentsCollide
	collision.segmentsCollide = function(u, v, dr) {
		var vec = planetmars.vector;

		var 
			r0 = collision.pointSegmentCollide(u[0], v, dr),
			r1 = collision.pointSegmentCollide(u[1], v, dr),
			ta = r0[1],
			sa = r0[2],
			tb = r1[1],
			sb = r1[2],
			ds = sa - sb,
			dt = ta - tb,
			s0 = Math.max(0, sa),
			s1 = Math.min(1, sb),
			t0,
			t1,
			swap;

		function t(s) {
			return (s - sb)/ds*ta - (s - sa)/ds*tb;
		}

		function s(t) {
			return (t - tb)/dt*sa - (t - ta)/dt*sb;
		}
			
		if (s0 <= s1) {
			t0 = t(s0);
			t1 = t(s1);
			
			if (t0 > t1) {
				swap = t1;
				t1 = t0;
				t0 = swap;
			}
			
			t0 = Math.max(0, t0);
			t1 = Math.min(1, t1);
			
			if (t0 <= t1) {
				// Collision !
				s0 = s(t0);
				
				return [true, t0, s0];
				
			} else {
				// Pas de collision
				return [false, 0, 0];
			}
			
		} else {
			// Pas de collision
			return [false, 0, 0];
		}
	} 
	
	/**
	 * Cette fonction détecte une collision continue entre deux segments dont l'un est en mouvement et l'autre statique.
	 * Elle prend 2 segments `u` et `v` en paramètres, plus un vecteur de déplacement `d`. Le vecteur `v` est considéré comme statique.
	 */
	collision._segmentsCollide = function (u, v, d) {
		var collision, u_n, v_n, d_n, w, u_a, u_b, v_a, v_b, w, p, t, norm;
		
		collision = new pm.collision.NoCollision();

		// Projection sur le vecteur normal au segment `u`
		
		w = pm.vector.subtract(u[1], u[0]);
		u_n = pm.vector.orthogonalVector(w);
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(u, u_n), function(min, max) {
			u_a = min;
		});
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(v, u_n), function(min, max) {
			v_a = min;
			v_b = max;
		});
		
		if ( ! pm.geom.intervalsIntersectStrict([u_a, u_a], [v_a, v_b]) ) {
			// L'axe du segment `u` est séparateur, pas de collision au temps `t` = 0
			
			w = pm.vector.projectOnto(d, u_n);
			p = u_n[0] ? w[0] : w[1];

			if ( ! pm.geom.intervalsIntersectStrict([u_a, u_a + p], [v_a, v_b]) ) {

				return new pm.collision.NoCollision();

			} else {

				t = p < 0 ? (v_b - u_a) / p : (v_a - u_a) / p;
				
				if ( ! collision.collide || t < collision.time ) {

					collision = pm.collision.Collision.create(
						u, v, u, v, d, t, u_n
					);

				}

			}
		
		} else {

			if (pm.util.floatEq(u_a, v_a, 0.0001) || pm.util.floatEq(u_a, v_b, 0.0001)) {
				// Collision point à segment
				norm = u_n;
			}

		}

		// Projection sur le vecteur normal au segment `v`
		
		w = pm.vector.subtract(v[1], v[0]);
		v_n = pm.vector.orthogonalVector(w);
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(u, v_n), function(min, max) {
			u_a = min;
			u_b = max;
		});
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(v, v_n), function(min, max) {
			v_a = min;
		});
		
		if ( ! pm.geom.intervalsIntersectStrict([u_a, u_b], [v_a, v_a]) ) {
			// L'axe du segment `v` est séparateur, pas de collision au temps `t` = 0
			
			w = pm.vector.projectOnto(d, v_n);
			p = v_n[0] ? w[0] : w[1];

			if (! pm.geom.intervalsIntersectStrict([u_a, u_a + p], [v_a, v_a]) ) {

				return new pm.collision.NoCollision();;

			} else {

				t = p < 0 ? (v_a - u_a) / p : (v_a - u_b) / p;
				
				if ( ! collision.collide || t < collision.time ) {

					collision = pm.collision.Collision.create(
						u, v, u, v, d, t, v_n
					);

				}

			}

		} else {

			if ( pm.util.floatEq(v_a, u_a, 0.0001) || pm.util.floatEq(v_a, u_b, 0.0001) ) {
				// Collision point à segment
				norm = v_n;
			}

		}

		// Projection sur le vecteur normal du déplacement `d`
		
		d_n = pm.vector.orthogonalVector(d);
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(u, d_n), function(min, max) {
			u_a = min;
			u_b = max;
		});
		
		pm.util.leftApply(null, pm.vector.minMaxProjection(v, d_n), function(min, max) {
			v_a = min;
			v_b = max;
		});

		if ( ! pm.geom.intervalsIntersectStrict([u_a, u_b], [v_a, v_b]) ) {

			return new pm.collision.NoCollision();

		} 
				
		if ( ! collision.collide ) {
			
			if ( ! norm ) {
				// Collision segments interpénétrés
				norm = v_n;
			}

			collision = pm.collision.Collision.create(
				u, v, u, v, d, 0, norm
			);

		}

		return collision;
		
	};
 
	pm.collision = pm.collision || {};
	
	var i;
	
	for (i in collision) {
		pm.collision[i] = collision[i];
	}
	
	return pm;
})(planetmars || {});
