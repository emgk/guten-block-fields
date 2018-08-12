#! /usr/bin/env node

const chalk = require('chalk');

// Get the arguments.
const [, , ...args] = process.argv

console.log(chalk.green(`Welcome to Gutenberg Inspect Controller! ${args}`))