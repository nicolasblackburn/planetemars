(function(pm, $) {
	$(function () {
		$.ajaxSetup({cache:false});
		var game = window.game = new planetmars.lang.Game(document.getElementById("main"), {
			autoplay: true,
			init: function() {
				var i;
				
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP['w'], 'move_up');
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP['a'], 'move_left');
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP['s'], 'move_down');
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP['d'], 'move_right');
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP[' '], 'action_fire');
				this.keyboardMap.set(pm.event.KeyEvent.KEY_MAP['i'], 'show_menu');
				
				this.screens['title-screen'] = new planetmars.screen.TitleScreen(this, "#title-screen");
				this.screens['options-screen'] = new planetmars.screen.OptionsScreen(this, "#options-screen");
				this.screens['game-screen'] = new planetmars.screen.GameScreen(this);
				
				//this.setScreen('title-screen');
				this.setScreen('game-screen');
		
				window.g = new planetmars.util.Graphics(this.screens['game-screen'].graphics);
			},
			resources: {
				images: [
					"images/floor.png",
					"images/rocks.png",
					"images/tileset-1.png", 
					"images/tileset-2.png" 
				],
				maps: [
					"json/maps/world.json"
				],
				sounds: [],
				sprites: [
					"json/sprites/bat.json",
					"json/sprites/beast.json",
					"json/sprites/bullet.json",
					"json/sprites/crab.json",
					"json/sprites/player.json",
					"json/sprites/spore.json",
					"json/sprites/worm.json"
				]
			}
		});
	});

})(planetmars || {}, jQuery);

var vec = planetmars.vector,
	collide = planetmars.collision.segmentsCollide,
	collide2 = planetmars.collision.movingSegmentsCollide;

var 
	A0 = vec.add([0,30],[300,300]),
	B0 = vec.add([20,0],[300,300]),
	V = [50,-10],
	A1 = vec.add(vec.subtract(vec.add(A0,V),[300,300]),[300,300]),
	B1 = vec.add(vec.subtract(vec.add(B0,V),[300,300]),[300,300]),
	C0 = vec.add([30,50],[300,300]),
	C1 = vec.add([30,-20],[300,300]),
	blue = "#09C",
	green = "#096",
	white = "#9CF",
	R0 = collide([A0, A1], [C0, C1]),
	R1 = collide([B0, B1], [C0, C1]),
	tA = R0[1]/R0[3],
	sA = R0[2]/R0[3],
	tB = R1[1]/R1[3],
	sB = R1[2]/R1[3],
	sA_minus_sB = sA - sB,
	tA_minus_tB = tA - tB,
	S0 = Math.max(0, sA),
	S1 = Math.min(1, sB),
	T0,
	T1,
	w;
	
function show() {
	if (S0 > S1) {
		console.log("No collision");
	} else {
		T0 = t(S0);
		T1 = t(S1);
		
		if (T0 > T1) {
			w = T1;
			T1 = T0;
			T0 = w;
		}
		
		T0 = Math.max(0, T0);
		T1 = Math.min(1, T1);
		
		S0 = s(T0);
		S1 = s(T1);
		
		if (T0 > T1) {
			console.log("No collision");
		} else {
			console.log("Collide!");
		}
	}

	g
		.setStyle("#FFF")
		.strokeLine(A0,B0)
		.strokeLine(A1,B1)
		.setStyle("#9CF")
		.strokeLine(C0,C1);
	
	var 
		dA = vec.subtract(A1,A0),
		P0 = vec.add(C0, vec.scale(S0, vec.subtract(C1,C0))),
		P1 = vec.add(C0, vec.scale(S1, vec.subtract(C1,C0))),
		//P2 = vec.add(C0, vec.scale(s(tB), vec.subtract(C1,C0))),
		//P3 = vec.add(C0, vec.subtract(C1,C0)),
		//P0 = vec.add(C0),
		//P1 = vec.add(C0, vec.scale(s(tA), vec.subtract(C1,C0))),
		//P2 = vec.add(C0, vec.scale(s(tB), vec.subtract(C1,C0))),
		//P3 = vec.add(C0, vec.subtract(C1,C0)),
		//Q0 = vec.add(P0, vec.scale(-t(0), dA)),
		//Q1 = vec.add(P1, vec.scale(-t(sA), dA)),
		//Q2 = vec.add(P2, vec.scale(-t(sB), dA)),
		//Q3 = vec.add(P3, vec.scale(-t(1), dA)),
		Q0 = vec.add(P0, vec.scale(-T0, dA)),
		Q1 = vec.add(P1, vec.scale(-T1, dA)),
		H0 = vec.add(C0, vec.scale(S0, vec.subtract(C1,C0))),
		H1 = vec.add(H0,  vec.scale(-T0, dA));
		//Q2 = vec.add(P2, vec.scale(-t(sB), dA)),
		//Q3 = vec.add(P3, vec.scale(-t(1), dA));
	
	g
		.setStyle("#59F")
		.strokeLine(H0,H1)
		//.strokeLine(P1,Q1)
		//.strokeLine(P2,Q2)
		//.strokeLine(P3,Q3)
		.setStyle("#6F3")
		.fillCenteredCircle(H0, 3);
		//.fillCenteredCircle(P1, 3);
		//.fillCenteredCircle(P2, 3)
		//.fillCenteredCircle(P3, 3);
}

