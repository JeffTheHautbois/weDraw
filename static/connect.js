
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    var session_id = 0;
    var user_id = 0;
    socket.emit("join", "Trying to connect to server");

    // Listeners
    $(document).click(function(e) {
        var data = {"time": Date.now(), 
                    "session_id": session_id,
                    "user_id": user_id, 
                    "drawing":null};
        socket.emit("update", data);
    });

    socket.on("recieve", function(data) {
        console.log(data);
    });
});
