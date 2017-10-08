var socket = io();
socket.emit('happy', {
    reason: 'its my birthday'
});