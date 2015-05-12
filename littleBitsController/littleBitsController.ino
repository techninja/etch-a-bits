/**
 * A super-simple littleBits serial controller Sketch.
 * Data is sent out of the serial port as pipe delimited
 * chunks, separated by newlines. Interpreted as "[x]|[y]|[button]".
 * See the whole project @ https://github.com/techninja/etch-a-bits
 *
 * Smoothing code adapted from Paul Badger's digitalSmooth
 * function example to help round out the analog data coming in
 * from the potentiometers.
 *
 * http://playground.arduino.cc/Main/DigitalSmooth
 */

#define SensorPin1      0
#define SensorPin2      1
#define filterSamples   20              // filterSamples should  be an odd number, no smaller than 3
int sensSmoothArray1 [filterSamples];   // array for holding raw sensor values for sensor1
int sensSmoothArray2 [filterSamples];   // array for holding raw sensor values for sensor2

int rawData1, smoothData1;  // variables for sensor1 data
int rawData2, smoothData2;  // variables for sensor2 data

void setup() {
  Serial.begin(9600);
  pinMode(0, INPUT);
}

void loop() {

  rawData1 = analogRead(SensorPin1);                        // read sensor 1
  smoothData1 = digitalSmooth(rawData1, sensSmoothArray1);  // every sensor you use with digitalSmooth needs its own array

  rawData2 = analogRead(SensorPin2);                        // read sensor 2
  smoothData2 = digitalSmooth(rawData2, sensSmoothArray2);  // every sensor you use with digitalSmooth needs its own array

  // Output the data encoded in a single pipe delimited line.
  Serial.print(smoothData1);
  Serial.print('|');
  Serial.print(smoothData2);
  Serial.print('|');
  Serial.println(digitalRead(0));

  delay(15);        // delay in between reads for stability
}

int digitalSmooth(int rawIn, int *sensSmoothArray){     // "int *sensSmoothArray" passes an array to the function - the asterisk indicates the array name is a pointer
  int j, k, temp, top, bottom;
  long total;
  static int i;
  static int sorted[filterSamples];
  boolean done;

  i = (i + 1) % filterSamples;    // increment counter and roll over if necc. -  % (modulo operator) rolls over variable
  sensSmoothArray[i] = rawIn;                 // input new data into the oldest slot

  for (j=0; j<filterSamples; j++){     // transfer data array into anther array for sorting and averaging
    sorted[j] = sensSmoothArray[j];
  }

  done = 0;                // flag to know when we're done sorting
  while(done != 1){        // simple swap sort, sorts numbers from lowest to highest
    done = 1;
    for (j = 0; j < (filterSamples - 1); j++){
      if (sorted[j] > sorted[j + 1]){     // numbers are out of order - swap
        temp = sorted[j + 1];
        sorted [j+1] =  sorted[j] ;
        sorted [j] = temp;
        done = 0;
      }
    }
  }

  // throw out top and bottom 15% of samples - limit to throw out at least one from top and bottom
  bottom = max(((filterSamples * 15)  / 100), 1);
  top = min((((filterSamples * 85) / 100) + 1  ), (filterSamples - 1));   // the + 1 is to make up for asymmetry caused by integer rounding
  k = 0;
  total = 0;
  for ( j = bottom; j< top; j++){
    total += sorted[j];  // total remaining indices
    k++;

  }

  return total / k;    // divide by number of samples
}
