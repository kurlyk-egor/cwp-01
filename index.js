const fs = require('fs');
const path = require('path');

function getFiles(dir) { 
    fs.readdir(dir, function (err, files) { 
        for (let i in files) { 
            let currentDir = dir + path.sep + files[i]; 

            fs.stat(currentDir, (err, stats) => { 
                if (stats.isDirectory()) { 
                    getFiles(currentDir); 
                    return;
                }
                console.log(path.relative(__dirname, currentDir)); 
            }); 
        }
    });
};

getFiles(__dirname);