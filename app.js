var express = require('express');
var app = express();
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
const serv = require('http').Server(app);
// var classes = require('classes');
// var controls = require('playerControls');
require('dotenv').config();

// var index = require('./routes/index');
// var users = require('./routes/users');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(path.join(__dirname, 'client')));

serv.listen(2000);
console.log('server started 2k');

// socket object
const SOCKET_OBJ = {};

// temp users object
var USERS = {
  'bob': 'asd'
}

// entity
var Entity = () => {
  var self = {
    x: 250,
    y: 250,
    speedX: 0,
    speedY: 0,
    id: ''
  }
  self.update = () => {
    self.updatePosition();
  }
  self.updatePosition = () => {
    self.x += self.speedX;
    self.y += self.speedY;
  }
  return self;
}

// player 
var Player = (id) => {
  var self = Entity ();
  self.id = id;
  self.number = String(Math.floor(10 * Math.random()));
  self.pressingRight = false;
  self.pressingLeft = false;
  self.pressingUp = false;
  self.pressingDown = false;
  self.maxSpeed = 5;

  var super_update = self.update;

  self.update = () => {
      self.updateSpeed();
      super_update();
}
  self.updateSpeed = () => {
      if (self.pressingRight) {
          self.speedX += self.maxSpeed;
      }
      else if (self.pressingLeft) {
          self.speedX -= self.maxSpeed;
      } else {
          self.speedX = 0;
      }

      if (self.pressingUp) {
          self.speedY -= self.maxSpeed;
      }
      else if (self.pressingDown) {
          self.speedY += self.maxSpeed;
      } else {
          self.speedY = 0;
      }
  }
  Player.obj[id] = self;
  return self;
}

Player.onConnect = (socket) => {
  var player = Player(socket.id);
  //receives keyPress directions from socket 
  socket.on('keyPress', (data) => {
      if (data.inputId === 'left') {
        player.pressingLeft = data.state;
      } else if (data.inputId === 'right') {
        player.pressingRight = data.state;
      } else if (data.inputId === 'up') {
        player.pressingUp = data.state;
      } else if (data.inputId === 'down') {
        player.pressingDown = data.state;
      }
    });
}

Player.onDisconnect = (socket) => {
  delete Player.obj[socket.id];
}

Player.update = () => {
  var package = [];
  for (var i in Player.obj) {
    var player = Player.obj[i];
      player.update();
      package.push({
        x:player.x,
        y:player.y,
        number:player.number
      });
  }
  return package;
}

Player.obj = {};

var isValidPassword = (data) => {
  return USERS[data.username] === data.password;
}
var isUsernameTaken = (data) => {
  return USERS[data.username];
}
var addUser = (data) => {
  USERS[data.username] = data.password;
}

// function will be called if player connects to server
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

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;