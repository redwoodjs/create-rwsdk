// Function to detect the package manager used
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;
  
  if (userAgent) {
    if (userAgent.includes('yarn')) {
      return 'yarn';
    } else if (userAgent.includes('pnpm')) {
      return 'pnpm';
    } else if (userAgent.includes('npm')) {
      return 'npm';
    }
  }
  
  return 'npm';
}

// Function to get the appropriate commands for the detected package manager
function getPackageManagerCommands(packageManager) {
  const commands = {
    npm: {
      install: 'npm install',
      dev: 'npm run dev'
    },
    yarn: {
      install: 'yarn install',
      dev: 'yarn dev'
    },
    pnpm: {
      install: 'pnpm install',
      dev: 'pnpm dev'
    }
  };
  
  return commands[packageManager] || commands.npm;
}

module.exports = {
  detectPackageManager,
  getPackageManagerCommands
};