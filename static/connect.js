socket = io.connect('http://' + document.domain + ':' + location.port);
var session_id = 0;
var user_id = 0;
socket.emit("join", "Trying to connect to server");

var mousePressed = false;
var lastX, lastY;
var ctx;
var lWidth;
var lColor;


socket.on("loadDrawing", function(data) {
    for (i = 0; i< data.length; i++) {
        display(data[i]);
    }
});

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
        var drawing = {"x": x, "y": y, "lastX": lastX, "lastY": lastY, "lWidth": lWidth, "lColor": lColor};
        var data = {"time": Date.now(), 
                    "session_id": session_id,
                    "user_id": user_id, 
                    "drawing":drawing};
        socket.emit("update", data);
    }
    lastX = x; lastY = y;
}

socket.on("recieve", function(data) {
    display(data);
});

function display(data) {
    console.log(data);
    draw = data.drawing;
    x0 = draw.lastX;
    y0 = draw.lastY;
    x1 = draw.x;
    y1 = draw.y;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = lWidth;
    ctx.strokeStyle = lColor;
    ctx.closePath();
    ctx.stroke();
}

function clearArea() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
