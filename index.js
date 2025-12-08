#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const path = require("path");
const fs = require("fs");
const prompts = require("prompts");
const os = require("os");
const decompress = require("decompress");
const stream = require("stream");
const { promisify } = require("util");

const { detectPackageManager, getPackageManagerCommands } = require("./utils");

// Set up the CLI program
program
  .name("create-rwsdk")
  .description("A wrapper for creating RedwoodSDK starter projects")
  .version("3.0.0-alpha.2");

// Default command (create a new project)
program
  .command("create", { isDefault: true })
  .description("Create a new RedwoodSDK project")
  .argument("[project-name]", "Name of the project directory to create")
  .option("-f, --force", "Force overwrite if directory exists", false)
  .option("--pre", "Use the latest pre-release", false)
  .option(
    "--release <version>",
    "Use a specific release version (e.g., v1.0.0-alpha.1)"
  )
  .action(createProject);

// Function to create a new project
async function createProject(projectName, options) {
  console.log(chalk.bold.red("\n🌲 RedwoodSDK Starter 🌲\n"));

  // Prompt for project name if not provided
  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "What is the name of your project?",
      validate: (value) => (value.trim() ? true : "Project name is required"),
    });

    // Exit if user cancels the prompt (e.g., by pressing Ctrl+C)
    if (!response.projectName) {
      console.log(chalk.yellow("\nProject creation cancelled."));
      process.exit(0);
    }

    projectName = response.projectName.trim();
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory exists and handle accordingly
  if (fs.existsSync(targetDir)) {
    if (!options.force) {
      console.error(
        chalk.red(
          `Error: Directory ${projectName} already exists. Use --force to overwrite.`
        )
      );
      process.exit(1);
    }
    console.log(
      chalk.yellow(`Warning: Overwriting existing directory ${projectName}`)
    );
  }

  const templateName = "starter";

  let version;
  if (options.release) {
    // Use specific version, ensuring it starts with 'v'
    const tagName = options.release.startsWith("v")
      ? options.release
      : `v${options.release}`;
    version = { tag_name: tagName };
  } else if (options.pre) {
    // Use latest pre-release
    version = await getLatestSDKRelease("pre");
  } else {
    // Default: use latest release (including betas marked as latest)
    version = await getLatestSDKRelease("latest");
  }

  // download the tar/zip file from the github release
  const downloadUrl = `https://github.com/redwoodjs/sdk/releases/download/${version.tag_name}/${templateName}-${version.tag_name}.tar.gz`;

  const spinner = ora(
    `Downloading starter template (${chalk.bold(version.tag_name)})...`
  ).start();

  const filePath = path.join(
    os.tmpdir(),
    `redwoodjs-sdk-${version.tag_name}-starter.tar.gz`
  );

  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      spinner.fail(
        chalk.red(
          `Error downloading template: ${response.statusText} (Status: ${response.status})`
        )
      );
      try {
        const errorBody = await response.json();
        console.error(chalk.red(JSON.stringify(errorBody, null, 2)));
      } catch (e) {
        // Ignore if error body itself can't be parsed
      }
      process.exit(1);
    }

    const pipeline = promisify(stream.pipeline);
    await pipeline(response.body, fs.createWriteStream(filePath));

    spinner.succeed(
      chalk.green(
        `Successfully downloaded starter template (${chalk.bold(
          version.tag_name
        )}) to ${chalk.bold(filePath)}`
      )
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed to download template."));
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  const decompressSpinner = ora(
    `Decompressing template into ${chalk.bold(projectName)}...`
  ).start();

  try {
    await decompress(filePath, targetDir);
    decompressSpinner.succeed(
      chalk.green(
        `Successfully created RedwoodSDK starter project in ${chalk.bold(
          projectName
        )}`
      )
    );

    // Detect package manager and get appropriate commands
    const packageManager = detectPackageManager();
    const commands = getPackageManagerCommands(packageManager);

    // Display next steps
    console.log("\n" + chalk.bold("Next steps:"));
    console.log(`  cd ${projectName}`);
    console.log(`  ${commands.install}`);
    console.log(`  ${commands.dev}`);
    console.log("\nHappy coding! 🚀\n");

    // Ensure the process exits properly
    process.exit(0);
  } catch (error) {
    decompressSpinner.fail(chalk.red("Failed to decompress template."));
    console.error(chalk.red(error.message));
    // Clean up downloaded archive if decompression fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    process.exit(1);
  }
}

// Function to get the latest RedwoodSDK release from GitHub
async function getLatestSDKRelease(releaseType = "latest") {
  const GITHUB_API_URL =
    releaseType === "latest"
      ? "https://api.github.com/repos/redwoodjs/sdk/releases/latest"
      : "https://api.github.com/repos/redwoodjs/sdk/releases";
  const auth = process.env.GITHUB_API_TOKEN;
  const spinner = ora("Fetching latest release information...").start();

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        "User-Agent": "create-rwsdk", // GitHub API requires a User-Agent header
        ...(auth ? { Authorization: `Bearer ${auth}` } : {}), // Providing an API token avoids being rate limited
      },
    });

    if (!response.ok) {
      spinner.fail(
        chalk.red(
          `Error fetching release info: ${response.statusText} (Status: ${response.status})`
        )
      );
      try {
        const errorBody = await response.json();
        console.error(chalk.red(JSON.stringify(errorBody, null, 2)));
      } catch (e) {
        // Ignore if error body itself can't be parsed
      }
      return null;
    }

    const releaseData = await response.json();

    let latestRelease;
    if (releaseType === "latest") {
      latestRelease = releaseData;
    } else {
      // For pre-releases, filter out test releases
      const nonTestReleases = releaseData.filter(
        (release) => !release.tag_name.includes("-test.")
      );

      if (nonTestReleases.length === 0) {
        spinner.fail(chalk.red("No non-test pre-releases found"));
        return null;
      }

      latestRelease = nonTestReleases[0];
    }

    spinner.succeed(
      chalk.green(
        `Successfully fetched latest release: ${chalk.bold(
          latestRelease.tag_name
        )}`
      )
    );
    console.log(chalk.cyan(`Release Name: ${latestRelease.name}`));
    console.log(chalk.cyan(`Published At: ${latestRelease.published_at}`));
    console.log(chalk.cyan(`URL: ${latestRelease.html_url}`));

    return latestRelease;
  } catch (error) {
    spinner.fail(chalk.red("Failed to fetch latest release information."));
    console.error(chalk.red(error.message));
    return null;
  }
}

program.parse(process.argv);
