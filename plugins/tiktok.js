const axios = require('axios');

module.exports = {
    commands: {
        tiktok: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const parts = body.trim().split(/\s+/);
            const url = parts[1];
            if (!url) {
                await socket.sendMessage(sender, { text: '📥 Usage: .tiktok <url>' }, { quoted: msg });
                return;
            }

            const axiosInstance = axios.create({ timeout: 15000, maxRedirects: 5 });
            const apiKey = process.env.TIKTOK_API_KEY || 'free_key@maher_apis';
            try {
                await socket.sendMessage(sender, { text: '⏳ Fetching video...' }, { quoted: msg });
                let data;
                try {
                    const res = await axiosInstance.get(`https://api.nexoracle.com/downloader/tiktok-nowm?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
                    if (res.data?.status === 200) data = res.data.result;
                } catch {}
                if (!data) {
                    const fb = await axiosInstance.get(`https://api.tikwm.com/?url=${encodeURIComponent(url)}&hd=1`);
                    if (fb.data?.data?.play) {
                        data = {
                            url: fb.data.data.play,
                            title: fb.data.data.title,
                            author: { username: fb.data.data.author },
                            thumbnail: fb.data.data.cover
                        };
                    }
                }
                if (!data || !data.url) {
                    await socket.sendMessage(sender, { text: '❌ TikTok video not found.' }, { quoted: msg });
                    return;
                }
                await socket.sendMessage(sender, {
                    video: { url: data.url },
                    caption: `🎥 ${data.title || 'TikTok'}\n> by @${(data.author?.username || 'unknown')}`
                }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(sender, { text: `❌ Failed: ${e?.message || 'unknown error'}` }, { quoted: msg });
            }
        }
    }
};


