#!/usr/bin/env node

(function () {
    const fs = require('fs');
    const sharp = require('sharp');
    const compressionQuality = 70;
    const outputDir = './images';
    async function readFiles(dirname) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirname, function(err, files) {
                if (err) {
                    return reject(err)
                }
                return resolve(files)
            });
        });
    }

    function onProcess(filename) {
        const onlyName = filename.split('.')[0];
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }
        return sharp(process.argv[2] + '/' + filename)
            .jpeg({ progressive: true, force: false, quality: compressionQuality })
            .toFile(`${outputDir}/${onlyName}_compressed.JPG`, function (err, info) {
                if (err) {
                    console.error('err', err)
                    return;
                }
                console.log('info', info)
            });
    }

    if (!process.argv[2]) {
        console.error('You need to pass the path of the image directory to compress')
        return;
    }

    readFiles(process.argv[2]).then((filenames) => {
        console.log('filesname')
        return Promise.all(filenames.map(n => onProcess(n)))
    }).then((res) => {
        console.log('Finish')
    }).catch(err => {
        console.error(err)
    });
}())    
