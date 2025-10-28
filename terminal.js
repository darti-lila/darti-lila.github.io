/* ===== INTERACTIVE TERMINAL ===== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  
  const commands = {
    help: () => `
Available commands:
  help       - Show this help message
  about      - Learn more about me
  skills     - Display my technical skills
  projects   - List all projects
  contact    - Get contact information
  clear      - Clear terminal
  easteregg  - Find a hidden surprise
  social     - Show social media links
    `,
    
    about: () => `
╔════════════════════════════════════════╗
║         DARTI LILA - PROFILE          ║
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
      output += '║           SKILL BREAKDOWN             ║\n';
      output += '╚════════════════════════════════════════╝\n\n';
      
      sortedSkills.forEach(([skill, count]) => {
        const maxCount = sortedSkills[0][1];
        const percentage = Math.round((count / maxCount) * 100);
        const bars = '█'.repeat(Math.floor(percentage / 10));
        const spaces = '░'.repeat(10 - Math.floor(percentage / 10));
        output += `${skill.padEnd(20)} [${bars}${spaces}] ${count} projects\n`;
      });
      
      return output;
    },
    
    projects: () => {
      const electrical = Array.from(document.querySelectorAll('#electrical .project-card h3'))
        .map(h => h.textContent.trim());
      const programming = Array.from(document.querySelectorAll('#programming .project-card h3'))
        .map(h => h.textContent.trim());
      
      let output = '\n╔════════════════════════════════════════╗\n';
      output += '║         PROJECT PORTFOLIO             ║\n';
      output += '╚════════════════════════════════════════╝\n\n';
      output += '⚡ ELECTRICAL PROJECTS:\n';
      electrical.forEach((proj, i) => output += `  ${i + 1}. ${proj}\n`);
      output += '\n💻 PROGRAMMING PROJECTS:\n';
      programming.forEach((proj, i) => output += `  ${i + 1}. ${proj}\n`);
      output += `\nTotal: ${electrical.length + programming.length} projects\n`;
      
      return output;
    },
    
    contact: () => `
╔════════════════════════════════════════╗
║          CONTACT INFORMATION          ║
╚════════════════════════════════════════╝

📧 Email:    dartilila@gmail.com
💼 LinkedIn: linkedin.com/in/dartilila
🐙 GitHub:   github.com/darti-lila

Feel free to reach out for collaborations,
questions, or just to chat about tech!
    `,
    
    social: () => `
🌐 SOCIAL MEDIA LINKS:
  📧 dartilila@gmail.com
  💼 linkedin.com/in/dartilila
  🐙 github.com/darti-lila
    `,
    
    clear: () => {
      output.innerHTML = '';
      return '';
    },
    
    easteregg: () => `
    ⠀⠀⠀⠀⠀⣀⣤⣴⣶⣾⣿⣷⣶⣦⣤⣀⠀⠀⠀⠀⠀
    ⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀
    ⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
    ⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
    ⢸⣿⣿⣿⣿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⡇
    ⠘⣿⣿⣿⣿⣦⣤⣀⠀⠀⠀⠀⣀⣤⣴⣿⣿⣿⣿⣿⠃
    ⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀
    ⠀⠀⠈⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀
    ⠀⠀⠀⠀⠀⠈⠉⠛⠛⠿⠿⠿⠿⠛⠛⠉⠀⠀⠀⠀⠀

🎮 You found the secret! Here's a pixel trophy!
🏆 Achievement Unlocked: Curious Developer
    `,
  };
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      
      // Display command
      const commandLine = document.createElement('div');
      commandLine.className = 'terminal-line';
      commandLine.innerHTML = `<span class="terminal-prompt">darti@portfolio:~$</span> ${input.value}`;
      output.appendChild(commandLine);
      
      // Execute command
      const resultLine = document.createElement('div');
      resultLine.className = 'terminal-line';
      
      if (command === '') {
        // Do nothing for empty command
      } else if (commands[command]) {
        resultLine.textContent = commands[command]();
      } else {
        resultLine.textContent = `Command not found: ${command}\nType 'help' for available commands.`;
      }
      
      if (resultLine.textContent) {
        output.appendChild(resultLine);
      }
      
      // Clear input and scroll to bottom
      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });
}