function t(s) {
	return (s - sB)/sA_minus_sB*tA - (s - sA)/sA_minus_sB*tB;
}

function s(t) {
	return (t - tB)/tA_minus_tB*sA - (t - tA)/tA_minus_tB*sB;
}

function drawSegmentsCollisionInfo(segment1, segment2, v, collision) {
	var axislength, axisscale, closest1, g, 
		intershape1, intershape2, interv1, interv2, intervertex1, 
		intervertex2, o, orthoaxis, visible1, visible2;
	
	// console.log(collide);

	g = new planetmars.util.Graphics(game.currentScreen.graphics);
	o = [game.width / 2, game.height / 2];

	closest1 = planetmars.geom.furthestVertex(segment1, v);
	visible1 = planetmars.geom.visibleVertexes(segment1, planetmars.vector.scale(-1, v));
	visible2 = planetmars.geom.visibleVertexes(segment2, v);
	
	g
		.save()
		.setStyle("#C90")
		.strokePoints(visible1)
		.each(visible1, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setStyle("#A60")
		.strokePoints(visible2)
		.each(visible2, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setStyle("#9C0")
		.strokeLine(closest1, planetmars.vector.add(closest1, v))
		.fillCenteredCircle(planetmars.vector.add(closest1, v), 3)
	
	if (collision && collision.collide) {
		interv1 = planetmars.vector.scale(collision.time, v);
		intershape1 = planetmars.geom.translate(segment1, interv1);
		intervertex1 = planetmars.vector.add(closest1, interv1);
		
		axislength = planetmars.vector.norm(collision.axis);
		axisscale = 96 / axislength;
		orthoaxis = planetmars.vector.orthogonalVector(collision.axis);
		
		interv2 = planetmars.vector.subtract(
				planetmars.vector.projectOnto( v, orthoaxis ),
				planetmars.vector.projectOnto( interv1, orthoaxis ) );
				
		intershape2 = planetmars.geom.translate(intershape1, interv2);
		intervertex2 = planetmars.vector.add(intervertex1, interv2);
		
		g
			//.setStyle("#0C6")
			//.strokeShape(intershape1)
			//.setStyle("#09C")
			//.strokeShape(intershape2)
			.lineWidth(2)
			.setStyle("#0C6")
			.strokeLine(closest1, intervertex1)
			.fillCenteredCircle(intervertex1, 3)
			.setStyle("#09C")
			.strokeLine(intervertex1, intervertex2)
			.fillCenteredCircle(intervertex2, 3);
	}
	
	g.restore();
}

function drawShapesCollisionInfo(shape1, shape2, v, collision) {
	var axislength, axisscale, closest1, g, 
		intershape1, intershape2, interv1, interv2, intervertex1, 
		intervertex2, o, orthoaxis, visible1, visible2, p;
	
	// console.log(collide);
	
	g = new planetmars.util.Graphics(game.currentScreen.graphics);
	o = [game.width / 2, game.height / 2];

	closest1 = planetmars.geom.furthestVertex(shape1, v);
	visible1 = planetmars.geom.visibleVertexes(shape1, planetmars.vector.scale(-1, v));
	visible2 = planetmars.geom.visibleVertexes(shape2, v);
	
	g
		.save()
		.setStyle("#AAA") // grey
		.strokeShape(shape1)
		.strokeShape(shape2)
		.setStyle("#C90") // yellow
		.strokePoints(visible1)
		.each(visible1, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.strokePoints(visible2)
		.each(visible2, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setStyle("#9C0") // green
		.strokeLine(closest1, planetmars.vector.add(closest1, v))
		.fillCenteredRect(planetmars.vector.add(closest1, v), 4)
	
	if (collision && collision.collide) {
		
		//p = planetmars.vector.add(closest1, planetmars.vector.scale(collision.time, v));
		
		//g
		//	.setStyle("#09C")
		//	.fillCenteredRect(p, 6);
		
		interv1 = planetmars.vector.scale(collision.time, v);
		intershape1 = planetmars.geom.translate(shape1, interv1);
		intervertex1 = planetmars.vector.add(closest1, interv1);
		
		axislength = planetmars.vector.norm(collision.axis);
		axisscale = 96 / axislength;
		orthoaxis = planetmars.vector.orthogonalVector(collision.axis);
		
		interv2 = planetmars.vector.subtract(
			planetmars.vector.projectOnto( v, orthoaxis ),
			planetmars.vector.projectOnto( interv1, orthoaxis ) );
				
		intershape2 = planetmars.geom.translate(intershape1, interv2);
		intervertex2 = planetmars.vector.add(intervertex1, interv2);
		
		g
			//.setStyle("#0C6")
			//.strokeShape(intershape1)
			//.setStyle("#09C")
			//.strokeShape(intershape2)
			.lineWidth(2)
			.setStyle("#0C6")
			.strokeLine(closest1, intervertex1)
			.fillCenteredRect(intervertex1, 6)
			.setStyle("#09C")
			.strokeLine(intervertex1, intervertex2)
			.fillCenteredRect(intervertex2, 6);
	}
	
	g.restore();
}

function testShapesCollision() {
	var collision, shape1, shape2, v;
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	shape1 = planetmars.geom.regularPolygon(5, 32, [100,100]);
	shape2 = planetmars.geom.regularPolygon(7, 32, [192,132]);
	v = [184, 10];
	collision = planetmars.collision.polygonsCollideProjective(shape1, shape2, v);
	console.log(collision);
	
	drawShapesCollisionInfo(shape1, shape2, v, collision);
}

function testSATShapesCollision() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = [[144, 97],[192, 97],[192, 145],[144, 145]];
	shape2 = planetmars.geom.translate([[136, 164],[184, 212],[136, 212]], [100,-40]);
	
	v = [200, 100];
	
	collision = new planetmars.collision.NoCollision();
	
	planetmars.collision.polygonsCollideSAT(shape1, shape2, v, function(t, axis) {
		
		collision = new planetmars.collision.Collision();
		collision.time = t;
		collision.axis = axis;
		
	} );
	
	console.log(collision);
	drawShapesCollisionInfo(shape1, shape2, v, collision);
}

function testSegmentsCollision(no) {
	var collision, segment1, segment2, v, test;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	switch (no) {
		case 1:
			segment1 = planetmars.geom.translate([[85, 107],[109, 117]], [90,100]);
			segment2 = planetmars.geom.translate([[90, 96], [96, 48]], [100,100]);
			v = [48, -48];
			break;

		case 2:
			segment1 = planetmars.geom.translate([[85, 107],[109, 107]], [100,100]);
			segment2 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			v = [48, -48];
			break;

		case 3:
			segment1 = planetmars.geom.translate([[95, 107],[119, 107]], [100,100]);
			segment2 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			v = [48, -48];
			break;

		case 4:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[109, 107]], [90,100]);
			v = [-48, 48];
			break;

		case 5:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[109, 107]], [100,100]);
			v = [-48, 48];
			break;

		case 6:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[109, 107]], [100,100]);
			v = [0, -48];
			break;

		case 7:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[107, 107]], [100,100]);
			v = [48, 48];
			break;

		case 8:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[107, 107]], [90,100]);
			v = [48, 48];
			break;

		case 9:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[107, 107]], [110,100]);
			v = [48, 48];
			break;

		case 10:
			segment1 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			segment2 = planetmars.geom.translate([[85, 107],[107, 107]], [160,100]);
			v = [48, 48];
			break;

		case 11:
			segment1 = planetmars.geom.translate([[95, 107],[119, 107]], [100,100]);
			segment2 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			v = [0, -48];
			break;

		case 12:
			segment1 = planetmars.geom.translate([[95, 107],[119, 107]], [100,100]);
			segment2 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
			v = [0, 48];
			break;

		case 13:
			segment1 = planetmars.geom.translate([[95, 107],[119, 107]], [100,100]);
			segment2 = planetmars.geom.translate([[100, 107], [130, 107]], [100,100]);
			v = [0, -48];
			break;

		case 14:
			test = {"segment1":[[48,384.75],[90,384.75]],"segment2":[[96,432],[48,384]],"velocity":[0,1.5]};
			segment1 = test.segment1;
			segment2 = test.segment2;
			v = test.velocity;
			break;
	}
	
	collision = planetmars.collision._segmentsCollide(segment1, segment2, v);
	
	console.log(collision);
	drawSegmentsCollisionInfo(segment1, segment2, v, collision);
		
}

