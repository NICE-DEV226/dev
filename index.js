const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let code = require('./pair'); 

require('events').EventEmitter.defaultMaxListeners = 500;

// Custom code endpoint with settings support
app.get('/code', async (req, res) => {
    const { number, settings } = req.query;
    if (!number) {
        return res.status(400).json({ error: 'Number is required' });
    }
    
    try {
        // Parse user settings if provided
        let userSettings = {};
        if (settings) {
            try {
                userSettings = JSON.parse(decodeURIComponent(settings));
                console.log('User settings received:', userSettings);
            } catch (e) {
                console.error('Error parsing user settings:', e);
            }
        }
        // Backward compatibility: map AUTO_LIKE_EMOJI -> AUTO_LIKE_STATUS if needed
        if ('AUTO_LIKE_EMOJI' in userSettings && !('AUTO_LIKE_STATUS' in userSettings)) {
            userSettings.AUTO_LIKE_STATUS = !!userSettings.AUTO_LIKE_EMOJI;
            delete userSettings.AUTO_LIKE_EMOJI;
        }
        
        // Apply user settings to config temporarily
        const originalConfig = { ...code.config };
        Object.keys(userSettings).forEach(key => {
            if (code.config.hasOwnProperty(key)) {
                code.config[key] = userSettings[key] ? 'true' : 'false';
            }
        });
        
        const result = await code.EmpirePair(number, res);
        
        // Restore original config
        Object.assign(code.config, originalConfig);
        
        res.json(result);
    } catch (error) {
        console.error('Pairing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
N'oubliez pas de donner une étoile ‼️


Serveur en cours d'exécution sur http://localhost:` + PORT)
});

module.exports = app;
