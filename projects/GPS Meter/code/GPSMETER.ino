#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

const int start = 2, stop = 3, RXPin = 4, TXPin = 5;

LiquidCrystal_I2C lcd(0x27, 16, 2);

byte liti[] = {
  B00000,
  B01110,
  B11111,
  B01110,
  B00100,
  B01110,
  B10101,
  B00000
};

const uint32_t GPSBaud = 9600;
SoftwareSerial ss(RXPin, TXPin);
TinyGPSPlus gps;

void setup()
{
  pinMode(start, INPUT);
  pinMode(stop, INPUT);

  Serial.begin(115200);
  ss.begin(GPSBaud);

  lcd.init();
  lcd.backlight();
  lcd.write(3);
  delay(4000);
  
}

void loop()
{
  while (ss.available() > 0) {

    Serial.print(ss.read());

    if (gps.encode(ss.read())) {  

      

      if (gps.location.isValid()) {
        
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Lat: ");
        lcd.print(gps.location.lat(), 3);
        lcd.setCursor(0, 1);
        lcd.print("Lon: ");
        lcd.print(gps.location.lng(), 3);
        Serial.println(gps.satellites.value());

        

        double initLat = 0;
        double initLon = 0;
        double initAlt = 0;
        double finalLat = 0;
        double finalLon = 0;
        double finalAlt = 0;
        double distanceTraveled = 0;

           if(start == HIGH){
              
              initLat = gps.location.lat();
              initLon = gps.location.lng();
              initAlt = gps.altitude.meters();


              

              lcd.clear();
              lcd.setCursor(0, 0);
              lcd.print("Start Saved");

              delay(3000);

              }
            if(stop == HIGH){

              finalLat = gps.location.lat();
              finalLon = gps.location.lng();
              finalAlt = gps.altitude.meters();

              distanceTraveled = sqrt(pow((abs(acos(sin(initLat) * sin(finalLat) + cos(initLat) * cos(finalLat) * cos(finalLon-initLon))*6371)),2) + pow((finalAlt-initAlt),2)); //6371 is earth's radius in KM)

              lcd.clear();
              lcd.setCursor(0, 0);
              lcd.print("Distance Traveled: ");
              lcd.setCursor(0, 1);
              lcd.print(distanceTraveled);
            }


              else{
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Distance: ");
                lcd.setCursor(0, 1);
                lcd.print(distanceTraveled);
              }

                delay(3000);
            }


        }


      else{
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Waiting for: ");
        lcd.setCursor(0,1);
        if(gps.satellites.value() >= 0 ){
        //Serial.print(gps.satellites.value());
        lcd.print("Satellites = " + String(gps.satellites.value()));
        
        delay(5000);

        }
      }
    }
  }


  
