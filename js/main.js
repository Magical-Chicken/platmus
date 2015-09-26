var EventHandlers = {
    // Set up initial event handlers
    init : function() {
        // Element IDs
        this.start_button = document.getElementById("start_button");

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
    }
}

var Display = {
    // Set up simulation
    init : function() {
        this.canvas = document.getElementById("main_canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth - 60;
        this.canvas.height = window.innerHeight - 200;
        
        // Clear canvas
        this.clear();
    },

    // Main event loop
    main_loop: function() {
        Display.context.fillStyle = "#fff";
        Display.context.fillRect(100, Display.i, 100, 100);
        Display.i += 5;
    },

    // Start the simulation
    start : function() {
        this.clear();
        this.timer = setInterval(Display.main_loop, 10);
    },

    // Stop the simulation
    stop : function() {
        clearInterval(this.timer);
    },

    // Clear canvas
    clear : function() {
        this.i = 0;
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}
