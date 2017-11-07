const fs = require('fs');
const path = require('path');

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
            console.log(err);
            console.log('Не удалось создать скрипт summary.js');
        }
    });
}

createSummaryScript();