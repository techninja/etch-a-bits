var cncserver = require("cncserver");
var SerialPort = require("./node_modules/cncserver/node_modules/serialport/lib/serialport.js");
var serialPort = {};

var port = process.argv[2];

var x = 0;
var y = 0;
var b = 0;

var lastB = 0;
var lastX = 0;
var lastY = 0;

var gettingWater = false;
var movingPen = false;

var doubleClickWait = false;
var reWaterInterval = 0;

var drawPt = {x: 0, y: 0};


// Actually try to init the connection and handle the various callbacks
cncserver.start({
  localRunner: true,
  success: function() {
    console.log('Port found, connecting...');
  },
  error: function(err) {
    console.log("couldn't connect to bot!");
  },
  connect: function() {
    console.log('Bot Connected!');
    cncserver.setHeight('up');
    connectLeonardo(function(){
      startReading();
    });
  },
  disconnect: function() {
    console.log("Bot disconnected!");
  }
});

function startReading(){
  serialPort = new SerialPort(port, {
    baudrate : 9600,
    parser: SerialPort.parsers.readline("\n"),
    disconnectedCallback: tryReconnect
  });

  serialPort.on("open", function(){
    console.log('Open!');
    serialPort.on("data", controlData);
  });
}

var up;

// Event data callback from littleBits Leonardo
function controlData (data) {
  var d = data.split('|');
  x = parseInt(d[0]) * 2;
  y = parseInt(d[1]) * 2;
  b = parseInt(d[2]);

  // Button get water
  if (b!== lastB) {
    lastB = b;
    if (b === 0) {
      if (!gettingWater) {
        if (!doubleClickWait) {
          doubleClickWait = true;
          console.log('Single button...');
          reWaterInterval = setTimeout(function(){
            doubleClickWait = false;
            console.log('Button Pressed/Released! getting Water');
            //getWater(drawPt);
            if (up) {
              up = false;
              cncserver.setHeight('draw');
            } else {
              up = true;
              cncserver.setHeight('up');
            }
          }, 250);
        } else {
          console.log('Double button! Parking.');
          clearTimeout(reWaterInterval);
          movingPen = true;
          doubleClickWait = false;
          cncserver.setHeight('up');
          cncserver.setPen({x: 0, y: 0, park: true}, function(){
            movingPen = false;
          });
        }

      } else {
        console.log('Already Getting Water');
      }
    }
  }

  // X/Y Movement
  if (!gettingWater && !movingPen) {
    drawPt = {
      x: (lastX + 1) / 10.24,
      y: (lastY + 1) / 10.24
    };

    if (x!== lastX && x!== lastX-1 && x!== lastX+1) {
      lastX = x;
      drawPt.x = (x+1) / 10.24;
      movingPen = true;
    }

    if (y!== lastY && y!== lastY-1 && y!== lastY+1) {
      lastY = y;
      drawPt.y = (y+1) / 10.24;
      movingPen = true;
    }

    // If this is set, then we had a change enough to set this
    if (movingPen) {
      //console.log(drawPt);
      cncserver.setPen(drawPt, function(){
        movingPen = false;
      });
    }
  }
}

// Wrapper for getting water
function getWater(destPt) {
  gettingWater = true;
  cncserver.setTool('water0', function(){
    cncserver.setPen(destPt, function(){
      cncserver.setHeight('draw', function(){
        movingPen = false;
        gettingWater = false;
      });
    });
  });
}


// Helper function for automatically connecting the littleBits leonardo
function connectLeonardo(callback) {
  SerialPort.list(function (err, ports) {
    for (var portID in ports){
      if (ports[portID].serialNumber === 'Arduino_LLC_Arduino_Leonardo') {
        port = ports[portID].comName;
      }
    }

    if (!port) {
      console.error('Littlebits Leonardo not found! ERR 16');
      process.exit(16);
    } else {
      console.log('Leonardo found on port:', port);
      callback();
    }
  });
}

// Trys again and again to reconnect, every 2 seconds
function tryReconnect() {
  console.log('Arduino Disconnected! Trying to reconnect...');
  var tryReconnect = setInterval(function(){
    try {
      serialPort.open(function(){
        if (serialPort.isOpen()) {
          clearInterval(tryReconnect);
          console.log('Reconnect succeeded!');

          // Data callback needs to be rebound... for some reason :P
          serialPort.on("data", controlData);
        } else {
          console.log('Connect fail...');
        }
      });
    } catch(e) {
      // Didn't reconnect
      console.log('Reconnect failed, trying again...', e);
    }
  }, 2000);
}