function testShapesCollisionBug1() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = planetmars.geom.translate([[85, 107],[109, 107],[109, 140],[85, 140]], [90,110]);
	shape2 = planetmars.geom.translate([[96, 48],[144, 48],[96, 96]], [100,100]);
	
	v = [0, -48];
	
	collision = planetmars.collision.polygonsCollideProjective(shape1, shape2, v);
	
	console.log(collision);
	drawShapesCollisionInfo(shape1, shape2, v, collision);
}

function testShapesCollisionBug2() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = [[286, 406], [298, 406], [298, 418], [286, 418]];
	shape2 = [[480, 384], [528, 384], [528, 432], [480, 432]];
	
	v = [-6, 0];
	
	collision = planetmars.collision.polygonsCollideSAT(shape1, shape2, v);
	console.log(collision);
	
	drawShapesCollisionInfo(shape1, shape2, v, collision);
	
}

function testShapesCollisionBug3() {
	var collision, segment1, segment2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	segment1 = [[222.79687499999994,467.796875],[222.79687499999994,510.796875]];
	segment2 = [[240,528],[192,480]];
	
	v = [-2, 0];
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision._segmentsCollide([segment1[0], segment1[1]], [segment2[0], segment2[1]], v);
	console.log(collision);
	
	drawShapesCollisionInfo(shape1, shape2, v, collision);
}

