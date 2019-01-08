#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const yargs = require('yargs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const fs = require('fs');

const files = require('./lib/files');
const commands = require('./lib/commands');

clear();
console.log('React Native Template CLI');

const argv = yargs
    .command(commands.copy.name, commands.copy.describe, commands.copy.params)
    .command(commands.rename.name, commands.rename.describe, commands.rename.params)
    .command(commands.archiveAndroid.name, commands.archiveAndroid.describe, commands.archiveAndroid.params)
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

} else if (command === 'archive-android') {
    
    if (!argv.name) {
        console.log('Cannot archive android build without a name.');
        return
    }

    console.log('Replace Version to ',argv.versionNumber, typeof(argv.versionNumber), argv.buildNumber)

    if (argv.versionNumber || argv.buildNumber) {
        
        // ./android/app/build.gradle replace android.defaultConfig.versionCode and versionName (version)
        console.log(files.getCurrentDirectory());
        const buildGradlePath = `${files.getCurrentDirectory()}/android/app/build.gradle`;
        var buildConfig = fs.readFileSync(buildGradlePath, 'utf8');

        console.log(typeof(buildConfig));
        
        if (argv.versionNumber) {
            buildConfig = buildConfig.replace(new RegExp('versionName(.*?)\\n'), `versionName "${argv.versionNumber}"\n`);
        }
        if (argv.buildNumber) {
            console.log('Replace Build to ', argv.buildNumber)
            buildConfig = buildConfig.replace(new RegExp('versionCode (.*?)\\n'), `versionCode ${argv.buildNumber}\n`)
        }

        fs.writeFileSync(buildGradlePath, buildConfig, 'utf8')
        
        console.log('Update versionName and versionCode successfully in app/build.gradle');
    }

    console.log(files.getCurrentDirectory());
    const commands = `cd android && ./gradlew assembleRelease`
    child = spawn(commands, { shell: true });
    child.stderr.on('data', function (data) {
        console.error(data.toString());
    });
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child.on('exit', function (exitCode) {
        if (exitCode === 0) {
            console.log(chalk.green('Android build had been archived successfully!'));
            //Open the folder of the build
            child = exec(`open ${files.getCurrentDirectory()}/android/app/build/outputs/apk`, function(err, stdout, stderr) {
                if (err) {
                    console.log('exe err:', err);
                }
            });
        } else {
            console.log(chalk.red(command + ' exited with code: ') + exitCode);
        }
    });
} else {
    console.log('Unrecognized Command! ');
    console.log('Please run `react-native-template-cli --help` to see the list of available commands.');
}



