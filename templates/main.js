var EventHandlers = {
    // Set up initial event handlers
    init : function() {
        // Element IDs
        this.start_button = document.getElementById("start_button");
        this.loading_sign = document.getElementById("loading_sign");
        this.midiselectionator = document.getElementById("midi_selectionator");

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

        // Set up inputs
        this.set_start_button();
        this.set_up_chooser();
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
    },

    set_up_chooser : function() {
        var options = "<option>Choose</option>";
        var songs_array = ["song.mid", "fantaisie.mid"];
        for (i in songs_array) {
            options += "<option>" + songs_array[i] + "</option>";
        }
        this.midiselectionator.innerHTML = options;
        this.midiselectionator.onchange = EventHandlers.select_onchange;
    },

    select_onchange : function() {
        if (Midi.playing)
            EventHandlers.stop_onclick();
        var val = EventHandlers.midiselectionator.value
        if (val != "Choose") {
            Midi.song = val;
            Midi.get_song();
        }
    },

    key_down : function() {
        for (i in this.keys) {
            if(this.keys[i]) return this.keys[i]; }
        return false;
    }
}

var Midi = {
    //setup midi player
    init : function() {
        this.song = "song.mid";
        this.playing = false;
    },

    // Get the player ready
    get_song : function() {
        EventHandlers.disable_start_button();
        console.log("get soundfont");
        MIDI.loadPlugin({
            soundfontUrl: "soundfonts/",
            instrument: "acoustic_grand_piano",
            onsuccess: function() {
                console.log(" get song");
                MIDI.Player.loadFile("songs/" + Midi.song, function() {
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
        this.playing = true;
        MIDI.Player.start();
    },

    // Nooooooo
    stop : function() {
        console.log("nah");
        this.playing = false;
        MIDI.Player.stop();
    },

    // Shred it up
    shred : function() {
        MIDI.noteOn(0, 60, 127, 0);
        MIDI.noteOn(0, 70, 127, 0);
    }
}

var Player = {
    // Set up player
    init : function() {
        this.rect = new Rect(10, 10, 25, 25);
        this.dx = 0;
        this.dy = 0;
    },

    // Update position
    update_position : function() {
        this.rect.x += this.dx;
        this.rect.y += this.dy;
    }
}

var Shredness = {
    // Set up
    init : function() {
        this.shreddedness = 0;
    },

    collide : function() {
        this.shreddedness += 10;
        Midi.shred();
    }
}

var Collision = {
    // Set up collision
    init : function() {
    },

    update_collision(player, note) {
        //checks if player is above note
        if (player.x + player.width / 2 > note.x - note.width / 2 
                && player.x - player.width / 2 < note.x + note.width / 2)
            if (player.y + player.height / 2 > note.y - note.height / 2
                    && player.y - player.height / 2 < note.y + note.height / 2)
                Shredness.collide();
    }
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
        if (EventHandlers.keys["down"])
            Player.dy += 1;
        if (EventHandlers.keys["up"])
            Player.dy += -1;
        if (EventHandlers.keys["left"])
            Player.dx += -1;
        if (EventHandlers.keys["right"])
            Player.dx += 1;
        if (!EventHandlers.key_down()) {
            Player.dx = 0;
            Player.dy = 0;
        }
        Collision.update_collision(Player.rect, new Rect(50, 50, 25,25));
        Player.update_position();
        Display.context.fillStyle = "#fff";
        Display.context.fillRect(Player.rect.x, Player.rect.y,
                Player.rect.width, Player.rect.height);
        Display.context.fillRect(50, 50, 25, 25);
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
        Player.init();
    },

    // Clear canvas
    clear : function() {
        this.i = 0;
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.context.canvas.width,
                this.context.canvas.height);
    }
}
