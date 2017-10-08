// game
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var ctx = document.getElementById('ctx').getContext('2d');
ctx.font = '30px Arial';



socket.on('newPositions', (data) => {
    ctx.clearRect(0,0,500,500);
    for (var i = 0; i < data.length; i++) {
        ctx.fillText(data[i].number, data[i].x, data[i].y);
    }
});

socket.on('addToChat', (data) => {
    chatText.innerHTML += '<div>' + data + '</div>';
});

chatForm.onsubmit = (event) => {
    event.preventDefault();
    socket.emit('sendMessageToServer', chatInput.value);
    chatInput.value = '';
}

document.onkeydown = (event) => {
    // d key 
    if (event.keyCode === 68) {
        socket.emit('keyPress', {inputId:'right', state:true});
    // s key 
    } else if (event.keyCode === 83) {
        socket.emit('keyPress', {inputId:'down', state:true});
    // a key
    } else if (event.keyCode === 65) {
        socket.emit('keyPress', {inputId:'left', state:true});
    // w key
    } else if (event.keyCode === 87) {
        socket.emit('keyPress', {inputId:'up', state:true});
    }
}

document.onkeyup = (event) => {
    // d key 
    if (event.keyCode === 68) {
        socket.emit('keyPress', {inputId:'right', state:false});
    // s key 
    } else if (event.keyCode === 83) {
        socket.emit('keyPress', {inputId:'down', state:false});
    // a key
    } else if (event.keyCode === 65) {
        socket.emit('keyPress', {inputId:'left', state:false});
    // w key
    } else if (event.keyCode === 87) {
        socket.emit('keyPress', {inputId:'up', state:false});
    }
}
