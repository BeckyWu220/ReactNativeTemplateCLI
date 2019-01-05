#!/usr/bin/env node

const fs = require('fs');
const clear = require('clear');

const files = require('./lib/files');

clear();

console.log('React Native Template CLI');

console.log(`Current Directory: ${files.getCurrentDirectoryName()}`);

files.copyFilesToCurrentDirectory(`${__dirname}/templates`);

