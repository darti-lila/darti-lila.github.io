/* ===== INTERACTIVE TERMINAL ===== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  
  const commands = {
    help: () => `
Available commands:
  \nhelp       - Show this help message
  \nabout      - Learn more about me
  \nskills     - Display my technical skills
  \nprojects   - List all projects
  \ncontact    - Get contact information
  \nclear      - Clear terminal
  \ngates      - Obvious secret command
  \ntransistors - Obvious secret command 2
  \nsocial     - Show social media links
  \ntheme      - Toggle light/dark theme
  \nminimize   - Minimize terminal (or use Ctrl+\`)
    `,
    
    about: () => `
╔════════════════════════════════════════╗
║         DARTI LILA - PROFILE                          ║
╚════════════════════════════════════════╝

Role: Electrical & Computer Engineering Student
Passion: Hardware + Software Integration
Focus: Building reliable, innovative solutions

I love mixing hardware & software to build 
reliable, shiny things. Constantly learning, 
soldering, and coding new projects!
    `,
    
    skills: () => {
      const tagCount = {};
      document.querySelectorAll('.tag').forEach(tag => {
        const skill = tag.textContent.trim();
        tagCount[skill] = (tagCount[skill] || 0) + 1;
      });
      
      const sortedSkills = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      let output = '\n╔════════════════════════════════════════╗\n';
      output += '║           SKILL BREAKDOWN              ║\n';
      output += '╚════════════════════════════════════════╝\n\n';
      
      sortedSkills.forEach(([skill, count]) => {
        const maxCount = sortedSkills[0][1];
        const percentage = Math.round((count / maxCount) * 100);
        const bars = '█'.repeat(Math.floor(percentage / 10));
        const spaces = '░'.repeat(10 - Math.floor(percentage / 10));
        output += `  ${skill.padEnd(20)} [${bars}${spaces}] ${count} projects\n`;
      });
      
      return output;
    },
    
    projects: () => {
      const electrical = Array.from(document.querySelectorAll('#electrical .project-card h3'))
        .map(h => h.textContent.trim());
      const programming = Array.from(document.querySelectorAll('#programming .project-card h3'))
        .map(h => h.textContent.trim());
      
      let output = '\n╔════════════════════════════════════════╗\n';
      output += '║         PROJECT PORTFOLIO              ║\n';
      output += '╚════════════════════════════════════════╝\n\n';
      output += 'ELECTRICAL PROJECTS:\n';
      electrical.forEach((proj, i) => output += `  ${i + 1}. ${proj}\n`);
      output += '\nPROGRAMMING PROJECTS:\n';
      programming.forEach((proj, i) => output += `  ${i + 1}. ${proj}\n`);
      output += `\nTotal: ${electrical.length + programming.length} projects\n`;
      
      return output;
    },
    
    contact: () => `
╔════════════════════════════════════════╗
║          CONTACT INFORMATION           ║
╚════════════════════════════════════════╝

Email:    dartilila@gmail.com
LinkedIn: linkedin.com/in/dartilila
GitHub:   github.com/darti-lila

Feel free to reach out for collaborations,
questions, or just to chat about tech!
    `,
    
    social: () => `
SOCIAL MEDIA LINKS:
  dartilila@gmail.com
  linkedin.com/in/dartilila
  github.com/darti-lila
    `,
    
    clear: () => {
      output.innerHTML = '';
      return '';
    },
    
    theme: () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      return `Theme switched to ${newTheme} mode!`;
    },
    
    minimize: () => {
      const terminalFloat = document.getElementById('terminal-float');
      terminalFloat.classList.toggle('minimized');
      return 'Terminal minimized. Click header or press Ctrl+` to restore.';
    },
    
    gates: () => `
Gates

  |-----           \---            \\----
--|     |        -- |   \        -- ||    \
  |NAND |O--        |NOR |O--       ||XNOR |O--
--|     |        -- |   /        -- ||    /
  |-----           /---            //----


  |-----           \---            \\---
--|     |        -- |   \        -- ||   \
  | AND |---        | OR |---       ||XOR |---
--|     |        -- |   /        -- ||   /
  |-----           /---            //---

    |\          |\
  --| |O--    --| |---
    |/          |/

    You found the secret! Here's a pixel trophy!
    Achievement Unlocked: Curious Developer


    Fun fact: This portfolio has ${document.querySelectorAll('.project-card').length} projects!
    `,
    transistors: () => `
    FET's & BJT's

   |/-----      | /----       ||-----       ||-----
---|         ---|           --||->|       --||<-|
   |\>----      |<\----       ||--|--       ||--|--
  };
  `,
  };
  
  // Command history
  const commandHistory = [];
  let historyIndex = -1;
  
  input.addEventListener('keydown', (e) => {
    // Up arrow - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
      }
    }
    // Down arrow - next command
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        input.value = '';
      }
    }
    // Tab - autocomplete
    else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      if (partial) {
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          const matchLine = document.createElement('div');
          matchLine.className = 'terminal-line';
          matchLine.textContent = `Possible commands: ${matches.join(', ')}`;
          output.appendChild(matchLine);
          output.scrollTop = output.scrollHeight;
        }
      }
    }
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      
      // Add to history
      if (command && command !== commandHistory[commandHistory.length - 1]) {
        commandHistory.push(command);
        // Keep only last 50 commands
        if (commandHistory.length > 50) {
          commandHistory.shift();
        }
      }
      historyIndex = -1;
      
      // Display command
      const commandLine = document.createElement('div');
      commandLine.className = 'terminal-line';
      commandLine.innerHTML = `<span class="terminal-prompt">darti@portfolio:~$</span> ${input.value}`;
      output.appendChild(commandLine);
      
      // Execute command
      const resultLine = document.createElement('div');
      resultLine.className = 'terminal-line';
      resultLine.style.whiteSpace = 'pre-wrap'; // Preserve formatting
      
      if (command === '') {
        // Do nothing for empty command
      } else if (commands[command]) {
        resultLine.textContent = commands[command]();
      } else {
        resultLine.innerHTML = `<span style="color: var(--copper-lit);">Command not found: ${command}</span>\nType 'help' for available commands.`;
      }
      
      if (resultLine.textContent || resultLine.innerHTML) {
        output.appendChild(resultLine);
      }
      
      // Clear input and scroll to bottom
      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });
  
  // Auto-focus on terminal when it's visible
  const terminalFloat = document.getElementById('terminal-float');
  const observer = new MutationObserver(() => {
    if (!terminalFloat.classList.contains('minimized')) {
      input.focus();
    }
  });
  observer.observe(terminalFloat, { attributes: true, attributeFilter: ['class'] });
}