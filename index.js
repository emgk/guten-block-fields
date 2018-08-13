#! /usr/bin/env node
'use strict';

const chalk = require('chalk');
const program = require('commander');
const _package = require('./package.json');

// Get the function to create controllers.
const createControllers = require('./core/init');

let { c, blockname } = '';

// Set the command.
program
    .option('<make>', 'generate fields')
    .version('1.0.0')
    .action((cmd) => {
        c = cmd;
    });

// Parse the arguments.
program.parse(process.argv);

// if no command were provided.
if (typeof c === "undefined") {
    console.log(chalk.red(`No command were provided, please run '${_package.name} --help' command`));
    process.exit(1);
}

// run the script.
switch (c) {
    case 'make':
        // Generate file.
        createControllers.generateBlocks();
        break;

    // Default msg.
    default:
        console.log(chalk.red(`Invalid command, please run '${_package.name} --help' command`));
}