var EventHandlers = {
    // Set up initial event handlers
    init : function() {
        // Element IDs
        this.start_button = document.getElementById("start_button");

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
        }
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
        }

        // Set onclicks
        EventHandlers.set_start_button();
    },

    // Make the start button into a start button
    set_start_button : function() {
        // Set button text
        this.start_button.innerHTML = "Start";
        // Set button onclick
        this.start_button.onclick = EventHandlers.start_onclick;
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

    key_down : function() {
        for (i in this.keys) {
            if(this.keys[i]) return this.keys[i]; }
        return false;
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

var Collision = {
    // Set up collision
    init : function() {
    },

    update_collision(player, note) {
        
        //checks if player is above note
        if(player.x + player.width / 2 > note.x - note.width / 2 
                && player.x - player.width / 2 < note.x + note.width / 2)
            if(player.y + player.height / 2 > note.y - note.height / 2
                    && player.y - player.height / 2 < note.y + note.height / 2)
                console.log("collision true");
            else
                console.log("collision false");
        else
            console.log("collision false");
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
        Display.context.fillRect(Player.rect.x, Player.rect.y, Player.rect.width, Player.rect.height);
        Display.context.fillRect(50, 50, 25, 25);
        Display.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Start the simulation
    start : function() {
        this.clear();
        this.timer = window.requestAnimationFrame(Display.main_loop);
    },

    // Stop the simulation
    stop : function() {
        window.cancelAnimationFrame(this.timer);
        Player.init();
    },

    // Clear canvas
    clear : function() {
        this.i = 0;
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}
