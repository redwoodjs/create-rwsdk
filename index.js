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

// Define available templates
const TEMPLATES = {
  standard: "redwoodjs/sdk/starters/standard",
  minimal: "redwoodjs/sdk/starters/minimal",
};

// Set up the CLI program
program
  .name("create-rwsdk")
  .description("A wrapper for creating RedwoodSDK starter projects")
  .version("3.0.0");

// Default command (create a new project)
program
  .command("create", { isDefault: true })
  .description("Create a new RedwoodSDK project")
  .argument("[project-name]", "Name of the project directory to create")
  .option("-f, --force", "Force overwrite if directory exists", false)
  .option(
    "-t, --template <template>",
    "Starter template to use (standard, minimal)",
    "standard"
  )
  .action(createProject);

// List templates command
program
  .command("list")
  .description("List and select available templates")
  .action(listTemplates);

// Function to create a new project
async function createProject(projectName, options) {
  console.log(chalk.bold.red("\n🌲 RedwoodSDK Starter 🌲\n"));

  // Validate template option
  if (!TEMPLATES[options.template]) {
    console.error(
      chalk.red(
        `Error: Invalid template '${
          options.template
        }'. Available templates: ${Object.keys(TEMPLATES).join(", ")}`
      )
    );
    process.exit(1);
  }

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

  // Create the project using tiged
  const templateName = options.template;

  const version = await getLatestSDKRelease();

  // download the tar/zip file from the github release
  const downloadUrl = `https://github.com/redwoodjs/sdk/releases/download/${version.tag_name}/${templateName}-${version.tag_name}.tar.gz`;

  const spinner = ora(
    `Downloading ${chalk.cyan(templateName)} template (${chalk.bold(
      version.tag_name
    )})...`
  ).start();

  const filePath = path.join(
    os.tmpdir(),
    `redwoodjs-sdk-${version.tag_name}-${templateName}.tar.gz`
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
        `Successfully downloaded ${chalk.cyan(
          templateName
        )} template (${chalk.bold(version.tag_name)}) to ${chalk.bold(
          filePath
        )}`
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
        `Successfully created RedwoodSDK starter project (${chalk.cyan(
          templateName
        )} template) in ${chalk.bold(projectName)}`
      )
    );

    // Display next steps
    console.log("\n" + chalk.bold("Next steps:"));
    console.log(`  cd ${projectName}`);
    console.log("  npm install");
    console.log("  npm run dev");
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

// Function to list and select templates
async function listTemplates() {
  console.log(chalk.bold.red("\n🌲 RedwoodSDK Templates 🌲\n"));

  // Prepare template choices for the prompt
  const choices = Object.entries(TEMPLATES).map(([name, repo]) => ({
    title: name.charAt(0).toUpperCase() + name.slice(1),
    description: `Template: ${repo}`,
    value: name,
  }));

  // Prompt user to select a template
  const response = await prompts([
    {
      type: "select",
      name: "template",
      message: "Select a template to use:",
      choices,
      initial: 0,
    },
    {
      type: "text",
      name: "projectName",
      message: "What is the name of your project?",
      validate: (value) => (value.trim() ? true : "Project name is required"),
    },
  ]);

  // Exit if user cancels the prompt
  if (!response.template || !response.projectName) {
    console.log(chalk.yellow("\nTemplate selection cancelled."));
    process.exit(0);
  }

  // Create the project with the selected template
  await createProject(response.projectName, {
    template: response.template,
    force: false,
  });
}

// Function to get the latest RedwoodSDK release from GitHub
async function getLatestSDKRelease() {
  const GITHUB_API_URL =
    "https://api.github.com/repos/redwoodjs/sdk/releases/latest";
  const spinner = ora("Fetching latest release information...").start();

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { "User-Agent": "create-rwsdk" }, // GitHub API requires a User-Agent header
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
    spinner.succeed(
      chalk.green(
        `Successfully fetched latest release: ${chalk.bold(
          releaseData.tag_name
        )}`
      )
    );
    console.log(chalk.cyan(`Release Name: ${releaseData.name}`));
    console.log(chalk.cyan(`Published At: ${releaseData.published_at}`));
    console.log(chalk.cyan(`URL: ${releaseData.html_url}`));

    return releaseData;
  } catch (error) {
    spinner.fail(chalk.red("Failed to fetch latest release information."));
    console.error(chalk.red(error.message));
    return null;
  }
}

program.parse(process.argv);
