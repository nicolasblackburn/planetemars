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
		.setFillAndStrokeStyle("#C90")
		.strokePoints(visible1)
		.each(visible1, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setFillAndStrokeStyle("#A60")
		.strokePoints(visible2)
		.each(visible2, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setFillAndStrokeStyle("#9C0")
		.strokeLine(closest1, planetmars.vector.add(closest1, v))
		.fillCenteredRect(planetmars.vector.add(closest1, v), 4)
	
	console.log(collision);
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
			//.setFillAndStrokeStyle("#0C6")
			//.strokeShape(intershape1)
			//.setFillAndStrokeStyle("#09C")
			//.strokeShape(intershape2)
			//.lineWidth(2)
			//.setFillAndStrokeStyle("#0C6")
			//.strokeLine(closest1, intervertex1)
			//.fillCenteredRect(intervertex1, 6)
			//.setFillAndStrokeStyle("#09C")
			//.strokeLine(intervertex1, intervertex2)
			//.fillCenteredRect(intervertex2, 6);
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
		.setFillAndStrokeStyle("#AAA") // grey
		.strokeShape(shape1)
		.strokeShape(shape2)
		.setFillAndStrokeStyle("#C90") // yellow
		.strokePoints(visible1)
		.each(visible1, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.strokePoints(visible2)
		.each(visible2, function (point) {
			this.fillCenteredRect(point, 4);
		})
		.setFillAndStrokeStyle("#9C0") // green
		.strokeLine(closest1, planetmars.vector.add(closest1, v))
		.fillCenteredRect(planetmars.vector.add(closest1, v), 4)
	
	//if (collision.collide) {
		
		//p = planetmars.vector.add(closest1, planetmars.vector.scale(collision.time, v));
		
		//g
		//	.setFillAndStrokeStyle("#09C")
		//	.fillCenteredRect(p, 6);
		/*
		interv1 = planetmars.vector.scale(t, v);
		intershape1 = planetmars.geom.translate(shape1, interv1);
		intervertex1 = planetmars.vector.add(closest1, interv1);
		
		axislength = planetmars.vector.norm(axis);
		axisscale = 96 / axislength;
		orthoaxis = planetmars.vector.orthogonalVector(axis);
		
		interv2 = planetmars.vector.subtract(
			planetmars.vector.projectOnto( v, orthoaxis ),
			planetmars.vector.projectOnto( interv1, orthoaxis ) );
				
		intershape2 = planetmars.geom.translate(intershape1, interv2);
		intervertex2 = planetmars.vector.add(intervertex1, interv2);
		
		g
			.setFillAndStrokeStyle("#0C6")
			.strokeShape(intershape1)
			.setFillAndStrokeStyle("#09C")
			.strokeShape(intershape2)
			.lineWidth(2)
			.setFillAndStrokeStyle("#0C6")
			.strokeLine(closest1, intervertex1)
			.fillCenteredRect(intervertex1, 6)
			.setFillAndStrokeStyle("#09C")
			.strokeLine(intervertex1, intervertex2)
			.fillCenteredRect(intervertex2, 6);
		*/
	//}
	
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
	
	//if (collision.collide) {
	//	drawShapesCollisionInfo(shape1, shape2, v, collision.collide, collision.time, collision.axis);
	//} else {
		drawShapesCollisionInfo(shape1, shape2, v, collision);
	//}
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
	
	if (collision.collide) {
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide, collision.time, collision.axis);
	} else {
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide);
	}
}

function testSegmentsCollision(no) {
	var collision, segment1, segment2, v, test;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	switch (no) {
		case 1:
			segment1 = planetmars.geom.translate([[85, 107],[109, 107]], [90,100]);
			segment2 = planetmars.geom.translate([[96, 96], [96, 48]], [100,100]);
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
	
	collision = planetmars.collision.segmentsCollide(segment1, segment2, v);
	//if (collision.collide) {
	//	drawSegmentsCollisionInfo(segment1, segment2, v, collision.collide, collision.time, collision.axis);
	//} else {
		drawSegmentsCollisionInfo(segment1, segment2, v, collision);
	//}
}

function testShapesCollisionBug1() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = planetmars.geom.translate([[85, 107],[109, 107],[109, 140],[85, 140]], [90,110]);
	shape2 = planetmars.geom.translate([[96, 48],[144, 48],[96, 96]], [100,100]);
	
	v = [0, -48];
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(shape1, shape2, v);
	
	//if (collision.collide) {
		drawShapesCollisionInfo(shape1, shape2, v);
	//} else {
	//	drawShapesCollisionInfo(shape1, shape2, v, collision.collide);
	//}
}

