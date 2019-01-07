const copyFromTemplate = {
    name: 'copy',
    describe: 'copy from a list of templates.',
    params: {
        type: {
            describe: 'Type of template that you would like to copy.',
            alias: 't',
        },
        name: {
            describe: 'The file name for the copied file.',
            alias: 'n'
        }
    }
};

module.exports = {
    copy: copyFromTemplate
};