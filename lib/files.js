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

const getFilesInDirectory = (filePath) => { 
    return fs.readdirSync(filePath).filter((file) => {
        return file.split('.')[0];
    });
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

const isFile = (filePath) => {
    try {
        return fs.statSync(filePath).isFile() || !fs.statSync(filePath).isDirectory();
    } catch (error) {
        return false;
    }
}

const isDirectory = (filePath) => {
    try {
        return fs.statSync(filePath).isDirectory() || !fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

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
                    contents = replaceContent(contents, search, replacementPattern.replaceAll('{{search}}', path.basename(newPath)));
                }
            });
            const writePath = `${newPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');

        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${newPath}/${file}`);
            createDirectoryContents(`${templatePath}/${file}`, `${newPath}/${file}`);
        }
    });
};

const copyFile = (newFilePath, templateFilePath) => {
    if(!isFile(newFilePath)) {
        fs.copyFile(templateFilePath, newFilePath, (err) => {
            if (err) throw err;
            console.log(`${templateFilePath} was copied to ${newFilePath}`);
        });
    } else {
        console.log(`File '${newFilePath}' already exists in current directory.`)
    }
    return;
};

const copyDir = (newDirPath, templateDirPath) => {
    if (!isDirectory(newDirPath)) {
        fs.mkdirSync(newDirPath);
    } else {
        console.log(`Folder at '${newDirPath}' already exists in current directory.`);
    };

    createDirectoryContents(templateDirPath, newDirPath);
};

const copyToCurrentDirectory = async (templateFolder, name, copy) => {
    let currentDirectory = getCurrentDirectory();

    const templateFilePath = `${templateFolder}/${copy}`

    if(isFile(templateFilePath)) {
        const newFilePath = `${currentDirectory}/${name}${path.extname(copy)}`
        copyFile(newFilePath, templateFilePath);
        return;
    }
    
    if(isDirectory(templateFilePath)) {
        console.log(`Is dir: ${templateFilePath}`)
        const newDirPath = `${currentDirectory}/${name}`;
        copyDir(newDirPath, templateFilePath)
    }
};

const promptRequiredUserInput = async (templateFilePath, command) => {
    const templateFiles = getFilesInDirectory(templateFilePath);
    //getDirectories(templateFilePath);

    switch(command) {
        case 'copy':
            const { name, copy } = await inquirer.askCopyFiles(templateFiles);
            console.log({ name, copy });
            copyToCurrentDirectory(templateFilePath, name, copy)
        default:
            return;
    }
};

module.exports = {
    getCurrentDirectory,  
    getCurrentDirectoryName,
    getFilesInDirectory,
    copyToCurrentDirectory,
    promptRequiredUserInput
}