// function will be called if player connects to server

const Player = require('./classes');
const {
  isValidPassword,
  isUsernameTaken,
  addUser
} = require('./userValidation');

module.exports = (serv) => {
  // socket object
  const SOCKET_OBJ = {};

  var io = require('socket.io')(serv,{});
  io.sockets.on('connection', socket => {
    socket.id = Math.random();
    SOCKET_OBJ[socket.id] = socket;

    socket.on('signIn', (data) => {
      if (isValidPassword(data)) {
        Player.onConnect(socket);
        socket.emit('signInResponse', {success:true});
      } else {
        socket.emit('signInResponse', {success:false});
      }
    });
    socket.on('signUp', (data) => {
      if (isUsernameTaken(data)) {
        socket.emit('signUpResponse', {success:false});
      } else {
        addUser(data);
        socket.emit('signUpResponse', {success:true});
      }
    });

    socket.x = 0;
    socket.y = 0;
    socket.number = String(Math.floor(10 * Math.random()));

    socket.on('disconnect', () => {
      delete SOCKET_OBJ[socket.id];
      Player.onDisconnect(socket);
    });

    socket.on('sendMessageToServer', (data) => {
      var playerName = ('' + socket.id).slice(2,7);
      for (var i in SOCKET_OBJ) {
        SOCKET_OBJ[i].emit('addToChat', playerName + ': ' + data);
        console.log("i'm the socket list index", SOCKET_OBJ[i])
      }
    });

  });

  // location
  setInterval( () => {
    var package = Player.update();
    
    for (var i in SOCKET_OBJ) {
      var socket = SOCKET_OBJ[i];
      socket.emit('newPositions', package);
    }

  }, 1000/25)
}

