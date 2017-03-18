var planetmars = (function(pm, undefined) {
    function OptionsScreen(game, domElement) {
        pm.lang.Screen.call(this, game, domElement);

        this.backButton = $(".back-button", this.optionsScreen);
        this.modifyControlButton = $('a[class*="control-"]', this.optionsScreen);
        this.optionsModifyControlButton = $('a[class*="control-"]', this.optionsScreen);

        var self = this, screen = self;

        this.backButton
            .on("click", function(event) {
                event.preventDefault();
                
                self.game.setScreen("title-screen");
            });

        var waitInputKey = false;
        this.modifyControlButton
            .on("click", function(event) {
                event.preventDefault();

                if (!waitInputKey) {
                    var self = $(this);
                    var field = self.prev();

                    waitInputKey = true;
                    self.text("Entrez une touche...");

                    function onkeydown(nativeEvent) {
                        $(window).off("keydown", onkeydown);
                        
                        screen.game.keyboardMap.set(pm.event.KeyEvent.KEY_MAP[nativeEvent.key], field.data("keyboard-map"));
                        
                        self.text("Modifier");
                        waitInputKey = false;
                        
                        screen.updateView();
                    }

                    $(window).on("keydown", onkeydown);
                }
            });
            
        this.updateView();
    }

    OptionsScreen.prototype = new pm.lang.Screen();
    
    OptionsScreen.prototype.updateView = function() {
        var game = this.game;
        
        $(".keyboard-map").each(function(i) {
            var self = $(this);
            
            var char = pm.event.KeyEvent.KEYCODE_MAP[game.keyboardMap.reverseGet(self.data("keyboard-map"))];
            
            if  (char == ' ') {
                char = 'espace';
            }
            
            self.val(char);
        });
    };

    pm.screen = pm.screen || {};

    pm.screen.OptionsScreen = OptionsScreen;

    return pm;
})(planetmars || {});
