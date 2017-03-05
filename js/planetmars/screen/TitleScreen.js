var planetmars = (function(pm, undefined) { 
	function TitleScreen(game) {
		pm.lang.Screen.call(this, game);
		
		this.titleScreen = $('#title-screen')
		  .remove()
		  .appendTo(game.containerElement);
		
		this.newGameScreen = $('#new-game')
		  .remove()
		  .appendTo(game.containerElement);
		
		this.continueGameScreen = $('#continue-game')
		  .remove()
		  .appendTo(game.containerElement);
		
		this.optionsScreen = $('#options')
		  .remove()
		  .appendTo(game.containerElement);
		  
		this.titleNewGameButton = $(".new-game-button", this.titleScreen);
		this.titleContiuneGameButton = $(".continue-game-button", this.titleScreen);
		this.titleOptionsButton = $(".options-button", this.titleScreen);
		  
		this.newGameBackButton = $(".back-button", this.newGameScreen);
		this.newGameContinueButton = $(".continue-button", this.newGameScreen);
		
		this.continueGameBackButton = $(".back-button", this.continueGameScreen);
		this.continueGameContinueButton = $(".continue-button", this.continueGameScreen);
		
		this.optionsBackButton = $(".back-button", this.optionsScreen);
		this.optionsModifyControlButton = $('a[class*="control-"]', this.optionsScreen);
		
		
		// Afficher l'écran d'accueil
		this.titleScreen.removeClass("hidden");
		
		var self = this;
		  
		this.titleNewGameButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.titleScreen.addClass("hidden");
		    
		    var screen = new planetmars.screen.GameScreen(self.game);
		    
		    self.game.screens.push(screen);
		    self.game.currentScreen = screen;
		    
		    /*
		    self.newGameScreen.find(".player-name-field").val("");
		    
		    self.titleScreen.addClass("hidden");
		    self.newGameScreen.removeClass("hidden");
		    */
		  });
		  
		this.titleContiuneGameButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.titleScreen.addClass("hidden");
		    self.continueGameScreen.removeClass("hidden");
		  });
		  
		this.titleOptionsButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.titleScreen.addClass("hidden");
		    self.optionsScreen.removeClass("hidden");
		  });
		  
		this.newGameBackButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.newGameScreen.addClass("hidden");
		    self.titleScreen.removeClass("hidden");
		  });
		  
		this.newGameContinueButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.newGameScreen.addClass("hidden");
		    
		    var screen = new planetmars.screen.GameScreen(self.game);
		    
		    self.game.screens.push(screen);
		    self.game.currentScreen = screen;
		    
		  });
		  
		this.continueGameBackButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.continueGameScreen.addClass("hidden");
		    self.titleScreen.removeClass("hidden");
		  });
		  
		this.continueGameContinueButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.continueGameScreen.addClass("hidden");
		    
		    var screen = new planetmars.screen.GameScreen(self.game);
		    
		    self.game.screens.push(screen);
		    self.game.currentScreen = screen;
		    
		  });
		  
		this.optionsBackButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    self.optionsScreen.addClass("hidden");
		    self.titleScreen.removeClass("hidden");
		  });
		
		var waitInputKey = false;
		this.optionsModifyControlButton
		  .on("click", function(event) {
		    event.preventDefault();
		    
		    if (!waitInputKey) {
		      var self = $(this);
		      var field = self.prev();
		      
	        waitInputKey = true;
	        self.text("Entrez une touche...");
	        
	        function onkeydown(nativeEvent) {
	          $(window).off("keydown", onkeydown);
	          field.val(nativeEvent.key == " " ? "espace": nativeEvent.key);
	          self.text("Modifier");
	          waitInputKey = false;
	        }
	        
	       $(window).on("keydown", onkeydown);
		    }
		  });
	}
	
	TitleScreen.prototype = new pm.lang.Screen();
 
	pm.screen = pm.screen || {};
	
	pm.screen.TitleScreen = TitleScreen;
	
	return pm;
})(planetmars || {});
