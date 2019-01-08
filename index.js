#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const yargs = require('yargs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
// const rename = require('react-native-rename');

const files = require('./lib/files');
const commands = require('./lib/commands');

clear();
console.log('React Native Template CLI');

const argv = yargs
    .command(commands.copy.name, commands.copy.describe, commands.copy.params)
    .command(commands.rename.name, commands.rename.describe, commands.rename.params)
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
} else if (command === 'rename-project') {
    // child = exec("cd templates", function(err, stdout, stderr) {
    //     console.log('stdout:', stdout);
    //     console.log('stderr:', stderr);
    //     if (err) {
    //         console.log('exe err:', err);
    //     }
    // });
    if (!argv.name) {
        console.log('Cannot rename the project without a name.');
        return
    }
    const commands = `npm install react-native-rename -g && react-native-rename "${argv.name}" && cd ios && pod install`
    child = spawn(commands, { shell: true });
    child.stderr.on('data', function (data) {
        console.error(data.toString());
    });
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child.on('exit', function (exitCode) {
        if (exitCode === 0) {
            console.log(chalk.green('Project had been successfully renamed to' + argv.name + '!'));
            console.log(chalk.green("Please make sure to run 'watchman watch-del-all' and 'npm start --reset-cache' before running the app. "));
        } else {
            console.log(chalk.red(command + ' exited with code: ') + exitCode);
        }
    });

} else {
    console.log('Unrecognized Command! ');
    console.log('Please run `react-native-template-cli --help` to see the list of available commands.');
}



