var planetmars = (function(pm) { 
	function EnemyCollisionEvent(enemy, source) {
		
		this.type = "EnemyCollision";
		this.enemy = enemy;
		this.source = source;
		this.stopPropagation = false;
	} 
	
	pm.event = pm.event || {};
	
	pm.event.EnemyCollisionEvent = EnemyCollisionEvent;
	
	return pm;
})(planetmars || {});
