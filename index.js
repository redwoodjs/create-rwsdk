#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const tiged = require("tiged");
const path = require("path");
const fs = require("fs");
const prompts = require("prompts");

// Define available templates
const TEMPLATES = {
  standard: "redwoodjs/sdk/starters/standard",
  minimal: "redwoodjs/sdk/starters/minimal",
  drizzle: "redwoodjs/example-drizzle",
};

// Set up the CLI program
program
  .name("create-rwsdk")
  .description("A wrapper for creating RedwoodSDK starter projects")
  .version("1.2.0");

// Default command (create a new project)
program
  .command("create", { isDefault: true })
  .description("Create a new RedwoodSDK project")
  .argument("[project-name]", "Name of the project directory to create")
  .option("-f, --force", "Force overwrite if directory exists", false)
  .option(
    "-t, --template <template>",
    "Starter template to use (standard, minimal, drizzle)",
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
  const templateRepo = TEMPLATES[templateName];
  const spinner = ora(
    `Creating RedwoodSDK starter project using ${chalk.cyan(
      templateName
    )} template...`
  ).start();

  try {
    const emitter = tiged(templateRepo, {
      force: options.force,
      verbose: true,
    });

    await emitter.clone(targetDir);

    spinner.succeed(
      chalk.green(
        `Successfully created RedwoodSDK starter project (${chalk.cyan(
          templateName
        )} template) in ${chalk.bold(projectName)}`
      )
    );

    // Display next steps
    console.log("\n" + chalk.bold("Next steps:"));
    console.log(`  cd ${projectName}`);
    console.log("  pnpm install");
    console.log("  pnpm dev");
    console.log("\nHappy coding! 🚀\n");

    // Ensure the process exits properly
    process.exit(0);
  } catch (error) {
    spinner.fail(chalk.red("Failed to create project"));
    console.error(chalk.red(error.message));
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

program.parse(process.argv);
