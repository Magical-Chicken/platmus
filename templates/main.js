var EventHandlers = {
    // Set up initial event handlers
    init : function() {
        // Element IDs
        this.start_button = document.getElementById("start_button");
        this.loading_sign = document.getElementById("loading_sign");
        this.midiselectionator = document.getElementById("midi_selectionator");
        this.perlman_switch = document.getElementById("perlman_switch");
        this.shred_div = document.getElementById("perlman");

        this.cursor = {
            x: 0, 
            y: 0
        };

        window.onmousemove = function(e) {
            EventHandlers.cursor = MousePos(Display.canvas, e);
        };

        // Set up inputs
        this.set_start_button();
        this.set_up_chooser();
        this.perlman_switch.onclick = this.set_perlman;
    },

    // set up progress bar
    set_perlman : function() {
        if (EventHandlers.shred_div.style.display == "none")
            EventHandlers.shred_div.style.display = "block";
        else
            EventHandlers.shred_div.style.display = "none";
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
        var songs_array = ["song.mid", "fantaisie.mid", "jbel.mid", "deathwaltz.mid", "entertainer.mid", "mman.mid", "water.mid", "castle.mid"];
        for (i in songs_array) {
            options += "<option>" + songs_array[i] + "</option>";
        }
        this.midiselectionator.innerHTML = options;
        this.midiselectionator.onchange = EventHandlers.select_onchange;
    },

    enable_chooser : function() {
        this.midiselectionator.disabled = false;
    },

    select_onchange : function() {
        if (Midi.playing)
            EventHandlers.stop_onclick();
        var val = EventHandlers.midiselectionator.value
        if (val != "Choose") {
            Midi.song = val;
            Midi.get_song();
        }
    }
}

var Midi = {
    //setup midi player
    init : function() {
        this.song = "song.mid";
        this.playing = false;
        this.colorMap = MIDI.Synesthesia.map();
        console.log("get soundfont");
        MIDI.loadPlugin({
            soundfontUrl: "soundfonts/",
            instrument: "acoustic_grand_piano",
            onsuccess: function() {
                console.log(" got soundfont");
                EventHandlers.enable_chooser();
            }
        });
    },

    // Get the player ready
    get_song : function() {
        EventHandlers.disable_start_button();
        console.log("get song");
        MIDI.Player.loadFile("songs/" + Midi.song, function() {
            EventHandlers.enable_start_button();
            console.log(" got song");
        });
    },

    // Start dis up
    start : function() {
        console.log("bueno");
        this.playing = true;
        MIDI.Player.start();
        MIDI.setEffects([
            {
                type: "Overdrive",
                outputGain: 0.5,
                drive: 0.7,
                curveAmount: 0.85,
                algorithmIndex: 0,
                bypass: 0
            }
            ]);
        MIDI.Player.addListener(Midi.update);
    },

    // Nooooooo
    stop : function() {
        console.log("nah");
        MIDI.Player.removeListener();
        MIDI.Player.stop();
    },

    update : function(data) {
        //console.log(data);
        Midi.note = data.note;
        Midi.message = data.message;
        if (Midi.message == 144) {
            var r = new Rect(Display.canvas.width - 50,
                    (Display.canvas.height - (Midi.note * 5)),
                    Display.canvas.width, 5)
            r.pitch = Midi.note;
            Notes.current[Midi.note] = r;
            Rectangles.rectangles.push(r);
        } else if (Notes.current[Midi.note]) {
                var r = Notes.current[Midi.note];
                r.width = Display.canvas.width - r.x;
                Notes.current[Midi.note] = null;
        }
    }
}

var Player = {
    // Set up player
    init : function() {
        this.rect = new Rect(10, 10, 25, 25);
    },

    // Update position
    update_position : function() {
        this.rect.x = EventHandlers.cursor.x;
        this.rect.y = EventHandlers.cursor.y;
    }
}

var PerlmanProgress = {
    init : function() {
        this.tw = window.innerWidth - 5;
        this.perlman = document.getElementById("shreddedness_bar");
        this.perlman.heigth = 0;
        this.perlman.width = 0;
    },

    update : function() {
        var time = MIDI.Player.currentTime;
        var length = MIDI.Player.endTime;
        var progress = time / length;
        this.perlman.width = this.tw * progress;
    }
}

var Shredness = {
    init : function() {
        this.shred = 0;
        this.span = document.getElementById("shred_no");
        this.show();
    },
    collide : function() {
        this.shred += 1;
        this.show();
    },
    show : function() {
        if (this.shred > 5000)
            this.span.innerHTML = "SHRED LEVEL: " + this.shred +
                " SHREDDED";
        else
            this.span.innerHTML = "SHRED LEVEL: " + this.shred;
    }
}

var Collision = {
    update_collision(player, note) {
        //checks if player is above note
        if (player.x + player.width > note.x &&
                player.x < note.x + note.width &&
                player.y + player.height > note.y &&
                player.y < note.y + note.height)
            Shredness.collide(); // Idk what to do here
    }
}

function MousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

var Notes = {
    init : function() {
        this.current = []; 
    }
}

var Rectangles = {
    init : function() {
        this.rectangles = [];
        this.dx = -5;
    },
    update : function() {
        for (var i = this.rectangles.length - 1; i >= 0; i--) {
            var r = this.rectangles[i]
            if(r.x + r.width < -2000) {
                this.rectangles.splice(i, i);
                //console.log("delete");
            }
            //else r.x += -5;
        }
    },
    update_position : function() {
        for(i in this.rectangles)
            this.rectangles[i].x += this.dx;
    },
    draw : function() {
        //Rectangles.update_position();
        for (i in this.rectangles) {
            if(this.rectangles[i]) {
                var r = this.rectangles[i];
                try {
                    Display.context.fillStyle = Midi.colorMap[r.pitch].hex;
                } catch (e) { }
                Display.context.fillRect(r.x, r.y, r.width, r.height);
            }
        }
    },
    check_collisions : function() {
        for (i in this.rectangles) {
            Collision.update_collision(Player.rect, this.rectangles[i]);
        }
    }
}

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pitch = null;
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

        // Shred some stuff
        Shredness.init();

        //Set up rects
        Rectangles.init();

        //Set up current notes
        Notes.init();

        // Clear canvas
        this.clear();
    },

    // Main event loop
    main_loop: function() {
        Display.clear();
        Player.update_position();
        Display.context.fillStyle = "rgba(" + parseInt(Math.random() * 255) + ", " + parseInt(Math.random() * 255) + ", " + parseInt(Math.random() * 255) +                 ",1)";
        Display.context.fillRect(Player.rect.x, Player.rect.y,
                Player.rect.width, Player.rect.height);
        Display.context.fillStyle = "#fff";
        PerlmanProgress.update();
        Rectangles.update();
        Rectangles.update_position();
        Rectangles.check_collisions();
        Rectangles.draw();
        Display.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Start the simulation
    start : function() {
        Shredness.init();
        PerlmanProgress.init();
        Midi.start();
        this.clear();
        this.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Stop the simulation
    stop : function() {
        window.cancelAnimationFrame(this.timer);
        Midi.stop();
        Player.init();
        Rectangles.rectangles = [];
    },

    // Clear canvas
    clear : function() {
        var percent_of_rgb = function(position, total) {
            return parseInt(((total - position) / total) * 225);
        }
        this.context.fillRect(0, 0, this.context.canvas.width,
                this.context.canvas.height);
    }
}
