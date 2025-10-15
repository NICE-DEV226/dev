const axios = require('axios');

module.exports = {
    commands: {
        fb: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const url = body.trim().split(/\s+/)[1];
            if (!url || !/facebook\.com|fb\.watch/.test(url)) {
                await socket.sendMessage(sender, { text: '🧩 Give me a valid Facebook link.' }, { quoted: msg });
                return;
            }
            try {
                const res = await axios.get(`https://suhas-bro-api.vercel.app/download/fbdown?url=${encodeURIComponent(url)}`);
                const result = res.data.result;
                await socket.sendMessage(sender, {
                    video: { url: result.sd },
                    mimetype: 'video/mp4',
                    caption: '> ᴍᴀᴅᴇ ɪɴ ʙʏ NICE-DEV'
                }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(sender, { text: '❌ Download failed. Try again later.' }, { quoted: msg });
            }
        }
    }
};


