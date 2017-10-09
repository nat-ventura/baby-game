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
  
module.exports = Player;