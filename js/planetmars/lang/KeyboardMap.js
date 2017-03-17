var planetmars = (function(pm) {
    function KeyboardMap(game) {
        this.game = game;

        this.keycodes = {};
        this.reverseKeycodes = {};
    }

    KeyboardMap.prototype.get = function(keycode) {
        return this.keycodes[keycode];
    };

    KeyboardMap.prototype.reverseGet = function(name) {
        return this.reverseKeycodes[name];
    };

    KeyboardMap.prototype.load = function() {};

    KeyboardMap.prototype.save = function() {};

    KeyboardMap.prototype.set = function(keycode, name) {
        var oldKeycode = this.reverseGet(name);
        
        delete this.reverseKeycodes[name];
        delete this.keycodes[oldKeycode];

        this.keycodes[keycode] = name;
        this.reverseKeycodes[name] = keycode;

        return this;
    };

    pm.lang = pm.lang || {};

    pm.lang.KeyboardMap = KeyboardMap;

    return pm;
})(planetmars || {});
