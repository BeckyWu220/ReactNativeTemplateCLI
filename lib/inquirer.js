const inquirer = require('inquirer');
const fs = require('fs');

module.exports = {
    askCopyFiles: (filelist) => {
        const questions = [
            {
                name: 'copy',
                type: 'list',
                message: 'What files would you like to copy? ',
                choices: filelist
            }, {
                name: 'name',
                type: 'input',
                message: 'How would you like to name the new file? ',
                validate: function (input) {
                    if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                    else return 'File name may only include letters, numbers, underscores and hashes.';
                }
            }
        ];

        return inquirer.prompt(questions);
    }
}