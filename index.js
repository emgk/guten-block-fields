#! /usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const package = require('./package.json');

// Set the command.
program
    .version('1.0.0')
    .arguments('<cmd> [block]')
    .action((cmd, block) => {
        command = cmd;
        blockname = block;
    });

// Parse the arguments.
program.parse(process.argv);

// if no command were provided.
if (typeof command === "undefined") {
    console.log(chalk.red(`No command were provided, please run '${package.name} --help' command`));
    process.exit(1);
}

// run the script.
switch (command) {
    case 'generate':
        console.log(chalk.green('We\'re all set to generate!'));
        break;

    // Default msg.
    default:
        console.log(chalk.red(`Invalid command, please run '${package.name} --help' command`));
}