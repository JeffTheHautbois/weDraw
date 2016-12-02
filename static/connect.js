
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port);
    var session_id = 0;
    var user_id = 0;
    socket.emit("join", "Trying to connect to server");

    // Listeners
    $(document).click(function(e) {
        socket.emit("update", getData(session_id, user_id));
    });

    socket.on("recieve", function(data) {
        console.log(data);
    });
});
