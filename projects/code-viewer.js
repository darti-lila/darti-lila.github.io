/* ===== CODE VIEWER WITH MULTI-FILE NAVIGATION ===== */

// ======== EDIT: ADD YOUR CODE FILES HERE ========
const codeFiles = [
  {
    filename: 'main.py',
    language: 'python',
    code: `# Temperature and Barometric Calculation Assistant
import board
import adafruit_bmp280
import time

# Initialize I2C and sensor
i2c = board.I2C()
sensor = adafruit_bmp280.Adafruit_BMP280_I2C(i2c)

# Sea level pressure for altitude calculation
sensor.sea_level_pressure = 1013.25

def read_sensor():
    """Read temperature, pressure, and altitude from sensor"""
    temperature = sensor.temperature
    pressure = sensor.pressure
    altitude = sensor.altitude
    
    return {
        'temp': temperature,
        'pressure': pressure,
        'altitude': altitude
    }

while True:
    data = read_sensor()
    print(f"Temperature: {data['temp']:.2f} °C")
    print(f"Pressure: {data['pressure']:.2f} hPa")
    print(f"Altitude: {data['altitude']:.2f} meters")
    print("-" * 30)
    
    time.sleep(2)`
  },
  {
    filename: 'arduino_control.ino',
    language: 'arduino',
    code: `// Arduino Solar Tracker Control
#include <Servo.h>

Servo panServo;
Servo tiltServo;

const int LDR_TOP = A0;
const int LDR_BOTTOM = A1;
const int LDR_LEFT = A2;
const int LDR_RIGHT = A3;

void setup() {
  Serial.begin(9600);
  panServo.attach(9);
  tiltServo.attach(10);
  
  // Initialize to center position
  panServo.write(90);
  tiltServo.write(90);
}

void loop() {
  int topLight = analogRead(LDR_TOP);
  int bottomLight = analogRead(LDR_BOTTOM);
  int leftLight = analogRead(LDR_LEFT);
  int rightLight = analogRead(LDR_RIGHT);
  
  // Calculate differences
  int vertDiff = topLight - bottomLight;
  int horizDiff = leftLight - rightLight;
  
  // Adjust servos based on light difference
  if (abs(vertDiff) > 50) {
    int tiltPos = tiltServo.read();
    if (vertDiff > 0) tiltPos += 1;
    else tiltPos -= 1;
    tiltServo.write(constrain(tiltPos, 0, 180));
  }
  
  if (abs(horizDiff) > 50) {
    int panPos = panServo.read();
    if (horizDiff > 0) panPos += 1;
    else panPos -= 1;
    panServo.write(constrain(panPos, 0, 180));
  }
  
  delay(100);
}`
  },
  {
    filename: 'config.js',
    language: 'javascript',
    code: `// Configuration settings
const config = {
  sensor: {
    updateInterval: 2000, // ms
    temperatureUnit: 'celsius',
    pressureUnit: 'hPa'
  },
  
  display: {
    theme: 'dark',
    showGraph: true,
    refreshRate: 1000
  },
  
  alerts: {
    highTemp: 35,
    lowTemp: -10,
    highPressure: 1030,
    lowPressure: 980
  },
  
  logging: {
    enabled: true,
    path: './logs/',
    maxSize: 10 // MB
  }
};

export default config;`
  }
];

// Current file index
let currentFileIndex = 0;

// Simple syntax highlighting
function highlightCode(code, language) {
  let highlighted = code;
  
  // Keywords for different languages
  const keywords = {
    python: ['import', 'from', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'with', 'as', 'break', 'continue'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'new', 'this', 'default'],
    arduino: ['void', 'int', 'float', 'char', 'String', 'digitalWrite', 'pinMode', 'Serial', 'HIGH', 'LOW', 'OUTPUT', 'INPUT', 'const', 'setup', 'loop', 'delay', 'analogRead', 'constrain', 'abs']
  };
  
  // Escape HTML
  highlighted = highlighted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Highlight comments
  if (language === 'python') {
    highlighted = highlighted.replace(/(#.*$)/gm, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'javascript' || language === 'arduino') {
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color:#6a9955">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>');
  }
  
  // Highlight strings
  highlighted = highlighted.replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#ce9178">$1</span>');
  
  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>');
  
  // Highlight keywords
  const langKeywords = keywords[language] || [];
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span style="color:#569cd6">$1</span>');
  });
  
  return highlighted;
}

// Display code file
function displayCode(index) {
  const container = document.getElementById('code-display');
  if (!container || codeFiles.length === 0) return;
  
  const file = codeFiles[index];
  
  // Create header
  const header = document.createElement('div');
  header.className = 'code-header';
  header.innerHTML = `
    <span class="code-filename">📄 ${file.filename}</span>
    <button class="code-copy-btn" onclick="copyCode(${index})">Copy</button>
  `;
  
  // Create code block
  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');
  codeElement.innerHTML = highlightCode(file.code, file.language);
  codeElement.dataset.rawCode = file.code;
  pre.appendChild(codeElement);
  
  // Update container
  container.innerHTML = '';
  container.appendChild(header);
  container.appendChild(pre);
  
  // Update display
  document.getElementById('code-num').textContent = index + 1;
  document.getElementById('code-count').textContent = codeFiles.length;
  
  updateCodeButtons();
}

// Update button states
function updateCodeButtons() {
  const prevBtn = document.getElementById('prev-code');
  const nextBtn = document.getElementById('next-code');
  
  if (prevBtn) prevBtn.disabled = (currentFileIndex <= 0);
  if (nextBtn) nextBtn.disabled = (currentFileIndex >= codeFiles.length - 1);
}

// Navigation functions
function showPrevCode() {
  if (currentFileIndex > 0) {
    currentFileIndex--;
    displayCode(currentFileIndex);
  }
}

function showNextCode() {
  if (currentFileIndex < codeFiles.length - 1) {
    currentFileIndex++;
    displayCode(currentFileIndex);
  }
}

// Copy code to clipboard
function copyCode(index) {
  const code = codeFiles[index].code;
  
  navigator.clipboard.writeText(code).then(() => {
    const buttons = document.querySelectorAll('.code-copy-btn');
    const button = buttons[0]; // Since we only have one displayed at a time
    
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = 'var(--copper-lit)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'var(--pixel)';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy code');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('code-display');
  
  if (container && codeFiles.length > 0) {
    // Display first file
    displayCode(0);
    
    // Setup navigation
    const prevBtn = document.getElementById('prev-code');
    const nextBtn = document.getElementById('next-code');
    
    if (prevBtn) prevBtn.addEventListener('click', showPrevCode);
    if (nextBtn) nextBtn.addEventListener('click', showNextCode);
  }
});
