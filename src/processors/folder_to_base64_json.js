const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname,'../output');
const blockFolder = path.join(__dirname,'../data/minecraft_assets/textures/block');
const itemFolder = path.join(__dirname,'../data/minecraft_assets/textures/item');
const paintingsFolder = path.join(__dirname,'../data/minecraft_assets/textures/painting');
const effectsFolder = path.join(__dirname,'../data/minecraft_assets/textures/mob_effect');


function pngToBase64(folderPath) {
    const result = {};
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        if (path.extname(file) === '.png') {
            const fileName = path.parse(file).name;
            const filePath = path.join(folderPath, file);
            const base64 = fs.readFileSync(filePath).toString('base64');
            result[fileName] = {
                base64: base64
            };
        }
    });
    return result;
}

function createJson(inputFolder, outputName) {
    const result = pngToBase64(inputFolder);

    fs.writeFileSync(path.join(outputFolder, `${outputName}.json`), JSON.stringify(result, null, 2));
    console.log(`Created ${outputName}.json`);
}

createJson(blockFolder, 'block_textures');
createJson(itemFolder, 'item_textures');
createJson(paintingsFolder, 'painting_textures');
createJson(effectsFolder, 'effect_textures');