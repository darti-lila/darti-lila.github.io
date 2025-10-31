/* ===== CODE VIEWER ===== */

// ======== CONFIGURATION ========
const CODE_EXTENSIONS = {
  '.py': 'python',
  '.js': 'javascript',
  '.ino': 'arduino',
  '.cpp': 'cpp',
  '.c': 'cpp',
  '.h': 'cpp',
  '.html': 'html',
  '.css': 'css',
  '.java': 'java',
  '.ts': 'javascript',
  '.jsx': 'javascript',
  '.sh': 'bash'
};

// ======== CODE ========
const codeFiles = [
  'code/GPSMETER.ino',
];

// Current file index and loaded files cache
let currentFileIndex = 0;
let loadedCodeFiles = [];

// Get base path (folder where the HTML file is)
function getBasePath() {
  const path = window.location.pathname;
  return path.substring(0, path.lastIndexOf('/') + 1);
}

// Detect language from filename
function detectLanguage(filename) {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return CODE_EXTENSIONS[ext] || 'text';
}

// Simple syntax highlighting
function highlightCode(code, language) {
  let highlighted = code;
  
  // Keywords for different languages
  const keywords = {
    python: ['import', 'from', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'with', 'as', 'break', 'continue', 'try', 'except', 'finally', 'raise', 'lambda', 'yield'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'new', 'this', 'default', 'case', 'switch', 'break', 'continue', 'try', 'catch', 'finally'],
    arduino: ['void', 'int', 'float', 'char', 'String', 'bool', 'byte', 'digitalWrite', 'pinMode', 'Serial', 'HIGH', 'LOW', 'OUTPUT', 'INPUT', 'INPUT_PULLUP', 'const', 'setup', 'loop', 'delay', 'analogRead', 'analogWrite', 'constrain', 'abs', 'map', 'attachInterrupt'],
    cpp: ['include', 'using', 'namespace', 'std', 'int', 'float', 'double', 'char', 'void', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'const', 'static', 'virtual', 'template', 'typename'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'static', 'final', 'void', 'int', 'String', 'boolean', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'super'],
    html: ['DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'title', 'meta', 'link', 'script', 'style', 'img', 'href', 'src'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height', 'flex', 'grid'],
    bash: ['echo', 'cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while']
  };
  
  // Escape HTML
  highlighted = highlighted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Highlight comments
  if (language === 'python' || language === 'bash') {
    highlighted = highlighted.replace(/(#.*$)/gm, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'javascript' || language === 'arduino' || language === 'cpp' || language === 'java') {
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color:#6a9955">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'html') {
    highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#6a9955">$1</span>');
  } else if (language === 'css') {
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

// Load code file from path
async function loadCodeFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${filePath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading code file:', error);
    return `// Error loading file: ${filePath}\n// ${error.message}\n// Make sure:\n// 1. The file exists in the correct location\n// 2. The path in code-viewer.js is correct\n// 3. You're using a web server (not file://)`;
  }
}

// Display code file with scroll
async function displayCode(index) {
  const container = document.getElementById('code-display');
  if (!container || codeFiles.length === 0) return;
  
  const filePath = codeFiles[index];
  const filename = filePath.substring(filePath.lastIndexOf('/') + 1);
  const language = detectLanguage(filename);
  
  // Load code if not already loaded
  if (!loadedCodeFiles[index]) {
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--pixel);">Loading code...</div>';
    loadedCodeFiles[index] = await loadCodeFile(filePath);
  }
  
  const code = loadedCodeFiles[index];
  
  // Create header
  const header = document.createElement('div');
  header.className = 'code-header';
  header.innerHTML = `
    <span class="code-filename">📄 ${filename}</span>
    <button class="code-copy-btn" onclick="copyCode(${index})">Copy</button>
  `;
  
  // Create scrollable content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'code-content-wrapper';
  
  // Create code block
  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');
  codeElement.innerHTML = highlightCode(code, language);
  codeElement.dataset.rawCode = code;
  pre.appendChild(codeElement);
  contentWrapper.appendChild(pre);
  
  // Update container
  container.innerHTML = '';
  container.appendChild(header);
  container.appendChild(contentWrapper);
  
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