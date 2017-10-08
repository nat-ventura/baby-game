var socket = io();
socket.emit('happy', {
    reason: 'its my birthday'
});
socket.on('serverMessage', (data) => {
    console.log(data.message);
})