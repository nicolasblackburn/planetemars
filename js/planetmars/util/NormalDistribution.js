var planetmars = (function(pm) { 
	function NormalDistribution() {
		this.queue = [];
	} 

	NormalDistribution.prototype.next = function(mu, sigma) {
		switch (arguments.length) {
			case 0:
				mu = 0;
				sigma = 1;
				break;
			case 1:
				sigma = 1;
				break;
		}
		
		var u, v, x, y;
		
		if (this.queue.length) {
			return mu + sigma * this.queue.shift();
		}
		
		u = Math.random();
		v = Math.random();
		x = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
		y = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
		
		this.queue.push(y);
		
		return mu + sigma * x;
	};

	NormalDistribution.prototype.nextTreshold = function(treshold, mu, sigma) {
		switch (arguments.length) {
			case 1:
				mu = 0;
				sigma = 1;
				break;
			case 2:
				sigma = 1;
				break;
		}
		
		var x;
		
		x = this.next(mu, sigma);
		
		while (x < mu - treshold || x >= mu + treshold) {
			x = this.next(mu, sigma);
		}
		
		return x;
	};
	
	pm.util = pm.util || {};

	pm.util.NormalDistribution = NormalDistribution; 
	
	return pm;
})(planetmars);
