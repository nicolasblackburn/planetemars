var planetmars = (function(pm, undefined) {
    function TitleScreen(game, domElement) {
        pm.lang.Screen.call(this, game, domElement);

        this.newGameScreen = $('#new-game')
            .remove()
            .appendTo(game.containerElement);

        this.continueGameScreen = $('#continue-game')
            .remove()
            .appendTo(game.containerElement);

        this.optionsScreen = $('#options')
            .remove()
            .appendTo(game.containerElement);

        this.newGameButton = $(".new-game-button", this.screen);
        //this.continueGameButton = $(".continue-game-button", this.screen);
        this.optionsButton = $(".options-button", this.screen);

        //this.newGameBackButton = $(".back-button", this.newGameScreen);
        //this.newGameContinueButton = $(".continue-button", this.newGameScreen);

        //this.continueGameBackButton = $(".back-button", this.continueGameScreen);
        //this.continueGameContinueButton = $(".continue-button", this.continueGameScreen);

        var self = this;

        this.newGameButton
            .on("click", function(event) {
                event.preventDefault();

                self.game.setScreen('game-screen');
            });

        this.optionsButton
            .on("click", function(event) {
                event.preventDefault();
		
                self.game.setScreen('options-screen');
            });
	/*
    
        this.continueGameButton
            .on("click", function(event) {
                event.preventDefault();

                self.game.setScreen('continue-game-screen');
            });
	    
        this.newGameBackButton
            .on("click", function(event) {
                event.preventDefault();
		console.log("hello");
                self.game.setScreen('game-screen');
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
	    */
    }

    TitleScreen.prototype = new pm.lang.Screen();

    pm.screen = pm.screen || {};

    pm.screen.TitleScreen = TitleScreen;

    return pm;
})(planetmars || {});
