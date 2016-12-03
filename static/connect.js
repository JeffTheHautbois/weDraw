socket = io.connect('http://' + document.domain + ':' + location.port);
var session_id = 0;
var user_id = 0;
socket.emit("join", "Trying to connect to server");

socket.on("recieve", function(data) {
    console.log(data);
});
// $(document).ready(function(){

//     // $(document).click(function(e) {
//     //     var data = {"time": Date.now(), 
//     //                 "session_id": session_id,
//     //                 "user_id": user_id, 
//     //                 "drawing":null};
//     //     socket.emit("update", data);
//     // });

// });


var mousePressed = false;
var lastX, lastY;
var ctx;

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    if (isDown) {
        var drawing = {"x": x, "y": y, "lastX": lastX, "lastY": lastY};
        var data = {"time": Date.now(), 
                    "session_id": session_id,
                    "user_id": user_id, 
                    "drawing":drawing};

        socket.emit("update", data);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
