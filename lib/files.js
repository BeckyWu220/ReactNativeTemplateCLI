const fs = require('fs');
const path = require('path');

const inquirer = require('./inquirer');

const getCurrentDirectory = () => {
    return process.cwd();
};

const getCurrentDirectoryName = () => {
    // Get the current directory and return it.
    // console.log(`__dirname: ${__dirname}`);
    return path.basename(process.cwd());
};

const directoryExists = (filePath) => {
    try {
        return fs.statSync(filePath).isDirectory();
    } catch (error) {
        return false;
    }
};

const getFilesInDirectory = (filePath) => { 
    return fs.readdirSync(filePath);
};

const getDirectories = (filePath) => {
    var files =  fs.readdirSync(filePath);
    var dirs = files.filter(file => fs.statSync(`${filePath}/${file}`).isDirectory());
    return dirs;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const replaceContent = (content, search, replacement) => {
    if (!content.includes(search)) {
        return content
    }
    var newContent = content.replaceAll(search, replacement);
    console.log(`Replace '${search}' with ${replacement}`);
    return newContent;
}

const Replacements = [
    {
        search: 'ComponentName',
        replacementPattern: '{{search}}'
    },
    {
        search: 'ScreenComponent',
        replacementPattern: '{{search}}Component'
    },
    {
        search: 'ScreenContainer',
        replacementPattern: '{{search}}Container'
    }
];

const createDirectoryContents = (templatePath, newPath) => {
    const filesToCreate = fs.readdirSync(templatePath);
    
    filesToCreate.forEach((file) => {
        const filePath = `${templatePath}/${file}`;

        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            var contents = fs.readFileSync(filePath, 'utf8');

            Replacements.forEach((replacement) => {
                const { search, replacementPattern } = replacement;
                if (search && replacementPattern) {
                    contents = replaceContent(contents, search, replacementPattern.replaceAll('{{search}}', newPath));
                }
            });

            const writePath = `${getCurrentDirectory()}/${newPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');

        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${getCurrentDirectory()}/${newPath}/${file}`);
            createDirectoryContents(`${templatePath}/${file}`, `${newPath}/${file}`);
        }
    });
};

const copyFilesToCurrentDirectory = async (templateFilePath, name, copy) => {
    

    //const { name, copy } = await inquirer.askCopyFiles(templateFiles);

    let currentDirectory = getCurrentDirectory();
    
    const newFilePath = `${currentDirectory}/${name}`;
    console.log(`Path to place the copy of ${copy}: ${newFilePath}`);

    
    if (!directoryExists(newFilePath)) {
        fs.mkdirSync(`${currentDirectory}/${name}`);
    } else {
        console.log(`File named '${name}' already exists in current directory.`);
    };

    const templatePath = `${templateFilePath}/${copy}`;

    createDirectoryContents(templatePath, name);
};

const promptRequiredFilesInfo = async (templateFilePath, command) => {
    const templateFiles = getDirectories(templateFilePath);
    
    switch(command) {
        case 'copy':
            const { name, copy } = await inquirer.askCopyFiles(templateFiles);
            copyFilesToCurrentDirectory(templateFilePath, name, copy)
        default:
            return;
    }
};

module.exports = {
    getCurrentDirectory,  
    getCurrentDirectoryName,
    directoryExists,
    getFilesInDirectory,
    copyFilesToCurrentDirectory,
    promptRequiredFilesInfo
}