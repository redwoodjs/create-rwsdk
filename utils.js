// Function to detect the package manager used
function detectPackageManager() {
  // Check npm_execpath first (most reliable)
  // This is set by npm, pnpm, and yarn when they execute scripts/commands
  const execPath = process.env.npm_execpath;
  if (execPath) {
    if (execPath.includes("pnpm")) {
      return "pnpm";
    } else if (execPath.includes("yarn")) {
      return "yarn";
    } else if (execPath.includes("npm")) {
      return "npm";
    }
  }

  // Fallback to user agent (less reliable, but works in some cases)
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.includes("yarn")) {
      return "yarn";
    } else if (userAgent.includes("pnpm")) {
      return "pnpm";
    } else if (userAgent.includes("npm")) {
      return "npm";
    }
  }

  // Default to npm if nothing is detected
  return "npm";
}

// Function to get the appropriate commands for the detected package manager
function getPackageManagerCommands(packageManager) {
  const commands = {
    npm: {
      install: "npm install",
      dev: "npm run dev",
    },
    yarn: {
      install: "yarn install",
      dev: "yarn dev",
    },
    pnpm: {
      install: "pnpm install",
      dev: "pnpm dev",
    },
  };

  return commands[packageManager] || commands.npm;
}

module.exports = {
  detectPackageManager,
  getPackageManagerCommands,
};
