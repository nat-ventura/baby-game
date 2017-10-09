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

