module.exports = {
    commands: {
        close: async ({ socket, msg }) => {
            const from = msg.key.remoteJid;
            if (!from.endsWith('@g.us')) {
                await socket.sendMessage(from, { text: '❌ Group only.' }, { quoted: msg });
                return;
            }
            try {
                await socket.groupSettingUpdate(from, 'announcement');
                await socket.sendMessage(from, { text: '🔒 Group closed.' }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to close group.' }, { quoted: msg });
            }
        }
    }
};


