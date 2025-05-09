#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const degit = require('degit');
const path = require('path');
const fs = require('fs');

// Set up the CLI program
program
  .name('create-rwsdk')
  .description('A wrapper for creating RedwoodSDK starter projects')
  .version('1.0.0')
  .argument('<project-name>', 'Name of the project directory to create')
  .option('-f, --force', 'Force overwrite if directory exists', false)
  .action(async (projectName, options) => {
    console.log(chalk.bold.red('\n🌲 RedwoodSDK Starter 🌲\n'));

    // Validate project name
    if (!projectName) {
      console.error(chalk.red('Error: Project name is required'));
      process.exit(1);
    }

    const targetDir = path.resolve(process.cwd(), projectName);

    // Check if directory exists and handle accordingly
    if (fs.existsSync(targetDir)) {
      if (!options.force) {
        console.error(chalk.red(`Error: Directory ${projectName} already exists. Use --force to overwrite.`));
        process.exit(1);
      }
      console.log(chalk.yellow(`Warning: Overwriting existing directory ${projectName}`));
    }

    // Create the project using degit
    const spinner = ora('Creating RedwoodSDK starter project...').start();

    try {
      const emitter = degit('redwoodjs/sdk/starters/standard', {
        force: options.force,
        verbose: true
      });

      await emitter.clone(targetDir);

      spinner.succeed(chalk.green(`Successfully created RedwoodSDK starter project in ${chalk.bold(projectName)}`));

      // Display next steps
      console.log('\n' + chalk.bold('Next steps:'));
      console.log(`  cd ${projectName}`);
      console.log('  pnpm install');
      console.log('  pnpm dev');
      console.log('\nHappy coding! 🚀\n');

    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse(process.argv);
