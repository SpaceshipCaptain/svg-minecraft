const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname,'../output');
const iTextures = require(path.join(__dirname, '../data/generated/item_textures.json'));

function svgTemplate(texture){
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="300" width="300">
<image id="i" width="16" height="16" href="data:image/png;base64,${texture}" style="image-rendering:pixelated"/>
</svg>`;
    return svg;
}

function allItems(iTextures, outputFolder) {
    Object.entries(iTextures).forEach(([key, item]) => {
        fs.writeFileSync(path.join(outputFolder, key + '.svg'), svgTemplate(item.base64));
    });
}
allItems(iTextures, outputFolder);

//fs.writeFileSync(path.join(outputFolder, 'log.json'), svgTemplate(iTextures.acacia_boat.base64));
//console.log('Created log.json');
