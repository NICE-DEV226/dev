const os = require('os');

module.exports = {
    commands: {
        bot_stats: async ({ socket, msg, number, config, socketCreationTime, activeSockets }) => {
            const from = msg.key.remoteJid;
            const startTime = socketCreationTime.get(number) || Date.now();
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
            const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
            const activeCount = activeSockets ? activeSockets.size : 1;

            const captionText = `\n⋆────────────⋆\n│ ᴜᴘᴛɪᴍᴇ: ${hours}ʜ ${minutes}ᴍ ${seconds}s\n│ ᴍᴇᴍᴏʀʏ: ${usedMemory}ᴍʙ / ${totalMemory}ᴍʙ\n│ ᴀᴄᴛɪᴠᴇ ᴜsᴇʀs: ${activeCount}\n│ ʏᴏᴜʀ ɴᴜᴍʙᴇʀ: ${number}\n│ ᴠᴇʀsɪᴏɴ: ${config.version}\n⋆────────────⋆`;

            await socket.sendMessage(from, {
                image: { url: "https://files.catbox.moe/69ruml.png" },
                caption: captionText
            }, { quoted: msg });
        }
    }
};