function testShapesCollision2() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = planetmars.geom.translate([[96, 48],[144, 48],[144, 96],[96, 96]], [100,100]);
	shape2 = planetmars.geom.translate([[96, 48],[144, 48],[144, 96],[96, 96]], [100,40]);
	v = [0, -48];
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(shape1, shape2, v);
	console.log(collision);
	
	drawShapesCollisionInfo(shape1, shape2, v, collision);
}

function testShapesCollision3() {
	var collision, colltest = {collide:true,shape1:[[48,341.75],[90,341.75],[90,384.75],[48,384.75]],shape2:[[48,432],[48,384],[96,432]],time:0,velocity:[0,10]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(colltest.shape1, colltest.shape2, colltest.velocity);
	console.log(collision);
	
	drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision);
}

function testShapesCollision4() {
	var collision, colltest = {"collide":true,"shape1":[[238.49999999999997,0],[280.5,0],[280.5,43],[238.49999999999997,43]],"shape2":[[192,0],[240,0],[192,48]],"time":0,"velocity":[-1.5,0]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(colltest.shape1, colltest.shape2, colltest.velocity);
	console.log(collision);
	
	drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision);
}

function testShapesCollision5() {
	var history = [{"height":48,"width":48,"position":[45,325.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":6},{"height":48,"width":48,"position":[45,327.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":7},{"height":48,"width":48,"position":[45,328.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":8},{"height":48,"width":48,"position":[45,330.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":9},{"height":48,"width":48,"position":[45,331.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":10},{"height":48,"width":48,"position":[45,333.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":11},{"height":48,"width":48,"position":[45,334.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":12},{"height":48,"width":48,"position":[45,336.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":13},{"height":48,"width":48,"position":[45,337.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":14},{"height":48,"width":48,"position":[45,337.99999999999994],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":15},{"height":48,"width":48,"position":[45,338.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":16}];
	var collision_err = {"collide":true,"shape1":[[48,341.75],[90,341.75],[90,384.75],[48,384.75]],"shape2":[[48,432],[48,384],[96,432]],"time":0,"velocity":[0,1.5]};
	//var collision_err = {"collide":true,"shape1":[[48,340.99999999999994],[90,340.99999999999994],[90,383.99999999999994],[48,383.99999999999994]],"shape2":[[48,432],[48,384],[96,432]],"time":0,"velocity":[0,1.5]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = planetmars.collision.polygonsCollideProjective(collision_err.shape1, collision_err.shape2, collision_err.velocity);
	console.log(collision);
	
	drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision);
}
			
function setPosition(x, y, vx, vy) {
	//console.log(x, y, vx, vy);
	game.pause();
	game.currentScreen.paintBackground();
	var v = planetmars.util.arrayCopy(game.currentScreen.player.velocity);
	game.currentScreen.player.position = [x,y];
	game.currentScreen.player.velocity = [vx,vy];
	game.currentScreen.update();
	game.currentScreen.paint();
	game.currentScreen.player.velocity = v;
	game.play();
}

function setTile(x, y, id) {
	game.currentScreen.setRoomTile(x,y,id);
	game.currentScreen.paintBackground();
}
