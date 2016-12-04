socket = io.connect('http://' + document.domain + ':' + location.port);
var path = window.location.pathname;
var session_id = parseInt(path.split("/")[1]);
var user_id = path.split("/")[2];
socket.emit("join", {'session_id': session_id, 'user_id': user_id});

var mousePressed = false;
var lastX, lastY;
var ctx;

socket.on("loadDrawing", function(data) {
    for (i = 0; i< data.length; i++) {
        display(data[i]);
    }
});

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

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

        var lWidth = parseInt($("#stroke").val());
        var lColor = $("#color").spectrum("get").toHexString();
        var drawing = {"x": x, "y": y, "lastX": lastX, "lastY": lastY, "lWidth": lWidth, "lColor": lColor};
        var data = {"time": Date.now(), 
                    "session_id": session_id,
                    "user_id": user_id, 
                    "drawing":drawing};
        socket.emit("update", data);
    }
    lastX = x; lastY = y;
}

socket.on("recieve" + session_id.toString(), function(data) {
    display(data);
});

socket.on("externalclear" + session_id.toString(), function(data) {
    clearArea();
});

function display(data) {
    draw = data.drawing;
    x0 = draw.lastX;
    y0 = draw.lastY;
    x1 = draw.x;
    y1 = draw.y;

    if (user_id !== data.user_id){
        $("#" + data.user_id).css({"top": y1 + 160, "left": x1, "pointer-events": "none", "visibility": "visible"});
        $("#" + data.user_id).attr("time", Date.now());
    }

    $("#" + data.user_id + ".tiny.material-icons").css({"color": draw.lColor});
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = draw.lWidth;
    ctx.lineJoin = "round";
    ctx.closePath();
    ctx.strokeStyle = draw.lColor;
    ctx.stroke();
}

function clearArea() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

socket.on("new_user" + session_id.toString(), function(user_id) {
    var to_draw = true;
    $(".cursor").each(function(index){
        if (user_id === $(this).attr("id")){
            to_draw = false;
            return false;
        }
    });
    if (to_draw){
        $("#show_user").append('<div class="cursor" style="position:absolute;visibility:hidden;font-weight:bold;font-family: monospace;" id=' + 
            user_id + '>' + user_id + '</div>');
        $(".userChip").append('<div class="chip"><i class="tiny material-icons" id=' + user_id +'>assignment_ind</i>'+ user_id + '</div>');
    }
});


$(document).ready(function() {
    $("#clear-button").click(function() {
        socket.emit("clear", session_id);
    });
    
    $("#color").spectrum({
        color: "black",
    });

    setInterval(function(){
        time = Date.now();
        $(".cursor").each(function(index){
            elem_time = parseInt($(this).attr("time"));
            if (!isNaN(elem_time)) {
                if (Math.abs(elem_time - Date.now()) >= 1000) {
                    $(this).css({"visibility": "hidden"});
                }
            }
        });
    } , 500);
 
});
