// entity
class Entity {
    constructor() {
      this.x = 250;
      this.y = 250;
      this.speedX = 0;
      this.speedY = 0;
      this.id = '';
    }
    update() {
      this.updatePosition();
    }
    updatePosition() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }
// still need to create an instance of Entity
  
// player 
class Player extends Entity {
  constructor(id) {
  this.id = id;
  this.number = String(Math.floor(10 * Math.random()));
  this.pressingRight = false;
  this.pressingLeft = false;
  this.pressingUp = false;
  this.pressingDown = false;
  this.maxSpeed = 5;

  var super_update = this.update;

  this.update = () => {
      this.updateSpeed();
      super_update();
}
  this.updateSpeed = () => {
      if (this.pressingRight) {
          this.speedX += this.maxSpeed;
      }
      else if (this.pressingLeft) {
          this.speedX -= this.maxSpeed;
      } else {
          this.speedX = 0;
      }

      if (this.pressingUp) {
          this.speedY -= this.maxSpeed;
      }
      else if (this.pressingDown) {
          this.speedY += this.maxSpeed;
      } else {
          this.speedY = 0;
      }
  }
// formerly, Player.obj[id] = self... back when it wasn't a real class
// hopefully this properly initiates the instance
Player.obj[id] = Player();
// return self;
}
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