function testShapesCollisionBug2() {
	var collision, shape1, shape2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	shape1 = [[286, 406], [298, 406], [298, 418], [286, 418]];
	shape2 = [[480, 384], [528, 384], [528, 432], [480, 432]];
	
	v = [-6, 0];
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideSAT(shape1, shape2, v);
	
	if (collision.collide) {
	  console.log("collide");
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide, collision.time, collision.axis);
	} else {
	  console.log("don't collide");
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide);
	}
}

function testShapesCollisionBug3() {
	var collision, segment1, segment2, v;
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	segment1 = [[222.79687499999994,467.796875],[222.79687499999994,510.796875]];
	segment2 = [[240,528],[192,480]];
	
	v = [-2, 0];
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.segmentsCollide([segment1[0], segment1[1]], [segment2[0], segment2[1]], v);
	
	if (collision.collide) {
	  console.log("collide", collision);
		//drawShapesCollisionInfo(shape1, shape2, v, collision.collide, collision.time, collision.axis);
	} else {
	  console.log("don't collide", collision);
		//drawShapesCollisionInfo(shape1, shape2, v, collision.collide);
	}
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
	
	if (collision.collide) {
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide, collision.time, collision.axis);
	} else {
		drawShapesCollisionInfo(shape1, shape2, v, collision.collide);
	}
}

function testShapesCollision3() {
	var collision, colltest = {collide:true,shape1:[[48,341.75],[90,341.75],[90,384.75],[48,384.75]],shape2:[[48,432],[48,384],[96,432]],time:0,velocity:[0,10]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(colltest.shape1, colltest.shape2, colltest.velocity);
	
	if (collision.collide) {
		console.log("collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide, collision.time, collision.axis);
	} else {
		console.log("don't collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide);
	}
}

function testShapesCollision4() {
	var collision, colltest = {"collide":true,"shape1":[[238.49999999999997,0],[280.5,0],[280.5,43],[238.49999999999997,43]],"shape2":[[192,0],[240,0],[192,48]],"time":0,"velocity":[-1.5,0]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = new planetmars.collision.NoCollision();
	
	collision = planetmars.collision.polygonsCollideProjective(colltest.shape1, colltest.shape2, colltest.velocity);
	
	if (collision.collide) {
		console.log("collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide, collision.time, collision.axis);
	} else {
		console.log("don't collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide);
	}
}

function testShapesCollision5() {
	var history = [{"height":48,"width":48,"position":[45,325.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":6},{"height":48,"width":48,"position":[45,327.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":7},{"height":48,"width":48,"position":[45,328.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":8},{"height":48,"width":48,"position":[45,330.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":9},{"height":48,"width":48,"position":[45,331.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":10},{"height":48,"width":48,"position":[45,333.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":11},{"height":48,"width":48,"position":[45,334.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":12},{"height":48,"width":48,"position":[45,336.25],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":13},{"height":48,"width":48,"position":[45,337.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":14},{"height":48,"width":48,"position":[45,337.99999999999994],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":15},{"height":48,"width":48,"position":[45,338.75],"velocity":[0,0],"acceleration":[0,0],"spriteIndex":"crab-00","currentAnimation":"crab","currentAnimationFrame":16}];
	var collision_err = {"collide":true,"shape1":[[48,341.75],[90,341.75],[90,384.75],[48,384.75]],"shape2":[[48,432],[48,384],[96,432]],"time":0,"velocity":[0,1.5]};
	//var collision_err = {"collide":true,"shape1":[[48,340.99999999999994],[90,340.99999999999994],[90,383.99999999999994],[48,383.99999999999994]],"shape2":[[48,432],[48,384],[96,432]],"time":0,"velocity":[0,1.5]};
	
	game.currentScreen.needRepaint = true;
	game.currentScreen.paint();
	
	collision = planetmars.collision.polygonsCollideProjective(collision_err.shape1, collision_err.shape2, collision_err.velocity);
	
	if (collision.collide) {
		console.log("collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide, collision.time, collision.axis);
	} else {
		console.log("don't collide");
		drawShapesCollisionInfo(collision.shape1, collision.shape2, collision.velocity, collision.collide);
	}
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
