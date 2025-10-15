const obfCache = new Map(); // sender -> { obf, ts }

module.exports = {
    commands: {
        obf_js: async ({ socket, msg, config }) => {
            const sender = msg.key.remoteJid;
            const rawBody = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const parts = rawBody.trim().split(/\s+/);
            const hasFileFlag = parts.includes('--file');
            const hasCodeFlag = parts.includes('--code');
            const outputAsFile = hasFileFlag && !hasCodeFlag;
            const cleanedBody = parts.filter(p => p !== '--file' && p !== '--code').join(' ');
            const inlineInput = cleanedBody.replace(new RegExp(`^\\${config.PREFIX}?obf_js\\s*`, 'i'), '').trim();

            let quotedText = '';
            const qMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (qMsg) quotedText = qMsg.conversation || qMsg.extendedTextMessage?.text || '';
            const input = inlineInput || quotedText;

            if (!input) {
                const help = `🔒 Obfuscateur JS\n\n` +
                    `Usage:\n` +
                    `- ${config.PREFIX}obf_js [--code|--file] <code JS en ligne>\n` +
                    `- Réponds à un message avec du JS: ${config.PREFIX}obf_js [--code|--file]`;
                await socket.sendMessage(sender, { text: help }, { quoted: msg });
                return;
            }

            try {
                const JavaScriptObfuscator = require('javascript-obfuscator');
                const options = {
                    compact: true,
                    controlFlowFlattening: true,
                    deadCodeInjection: true,
                    stringArray: true,
                    stringArrayThreshold: 0.75,
                    rotateStringArray: true,
                    transformObjectKeys: true
                };
                const result = JavaScriptObfuscator.obfuscate(input, options);
                const obf = result.getObfuscatedCode();
                const chunk = obf.length > 3500 ? obf.slice(0, 3500) + '\n/* ...truncated... */' : obf;
                const header = [
                    '┏━━━━━━━━ JS OBFUSQUÉ ━━━━━━┓',
                    `┃ Longueur: ${obf.length} caractères` + (chunk !== obf ? ' (tronqué)' : '') + ' '.repeat(0) + '┃',
                    '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
                ].join('\n');
                // Cache result for quick button actions (expires in 5 min)
                obfCache.set(sender, { obf, ts: Date.now() });

                if (outputAsFile || obf.length > 3500) {
                    const buffer = Buffer.from(obf, 'utf8');
                    await socket.sendMessage(sender, {
                        document: buffer,
                        fileName: 'obf.js',
                        mimetype: 'application/javascript',
                        caption: header
                    }, { quoted: msg });
                } else {
                    const fenced = '```js\n' + chunk + '\n```';
                    await socket.sendMessage(sender, { text: header + '\n' + fenced }, { quoted: msg });
                }

                // Offer buttons for alternative output
                try {
                    await socket.sendMessage(sender, {
                        text: 'Choisis le format de sortie:',
                        buttons: [
                            { buttonId: `${config.PREFIX}obf_send_code`, buttonText: { displayText: '📄 Message' }, type: 1 },
                            { buttonId: `${config.PREFIX}obf_send_file`, buttonText: { displayText: '📦 Fichier' }, type: 1 }
                        ]
                    }, { quoted: msg });
                } catch {}
            } catch (e) {
                await socket.sendMessage(sender, { text: `❌ Erreur d'obfuscation: ${e?.message || 'unknown'}` }, { quoted: msg });
            }
        },

        obf_send_code: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const item = obfCache.get(sender);
            if (!item || Date.now() - item.ts > 5 * 60 * 1000) {
                await socket.sendMessage(sender, { text: '⏳ Aucune donnée en cache. Relance la commande .obf_js avec ton code.' }, { quoted: msg });
                return;
            }
            const obf = item.obf;
            const chunk = obf.length > 3500 ? obf.slice(0, 3500) + '\n/* ...truncated... */' : obf;
            const header = [
                '┏━━━━━━━━ JS OBFUSQUÉ ━━━━━━┓',
                `┃ Longueur: ${obf.length} caractères` + (chunk !== obf ? ' (tronqué)' : '') + ' '.repeat(0) + '┃',
                '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
            ].join('\n');
            const fenced = '```js\n' + chunk + '\n```';
            await socket.sendMessage(sender, { text: header + '\n' + fenced }, { quoted: msg });
        },

        obf_send_file: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const item = obfCache.get(sender);
            if (!item || Date.now() - item.ts > 5 * 60 * 1000) {
                await socket.sendMessage(sender, { text: '⏳ Aucune donnée en cache. Relance la commande .obf_js avec ton code.' }, { quoted: msg });
                return;
            }
            const obf = item.obf;
            const header = [
                '┏━━━━━━━━ JS OBFUSQUÉ ━━━━━━┓',
                `┃ Longueur: ${obf.length} caractères┃`,
                '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
            ].join('\n');
            const buffer = Buffer.from(obf, 'utf8');
            await socket.sendMessage(sender, {
                document: buffer,
                fileName: 'obf.js',
                mimetype: 'application/javascript',
                caption: header
            }, { quoted: msg });
        }
    }
};
