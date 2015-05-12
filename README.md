# Etch-A-Bits
A LittleBits "EtchASketch" Style controller for the WaterColorBot via [CNCServer](http://github.com/techninja/cncserver).

![Etch-a-Bits](https://cloud.githubusercontent.com/assets/320747/7578905/ccb7c756-f810-11e4-9cf9-b35196443e3b.jpg)
[Check out the video of this project in action!](https://www.youtube.com/watch?v=npvjusyj1jY)

## What you need:
 0. 1 [littleBits Arduino kit](http://littlebits.cc/kits/arduino-coding-kit), includes fork, button, two dimmers, power block & Arduino block
 1. 1 [RaspberryPi](https://www.raspberrypi.org/) or other computer of almost any kind capable of running Node.js programs with at least two USB ports
 2. 1 [WaterColorBot](http://watercolorbot.com/)
 3. Optionally, a [Buddha Board](http://buddhaboard.com/). Currently this app is setup for only a simple Buddha Board demo, though it could be changed easily to allow for getting other colors, as long as you can manage the limitation of only one button.

![Etch-a-Bits Build](https://cloud.githubusercontent.com/assets/320747/7579266/0713fda2-f816-11e4-99c2-c0ab67408b39.gif)

## Build it:
 0. Connect all the littleBits blocks together as shown above.
 1. Clone or [download a copy](https://github.com/techninja/etch-a-bits/archive/master.zip) of this code to your computer.
 1. Open the code from the the "littleBitsController" folder in your Arduino IDE, and upload that to the littleBits Arduino. Remember the battery needs to be connected _**and** switched on_ to be able to upload to the Arduino.
 2. On the Raspberry Pi, [install Node.js](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js), then clone this repository (`git clone https://github.com/techninja/etch-a-bits.git`), or download the ZIP file as above.
 3. Go into the directory (`cd etch-a-bits/`), and run `npm install`. This will chug away for a while, downloading, compiling and installing all required dependencies.
 4. Plug in the WaterColorBot, then plug in the littleBits Arduino (with power), and run the app via `node etch-a-bits.js`. The Serial ports each one provides should be automatically selected and connected.
 5. The orange-yellow `TX` light on the Arduino should light and stay lit when it's transmitting data to the the program. If it isn't lit, it isn't transmitting. Any loss of power to the littlebits will reset the Arduino and break the connection. We highly reccomend the white mounting board for your finished controller.
 

## Use it!
 * Press the button once to go get water. Once it finishes it will go back to the last position on the canvas and put the brush/pen down.
 * Turn the dimmers for 1:1 control of the X and Y Axes
 * Double-click the button to lift and park the brush/pen. Any movement of the dimmers after park (or before you get water) will allow for accurate positioning of the "last position" without actually drawing, allowing you to make broken line drawings.

-------

Made by TechNinja & "Super-Awesome" Sylvia as a 1 day hack for Maker Faire Bay Area 2015.
See the video here. 
 
 
 
 

