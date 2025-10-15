const { igdl } = require('ruhend-scraper');

module.exports = {
    commands: {
        ig: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const url = body.trim().split(/\s+/)[1];
            if (!url || !/instagram\.com\//.test(url)) {
                await socket.sendMessage(sender, { text: '📸 Provide an Instagram URL.' }, { quoted: msg });
                return;
            }
            try {
                const result = await igdl(url);
                if (!result || !Array.isArray(result) || result.length === 0) throw new Error('No result');
                const item = result[0];
                const mediaUrl = item?.url || item?.download_url || item?.data?.url;
                if (!mediaUrl) throw new Error('No media url');
                const isVideo = /\.mp4($|\?)/i.test(mediaUrl);
                const payload = isVideo ? { video: { url: mediaUrl }, mimetype: 'video/mp4' } : { image: { url: mediaUrl } };
                await socket.sendMessage(sender, { ...payload, caption: '> ᴍᴀᴅᴇ ɪɴ ʙʏ NICE-DEV' }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(sender, { text: '❌ Failed to fetch Instagram media.' }, { quoted: msg });
            }
        }
    }
};


