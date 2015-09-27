var EventHandlers = {
    // Set up initial event handlers
    init : function() {
        // Element IDs
        this.start_button = document.getElementById("start_button");
        this.loading_sign = document.getElementById("loading_sign");

        // Pressed keys
        this.keys = {
            "up": false,
            "down": false,
            "left": false,
            "right": false
        };

        // Set key handlers
        document.onkeydown = function(event) {
            switch (String.fromCharCode(event.keyCode)) {
                case "K":
                    EventHandlers.keys["up"] = true;
                    break;
                case "J":
                    EventHandlers.keys["down"] = true;
                    break;
                case "H":
                    EventHandlers.keys["left"] = true;
                    break;
                case "L":
                    EventHandlers.keys["right"] = true;
                    break;
            }
        };

        document.onkeyup = function(event) {
            switch (String.fromCharCode(event.keyCode)) {
                case "K":
                    EventHandlers.keys["up"] = false;
                    break;
                case "J":
                    EventHandlers.keys["down"] = false;
                    break;
                case "H":
                    EventHandlers.keys["left"] = false;
                    break;
                case "L":
                    EventHandlers.keys["right"] = false;
                    break;
            }
        };

        // Set up buttons
        this.set_start_button();
    },

    // Make the start button into a start button
    set_start_button : function() {
        // Set button text
        this.start_button.innerHTML = "Start";
        // Set button onclick
        this.start_button.onclick = EventHandlers.start_onclick;
    },

    // Make the start button disabled
    disable_start_button : function() {
        this.start_button.disabled = true;
        this.loading_sign.innerHTML = "LOADING THE FILE";
    },

    // Make the start button enabled
    enable_start_button : function() {
        this.start_button.disabled = false;
        this.loading_sign.innerHTML = "";
    },

    // Make the start button into a stop button
    set_stop_button : function() {
        // Set button text
        this.start_button.innerHTML = "Stop";
        // Set button onclick
        this.start_button.onclick = EventHandlers.stop_onclick;
    },

    // Call to start simulation
    start_onclick : function() {
        EventHandlers.set_stop_button();
        Display.start();
    },

    // Call to stop simulation
    stop_onclick : function() {
        EventHandlers.set_start_button();
        Display.clear();
        Display.stop();
    }
}

var Midi = {
    //setup midi player
    init : function() {
        EventHandlers.disable_start_button();
        MIDI.loadPlugin({
            soundfontUrl: "soundfonts/",
            instrument: "acoustic_grand_piano",
            onsuccess: function() {
                MIDI.Player.loadFile("songs/verdi_traviatta.mid", function() {
                    EventHandlers.enable_start_button();
                    console.log("hi");
                },
                function(progress) {
                    console.log(progress);
                },
                function(error) {
                    console.log(error);
                });
            }
        });
    },

    // Start dis up
    start : function() {
        console.log("bueno");
        MIDI.Player.start();
    },

    // Nooooooo
    stop : function() {
        console.log("nah");
        MIDI.Player.stop();
    }
}

var Player = {
    // Set up player
    init : function() {
        this.x = 10;
        this.y = 10;
    },

    // Update position
    update_position : function() {
        if (EventHandlers.keys["down"])
            this.y += 2;
        if (EventHandlers.keys["up"])
            this.y -= 2;
        if (EventHandlers.keys["left"])
            this.x -= 2;
        if (EventHandlers.keys["right"])
            this.x += 2;
    }
}

var Display = {
    // Set up simulation
    init : function() {
        // Set up canvas
        this.canvas = document.getElementById("main_canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth - 60;
        this.canvas.height = window.innerHeight - 200;

        // Set up player
        Player.init();

        //Set up midi
        Midi.init();

        // Clear canvas
        this.clear();
    },

    // Main event loop
    main_loop: function() {
        Display.clear();
        Player.update_position();
        Display.context.fillStyle = "#fff";
        Display.context.fillRect(Player.x, Player.y, 25, 25);
        Display.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Start the simulation
    start : function() {
        Midi.start();
        this.clear();
        this.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Stop the simulation
    stop : function() {
        window.cancelAnimationFrame(this.timer);
        Midi.stop();
    },

    // Clear canvas
    clear : function() {
        this.i = 0;
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.context.canvas.width,
                this.context.canvas.height);
    }
}