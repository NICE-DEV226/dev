const fs = require('fs');
const path = require('path');

function loadPlugins() {
    const pluginsDir = __dirname;
    const plugins = new Map();
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js') && f !== 'index.js');
    for (const file of files) {
        const mod = require(path.join(pluginsDir, file));
        if (!mod || !mod.commands) continue;
        for (const name of Object.keys(mod.commands)) {
            plugins.set(name.toLowerCase(), mod.commands[name]);
        }
    }
    return plugins;
}

module.exports = { loadPlugins };


