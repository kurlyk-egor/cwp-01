const path = require('path');
const fs = require('fs');

const DIR = process.argv[2];
const TXT = '.txt';

let copyright;
let summary =
    'const fs = require(\'fs\');\n' +
    'const path = require(\'path\');\n' +
    '\n' +
    '(function getFiles(baseDir) {\n' +
    '    fs.readdir(baseDir, function (err, files){\n' +
    '        for (let i in files) {\n' +
    '            let currentDir = baseDir + path.sep + files[i];\n' +
    '            fs.stat(currentDir, (err, stats) => {\n' +
    '                    if (stats.isDirectory()) {\n' +
    '                        getFiles(currentDir);\n' +
    '                    } else {\n' +
    '                        console.log(path.relative(__dirname, currentDir));\n' +
    '                    }\n' +
    '                }\n' +
    '            );\n' +
    '        }\n' +
    '    });\n' +
    '})(__dirname);';


(() => {
    fs.access(DIR, (err) => {
            if (err) {
                console.log(err);
                console.log("path error");
            }
            else {

                let txtDir = createTxtDir();
                createSummary();
                setCopyright();
                createCopies(DIR, txtDir);
                whatchDir(DIR);
            }
        }
    )
})();

function setCopyright() {
    fs.readFile("config.json", (err, data) => {
        if (err) {
            console.error("failed set copyright");
            copyright = 'undefined';
        }
        else {
            copyright = JSON.parse(data);
        }
    });
}

function createTxtDir() {
    let dirPath = DIR + "\\" + path.basename(DIR);
    fs.mkdir(dirPath, (err) => {
        if (err) {
            console.log("Make dir error");
            throw err;
        }
    });
    return dirPath;
}

function createSummary() {

    fs.appendFile(DIR + "\\" + "summary.js", summary, (err) => {
        if (err) {
            console.log(err);
            console.log('Failed to create summary.js');
        }
    });
}

function createCopies(dir, targetDir) {
    fs.readdir(dir, function (err, files) {
        if (err)
            console.log(err);
        else {
            for (let file in files) {

                let currentDir = dir + "\\" + files[file];

                if (fs.statSync(currentDir).isDirectory()) {
                    createCopies(currentDir, targetDir);
                } else {
                    if (path.extname(currentDir) === TXT) {
                        fs.readFile(currentDir, 'utf8', (err, data) => {
                            if (err) {
                                console.log("Can't read file:" + currentDir);
                            }
                            else {
                                writeDataToTxt(targetDir + path.sep + files[file], data);
                            }
                        });
                    }
                }
            }
        }
    });
}

function writeDataToTxt(filePath, data) {

    let appendText = copyright["copyright"] + data + copyright["copyright"];
    fs.appendFile(filePath, appendText, 'utf8', (err) => {
        if (err) {
            console.log(err);
            console.log("Failed writing file");
        }
    });
}

function whatchDir(dirForTxt) {
    fs.watch(dirForTxt, (eventType, filename) => {
        console.log("event " + eventType.toString() + " " + filename.toString());
    });
}