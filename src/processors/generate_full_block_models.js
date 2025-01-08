const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname, '../output');
const chunked = require(path.join(__dirname, '../data/generated/block_list_curated.json'));
const blockModels = require(path.join(__dirname, '../data/minecraft_assets/models/block/_all.json'));

let log = {
    yay: {},
    nay: {},
    count: {}
}
const exceptions = { // Exceptions for blocks that don't follow the normal naming convention
    "bee_nest": "bee_nest_empty",
    "beehive": "beehive_empty",
    "block_of_lapis_lazuli": "lapis_block",
    "hay_bale": "hay_block",
    "jack_o'lantern": "jack_o_lantern",
    "jigsaw_block": "jigsaw",
    "monster_spawner": "spawner",
    "smooth_quartz_block": "smooth_quartz",
    "suspicious_gravel": "suspicious_gravel_3",
    "suspicious_sand": "suspicious_sand_3",
    "waxed_block_of_copper": "copper_block"
  };

const transformations = [
    {
        pattern: 'block_of_',
        transform: name => name.concat('_block')
    },
    {
        pattern: 'waxed_',
        transform: name => name
    },
    {
        pattern: 'infested_',
        transform: name => name
    },
    {
        pattern: '_lazuli',
        transform: name => name
    }
];

function tryMatchModel(item, originalItem, blockModels, log) {
    if (blockModels[item] !== undefined) {
        log.yay[originalItem] = { textures: { ...blockModels[item].textures } };
        return true;
    }
    return false;
}

chunked.Blocks.forEach(function(item) {
    if (exceptions[item]) { //do the exceptions first
        const overrideMatch = exceptions[item];
        if (tryMatchModel(overrideMatch, item, blockModels, log)) {
            return;
        }
    }
    if (tryMatchModel(item, item, blockModels, log)) { // Try direct matches
        return;
    }
    for (const { pattern, transform } of transformations) { // Try each transformation
        if (item.includes(pattern)) {
            const itemFix = transform(item.replace(new RegExp(pattern), ''));
            if (tryMatchModel(itemFix, item, blockModels, log)) {
                return;
            }
        }
    }
    log.nay[item] = item; // Check log for unmatched items
});

function propCleaner(log) { 
    Object.entries(log.yay).forEach(([key, item]) => {
        delete item.textures.particle;

        Object.entries(item.textures).forEach(([textureKey, textureValue]) => { // cleaning textures path for QOL
            item.textures[textureKey] = textureValue.replace(/.*block\//, "");
        });

        const uniqueTextures = new Set(Object.values(item.textures));
        if (uniqueTextures.size === 1) { // Simplify textures if they are the same
            item.textures = { all: [...uniqueTextures][0] };
        }
        ["end", "up", "platform"].forEach(key => { // changednames to top for QOL
            if (item.textures[key]) {
                item.textures["top"] = item.textures[key];  // Assign the value to "top"
                delete item.textures[key];  // Delete the original property
            }
        });
        Object.keys(item.textures).forEach(textureKey => { // Count the texture keys for the log
            log.count[textureKey] = (log.count[textureKey] || 0) + 1;
        });
    });
}

propCleaner(log);
fs.writeFileSync(path.join(outputFolder, 'log.json'), JSON.stringify(log, null, 2));
console.log('Created log.json');
fs.writeFileSync(path.join(outputFolder, 'curated_block_models.json'), JSON.stringify(log.yay, null, 2));
console.log('curated_block_models.json');