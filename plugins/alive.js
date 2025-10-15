module.exports = {
    commands: {
        alive: async ({ socket, msg, number, config, socketCreationTime }) => {
            const sender = msg.key.remoteJid;
            try {
                await socket.sendMessage(sender, { react: { text: '🔮', key: msg.key } });
                const startTime = socketCreationTime.get(number) || Date.now();
                const uptime = Math.floor((Date.now() - startTime) / 1000);
                const captionText = `Uptime: ${uptime}s\nPrefix: ${config.PREFIX}`;
                await socket.sendMessage(sender, { text: `I am alive!\n${captionText}` }, { quoted: msg });
            } catch (e) {}
        }
    }
};


