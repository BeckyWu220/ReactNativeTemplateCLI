#!/usr/bin/env node

const clear = require('clear');
const yargs = require('yargs');

const files = require('./lib/files');
const commands = require('./lib/commands');

clear();
console.log('React Native Template CLI');

const argv = yargs
    .command(commands.copy.name, commands.copy.describe, commands.copy.params)
    .help()
    .argv;

var command = argv._[0];
console.log(`Command: ${command}`);

if (command === 'copy') {
    console.log(`Current Directory: ${files.getCurrentDirectoryName()}`);

    if (!argv.type || !argv.name) {
        files.promptRequiredUserInput(`${__dirname}/templates`, command);
    } else {
        console.log(argv.type, argv.name);

        if (argv.type === 'Component' || argv.type === 'Reducer' || argv.type === 'Screen') {
            const copy = `RN${argv.type}Template`;
            files.copyToCurrentDirectory(`${__dirname}/templates`, argv.name, copy);
        } else {
            console.log('Invalid Template Type.');
            console.log('Available Template Type: `Component`, `Reducer`, `Screen`.');
        }
    }
} else {
    console.log('Unrecognized Command! ');
    console.log('Please run `react-native-template-cli --help` to see the list of available commands.');
}



