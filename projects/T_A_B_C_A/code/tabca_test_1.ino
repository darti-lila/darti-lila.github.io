#include <Adafruit_BMP085.h>

#include "DHT.h"

#include <bmp180.h>

#include <Wire.h>

#include <Adafruit_BMP085.h>

#include <LiquidCrystal_I2C.h>

#include <SoftwareSerial.h>

#define DHTPIN 8

#define DHTTYPE DHT11

LiquidCrystal_I2C lcd(0x27, 16, 2);



Adafruit_BMP085 bmp;

int vlera;

const int buttonPin = 3;

int buttonState = LOW;

int val_analogique;

int capteur_A = A0;

//4, 5 blu 6, 7 kafe

DHT dht(DHTPIN, DHTTYPE);

const int sensorMin = 0;
const int sensorMax = 1024;



void setup(){
  


  
lcd.init();
lcd.backlight();


pinMode(capteur_A, INPUT);


dht.begin();
  
pinMode(buttonPin, INPUT);  
  
lcd.print("Thank you for");
lcd.setCursor(0,1);
lcd.print("using TABCA 2.0");
delay(5000);
lcd.clear();
}



void loop(){
  
  float sensor_volt;  
  float RS_air; //  Rs in clean air 
  float R0;  // R0 in 1000 ppm LPG 
  float sensorValue; 
  
  int h = dht.readHumidity();

  float t = dht.readTemperature();
  
  float f = dht.readTemperature(true);
  
  float hif = dht.computeHeatIndex(f, h);
  
  buttonState = digitalRead(buttonPin);

  for(int x = 0 ; x < 100 ; x++) 
  { 
    sensorValue = sensorValue + analogRead(A0); 
  } 
  sensorValue = sensorValue/100.0;   
  
  
    lcd.clear();
    lcd.print("Thank you for");
    lcd.setCursor(0,1);
    lcd.print("using TABCA 2.0");
    delay(5000);
    

    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(" Humidity: ");
    lcd.setCursor (11,0);
    lcd.print(h);
    lcd.setCursor(14,0);
    lcd.print("%");
    lcd.setCursor(0,1);
    lcd.print("Temperature: ");
    lcd.setCursor(13,1);
    lcd.print(t);
    lcd.setCursor(15,1);
    lcd.print("C ");
    delay(5000);
    
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Altitude = ");
    lcd.print(bmp.readAltitude());
    lcd.println("m");
    delay(5000);
    
    
    lcd.clear();
    lcd.setCursor(0,0);
    val_analogique=analogRead(capteur_A); 
    lcd.print("% e CO= ");
    lcd.println(val_analogique); 
    lcd.println("");
    lcd.clear();
    delay(5000);
    

      if (h<50){
    lcd.print("Do te ket diell");

  }
  else if (h>=50){
    lcd.print("Do te ket re");

     }
   delay(5000);
    }
  
  
