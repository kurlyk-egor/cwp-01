const fs = require('fs');
const path = require('path');
const txt = 'txt';
let copyright;

let summary = 
'const fs = require(\'fs\');\n'+
'const path = require(\'path\');\n'+
'function getFiles(dir) { \n'+
'    fs.readdir(dir, function (err, files) {\n'+
'        for (let i in files) { \n'+
'            let currentDir = dir + path.sep + files[i];\n '+
 '           fs.stat(currentDir, (err, stats) => { \n'+
 '               if (stats.isDirectory()) { \n'+
 '                   getFiles(currentDir);\n '+
 '                   return;\n'+
 '               }\n'+
 '               console.log(path.relative(__dirname, currentDir));\n '+
 '           });\n '+
 '       }\n'+
 '   });\n'+
'};\n'+
'getFiles(__dirname);\n';

function createSummaryScript() {
    fs.appendFile(process.argv[2] + '\\summary.js', summary, (err) => {
        if (err) {
            console.log('summary.js not created');
        }
    });
}

function setCopyright() {
    fs.readFile("config.json", (err, data) => {
        if (err) {
            console.error("Not finded copyright file");
            return;
        }
        copyright = JSON.parse(data);
        console.log(copyright);
    });
}

function createNewDir() {
    let mypath = process.argv[2] + '\\' + path.basename(process.argv[2]);
    fs.mkdir(mypath, (err) => {
        if (err && err.code != 'EEXIST') {
            console.log("error while creating dir");
            throw err;
        }
    });
    return mypath;
}

//createSummaryScript();

(() => {
    setCopyright();
    createNewDir();
})();