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
	
	function segment_coordinates(coordinate) {
		return function(segment) {
			return [segment[0][coordinate],segment[1][coordinate]];
		}
	}
	
	function solve(u,v,y) {
			
		var det, s, t;
		
		det = u[0]*v[1] - u[1]*v[0];
		
		if (det != 0) {
			
			s = (u[1]*y[0] - u[0]*y[1])/det;
			t = (v[0]*y[1] - v[1]*y[0])/det;
			
			return [s,t];
			
		}
		
	}
	
	function getCoordinate(s,i) {
		return [s[0][i], s[1][i]];
	}
	
	/**
	 * Cette fonction détecte une collision continue entre deux segments dont l'un est en mouvement et l'autre statique.
	 * Elle prend 2 segments `u` et `v` en paramètres, plus un vecteur de déplacement `d`. Le vecteur `v` est considéré comme statique.
	 */
	collision.segmentsCollide = function (u, v, d) {
		var vec = pm.vector,
			geom = pm.geom;
		
		var i, ps, qs, rs, time, collision, u_n, v_n, u_0, v_0, u_proj, v_proj, d_proj;
		
		time = 2;
		collision = new pm.collision.NoCollision();
		
		u_n = vec.orthogonalVector(u);
		
		u_0 = vec.projectOnto(u[0], u_n);
		
		v_proj = vec.projectSegmentOnto(v, u_n);
		
		i = u_n[0] ? 0: 1;
		
		// Vérifier si l'axe de `u` est séparateur
		
		if (! geom.intervalsIntersectStrict(
			[u_0, u_0], 
			getCoordinate(v_proj, i)) {
			
			// L'axe de `u` n'est pas séparateur
				
			d_proj = vec.projectOnto(d, u_n);
			
			u_proj = [u_0, vec.add(u_0, d_proj)];
			
			if (geom.intervalsIntersectStrict(
					getCoordinate(u_proj, i),
					getCoordinate(v_proj, i)
					) {
				
				// Collision potentielle, on vérifie si l'axe de `v` est séparateur
				
				v_n = vec.orthogonalVector(v);
		
				v_0 = vec.projectOnto(v[0], v_n);
		
				u_proj = vec.projectSegmentOnto(u, v_n);
				
				i = v_n[0] ? 0: 1;
		
				if (! geom.intervalsIntersectStrict(
					[v_0, v_0], 
					getCoordinate(u_proj, i)) {
				
					d_proj = vec.projectOnto(d, v_n);
					
					v_proj = [v_0, vec.add(v_0, d_proj)];
			
					if (geom.intervalsIntersectStrict(
							getCoordinate(u_proj, i),
							getCoordinate(v_proj, i)
							) {
						
						// Collision
						
						return pm.collision.Collision.create(u, v, d, 0, );
						
					} else {
						
						// L'axe de `v` est séparateur alors il n'y a pas de collision
						
						return new pm.collision.NoCollision();
						
					}
				
				} else {
					
					// L'axe de `u` est séparateur alors il n'y a pas de collision
						
					return new pm.collision.NoCollision();
					
				}
				
			}
			
		} else {
			
			// Vérifier si les segments sont en collision au temps `t` = 0
				
			v_n = vec.orthogonalVector(v);
	
			v_0 = vec.projectOnto(v[0], v_n);
	
			u_proj = vec.projectSegmentOnto(u, v_n);
			
			i = v_n[0] ? 0: 1;
		
			if (geom.intervalsIntersectStrict(
				[v_0, v_0], 
				getCoordinate(u_proj, i)) {
				
				// Pas d'axe séparateur il y a collision au temps `t` = 0
				
			}
			
		}
		
		v_n = vec.orthogonalVector(v);
		
		/*
		ps = [];
		qs = [];
		rs = [];
		
		ps.push(v);
		ps.push(v);
		ps.push(u);
		ps.push(u);
		
		qs.push(d);
		qs.push(d);
		qs.push(pm.vector.scale(-1, d));
		qs.push(qs[2]);
		
		rs.push(u[0]);
		rs.push(u[1]);
		rs.push(v[0]);
		rs.push(v[1]);
		
		for (i = 0; i < 4; i++) {
			
			p = pm.vector.subtract(ps[i][1], ps[i][0]);
			q = qs[i];
			r = pm.vector.subtract(rs[i], ps[i][0]);
			
			(function (s,t) {
				
				console.log(s,t);
					
				window.g
					.setFillAndStrokeStyle("#0C9")
					.fillCenteredRect(pm.vector.add(qs[i], pm.vector.scale(s,q)), 7);
				
				if (
					0 <= s && s <= 1
					&& s < time) {

					collision = new pm.collision.Collision();
					collision.time = s;
					collision.axis = pm.vector.orthogonalVector(p);
					collision.velocity = d;
					
				}
			}).apply(null, solve(p, q, r));
		}
		*/
		
		return collision;
		
		/*
		w = pm.vector.subtract(u[1], u[0]);
		u_n = pm.vector.orthogonalVector(w);
		
		coordinate = ortho[0] ? 0: 1;
		map = function(s) {
			return [s[0][coordinate], s[1][coordinate]];
		}
		
		u_0 = pm.vector.projectOnto(u[0], u_n);
		u_1 = pm.vector.add(u_0, pm.vector.projectOnto(d, u_n));
		
		u_proj = [u_0, u_1];
		
		v_0 = pm.vector.projectOnto(v[0], u_n);
		v_1 = pm.vector.projectOnto(v[1], u_n);
		
		v_proj = [v_0, v_1];
		
		if ( segmentsOverlap( u_0, v_0, u_n ) ) {
			
			w = pm.vector.subtract(v[1], v[0]);
			ortho = pm.vector.orthogonalVector(w);
		
			coordinate = ortho[0] ? 0: 1;
			map = function(s) {
				return [s[0][coordinate], s[1][coordinate]];
			}
			
			u_0 = map(pm.geom.projectSegmentOnto(u, ortho)); 
			
			v_0 = map(pm.geom.projectSegmentOnto(v, ortho));
		
			if ( pm.geom.intervalsIntersectStrict( u_0, v_0 ) ) {
			
				// Collision au temps `t` = 0

				collision = new pm.collision.Collision();
				collision.time = 0;
				collision.axis = pm.vector.scale(-1, pm.vector.orthogonalVector(pm.vector.subtract(v[1], v[0])));
				collision.velocity = v;
				
				return collision;
				
			}
			
		} 
			
		w = pm.vector.projectOnto(d, ortho);
		p = w[coordinate];
		u_f = [u_0[0], u_0[0]+p];

		if ( p == 0 || 
			! pm.geom.intervalsIntersectStrict( u_f, v_0 ) ) {
			// Pas de collision
		
			if (window.debug) {
				console.log("No collision");
			}
			
			return new pm.collision.NoCollision();

		} else {
			// Collision

			time = p < 0 ? (v_0[1] - u_0[0]) / p : (v_0[0] - u_0[1]) / p;
			
			// La normale de collision dépend du type de collision: 2 segments, segment/point ou 2 points
			
			time * 

			collision = new pm.collision.Collision();
			collision.time = time;
			collision.axis = pm.vector.scale(-1, pm.vector.orthogonalVector(pm.vector.subtract(v[1], v[0])));
			collision.velocity = v;
		
			if (window.debug) {
				console.log("Collision", collision);
			}
			
			return collision;

		}
		*/
		
	};
 
	pm.collision = pm.collision || {};
	
	var i;
	
	for (i in collision) {
		pm.collision[i] = collision[i];
	}
	
	return pm;
})(planetmars || {});
