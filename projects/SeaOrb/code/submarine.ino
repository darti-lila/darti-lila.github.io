#include <DHT.h>
#include <DHT_U.h>

#define ledHigh 3
#define ledLow  2
#define motorLS 6
#define motorLS1 10
#define motorLB 8
#define motorLB1 9
#define motorRS 5
#define motorRS1 7
#define motorRB 11
#define motorRB1 12
#define divePump 4
#define surfacePump 13





void setup() {

  Serial.begin(9600);
  pinMode(ledHigh, OUTPUT);
  pinMode(ledLow, OUTPUT);
  pinMode(motorLS, OUTPUT);
  pinMode(motorLS1, OUTPUT);
  pinMode(motorLB, OUTPUT);
  pinMode(motorLB1, OUTPUT);
  pinMode(motorRS, OUTPUT);
  pinMode(motorRS1, OUTPUT);


  // put your setup code here, to run once:

}

void forward(){

  digitalWrite(motorRB, HIGH);
  digitalWrite(motorRB1, LOW);
  digitalWrite(motorLB, LOW);
  digitalWrite(motorLB1, HIGH);

}

void left(){

  digitalWrite(motorLS, HIGH);
  digitalWrite(motorLS1, LOW);
  digitalWrite(motorRS, LOW);
  digitalWrite(motorRS1, HIGH);


}

void right(){

  digitalWrite(motorRS, HIGH);
  digitalWrite(motorRS1, LOW);
  digitalWrite(motorLS, LOW);
  digitalWrite(motorLS1, HIGH);


}

void reverse(){

  digitalWrite(motorRB, LOW);
  digitalWrite(motorRB1, HIGH);
  digitalWrite(motorLB, HIGH);
  digitalWrite(motorLB1, LOW);

}


void enableHighBeams(){

  digitalWrite(ledHigh, HIGH);

}

void disableHighBeams(){

  digitalWrite(ledHigh, LOW);

}

void enableLowBeams(){

  digitalWrite(ledLow, HIGH);

}

void disableLowBeams(){

  digitalWrite(ledLow, LOW);

}

void dive(){
  
  Serial.println("Diving");
  digitalWrite(divePump, HIGH);

}

void stopDive(){

  digitalWrite(divePump, LOW);

}

void surface(){

  digitalWrite(surfacePump, HIGH);

}

void stopSurface(){

  digitalWrite(surfacePump, LOW);

}

void halt(){

  digitalWrite(motorRB, LOW);
  digitalWrite(motorRB1, LOW);
  digitalWrite(motorLB, LOW);
  digitalWrite(motorLB1, LOW);
  digitalWrite(motorRS, LOW);
  digitalWrite(motorRS1, LOW);
  digitalWrite(motorLS, LOW);
  digitalWrite(motorLS1, LOW);
  stopSurface();
  stopDive();

}




void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available()) {
    Serial.println("Serial is Available!");
    char receivedChar = Serial.read();
    if (receivedChar == 'W') {
      forward();
    }
    else if (receivedChar == 'A') {
      left();
    }
    else if (receivedChar == 'S') {
      reverse();
    }
    else if (receivedChar == 'D') {
      right();
    }
    else if (receivedChar == 'I') {
      enableHighBeams();
    }
    else if (receivedChar == 'K') {
      disableHighBeams();
    }
    else if (receivedChar == 'U') {
      enableLowBeams();
    }
    else if (receivedChar == 'J') {
      disableLowBeams();
    }
    else if (receivedChar == 'P') {
      halt();
    }
    else if(receivedChar == '.'){
      dive();
    }
    else if(receivedChar == ','){
      surface();
    }

  }

  

}
