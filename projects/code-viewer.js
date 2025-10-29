/* ===== CODE VIEWER - LOADS FROM EXTERNAL FILES ===== */

// ======== EDIT: ADD YOUR CODE FILE PATHS HERE ========
const codeFiles = [
  {
    filename: 'tabca_test_1.ino',
    language: 'arduino',
    path: 'assets/T_A_B_C_A/tabca_test_1.ino'
  },
  {
    filename: 'arduino_control.ino',
    language: 'arduino',
    path: 'assets/code/arduino_control.ino'
  },
  {
    filename: 'config.js',
    language: 'javascript',
    path: 'assets/code/config.js'
  }
];

// Current file index
let currentFileIndex = 0;
let loadedCodeFiles = [];

// Simple syntax highlighting
function highlightCode(code, language) {
  let highlighted = code;
  
  // Keywords for different languages
  const keywords = {
    python: ['import', 'from', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'with', 'as', 'break', 'continue', 'try', 'except', 'finally', 'raise'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'new', 'this', 'default', 'case', 'switch', 'break'],
    arduino: ['void', 'int', 'float', 'char', 'String', 'digitalWrite', 'pinMode', 'Serial', 'HIGH', 'LOW', 'OUTPUT', 'INPUT', 'const', 'setup', 'loop', 'delay', 'analogRead', 'constrain', 'abs', 'attachInterrupt'],
    cpp: ['include', 'using', 'namespace', 'std', 'int', 'float', 'double', 'char', 'void', 'class', 'public', 'private', 'return', 'if', 'else', 'for', 'while'],
    html: ['DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'title', 'meta', 'link', 'script', 'style'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height']
  };
  
  // Escape HTML
  highlighted = highlighted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Highlight comments
  if (language === 'python') {
    highlighted = highlighted.replace(/(#.*$)/gm, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'javascript' || language === 'arduino' || language === 'cpp') {
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color:#6a9955">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'html') {
    highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#6a9955">$1</span>');
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

// Load code file from path
async function loadCodeFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load: ${filePath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading code file:', error);
    return `// Error loading file: ${filePath}\n// Make sure the file exists in the correct location.`;
  }
}

// Display code file
async function displayCode(index) {
  const container = document.getElementById('code-display');
  if (!container || codeFiles.length === 0) return;
  
  const file = codeFiles[index];
  
  // Load code if not already loaded
  if (!loadedCodeFiles[index]) {
    loadedCodeFiles[index] = await loadCodeFile(file.path);
  }
  
  const code = loadedCodeFiles[index];
  
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
  codeElement.innerHTML = highlightCode(code, file.language);
  codeElement.dataset.rawCode = code;
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
  const code = loadedCodeFiles[index];
  
  if (!code) {
    alert('Code not loaded yet');
    return;
  }
  
  navigator.clipboard.writeText(code).then(() => {
    const buttons = document.querySelectorAll('.code-copy-btn');
    const button = buttons[0];
    
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