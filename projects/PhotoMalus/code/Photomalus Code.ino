#include <Wire.h>
#include <Adafruit_APDS9960.h>
#include <Adafruit_TSL2591.h>

Adafruit_APDS9960 apds;
Adafruit_TSL2591 tsl = Adafruit_TSL2591(2591);

// LED/Diode pins
const int LED_PIN_1 = 6;
const int LED_PIN_2 = 7;
const int LED_PIN_3 = 8;

// Timing variables
unsigned long previousMillis = 0;
unsigned long previousMeasurementMillis = 0;
const long blinkInterval = 5000;       
const long measurementInterval = 1000; 
bool ledState = false;                 

// LED control variables
int activeLED = 0; // 0 = all off, 1 = LED1, 2 = LED2, 3 = LED3

// Measurement variables
uint16_t clear, red, green, blue;
uint32_t lum;
float lux;

void setup() {
  Serial.begin(9600);
  
  // Initialize LED pins
  pinMode(LED_PIN_1, OUTPUT);
  pinMode(LED_PIN_2, OUTPUT);
  pinMode(LED_PIN_3, OUTPUT);
  digitalWrite(LED_PIN_1, LOW);
  digitalWrite(LED_PIN_2, LOW);
  digitalWrite(LED_PIN_3, LOW);
  
  Serial.println("Initializing sensors...");
  
  if (!apds.begin()) {
    Serial.println("Failed to initialize APDS9960! Check wiring.");
    while (1) delay(10);
  }
  
  apds.enableColor(true);
  Serial.println("APDS9960 initialized successfully!");
  
  if (!tsl.begin()) {
    Serial.println("Failed to initialize TSL2591! Check wiring.");
    while (1) delay(10);
  }
  
  // Configure TSL2591
  tsl.setGain(TSL2591_GAIN_MED);          // 25x gain
  tsl.setTiming(TSL2591_INTEGRATIONTIME_300MS);
  
  Serial.println("TSL2591 initialized successfully!");
  displayTSL2591Details();
  
  Serial.println("Setup complete. Starting measurements...");
  Serial.println("Commands: '1' = LED1 blink, '2' = LED2 blink, '3' = LED3 blink, '0' = all LEDs off");
  Serial.println("Selected LED will blink on/off every 1 second");
  Serial.println();
}

void loop() {
  unsigned long currentMillis = millis();
  
  handleSerialCommands();
  
  handleLEDBlinking(currentMillis);
  
  if (currentMillis - previousMeasurementMillis >= measurementInterval) {
    previousMeasurementMillis = currentMillis;
    
    measureAPDS9960();
    measureTSL2591();
    
    printMeasurements();
  }
}

void handleSerialCommands() {
  if (Serial.available()) {
    char command = Serial.read();
    switch (command) {
      case '1':
        activeLED = 1;
        Serial.println("LED 1 BLINKING - others OFF");
        break;
      case '2':
        activeLED = 2;
        Serial.println("LED 2 BLINKING - others OFF");
        break;
      case '3':
        activeLED = 3;
        Serial.println("LED 3 BLINKING - others OFF");
        break;
      case '0':
        activeLED = 0;
        digitalWrite(LED_PIN_1, LOW);
        digitalWrite(LED_PIN_2, LOW);
        digitalWrite(LED_PIN_3, LOW);
        Serial.println("All LEDs OFF");
        break;
    }
  }
}

void handleLEDBlinking(unsigned long currentMillis) {
  if (activeLED == 0) {
    return;
  }
  
  if (currentMillis - previousMillis >= blinkInterval) {
    previousMillis = currentMillis;
    
    ledState = !ledState;
    
    digitalWrite(LED_PIN_1, LOW);
    digitalWrite(LED_PIN_2, LOW);
    digitalWrite(LED_PIN_3, LOW);
    
    if (ledState) {
      switch (activeLED) {
        case 1:
          digitalWrite(LED_PIN_1, HIGH);
          break;
        case 2:
          digitalWrite(LED_PIN_2, HIGH);
          break;
        case 3:
          digitalWrite(LED_PIN_3, HIGH);
          break;
      }
    }
  }
}

void measureAPDS9960() {
  while (!apds.colorDataReady()) {
    delay(5);
  }
  
  apds.getColorData(&red, &green, &blue, &clear);
}

void measureTSL2591() {
  lum = tsl.getFullLuminosity();
  uint16_t ir = lum >> 16;
  uint16_t full = lum & 0xFFFF;
  
  // Calculate lux
  lux = tsl.calculateLux(full, ir);
}

void printMeasurements() {
  Serial.println("=== Sensor Readings ===");
  
  // APDS9960 data
  Serial.println("APDS9960 (Color):");
  Serial.print("  Clear: "); Serial.println(clear);
  Serial.print("  Red: "); Serial.println(red);
  Serial.print("  Green: "); Serial.println(green);
  Serial.print("  Blue: "); Serial.println(blue);
  
  // TSL2591 data
  Serial.println("TSL2591 (Light):");
  uint16_t ir = lum >> 16;
  uint16_t full = lum & 0xFFFF;
  Serial.print("  IR: "); Serial.println(ir);
  Serial.print("  Full: "); Serial.println(full);
  Serial.print("  Visible: "); Serial.println(full - ir);
  Serial.print("  Lux: "); Serial.println(lux);
  
  // LED status
  Serial.print("LED Status: ");
  if (activeLED == 0) {
    Serial.println("All LEDs OFF");
  } else {
    Serial.print("LED"); Serial.print(activeLED); Serial.print(" BLINKING ");
    Serial.print("(Currently: ");
    if (ledState) Serial.print("ON");
    else Serial.print("OFF");
    Serial.println(")");
  }
  Serial.println();
}

void displayTSL2591Details() {
  sensor_t sensor;
  tsl.getSensor(&sensor);
  Serial.println("TSL2591 Sensor Details:");
  Serial.print("Sensor: "); Serial.println(sensor.name);
  Serial.print("Max Value: "); Serial.print(sensor.max_value); Serial.println(" lux");
  Serial.print("Min Value: "); Serial.print(sensor.min_value); Serial.println(" lux");
  Serial.print("Resolution: "); Serial.print(sensor.resolution); Serial.println(" lux");
  Serial.println();
}