module.exports = {
    commands: {
        open: async ({ socket, msg }) => {
            const from = msg.key.remoteJid;
            if (!from.endsWith('@g.us')) {
                await socket.sendMessage(from, { text: '❌ Group only.' }, { quoted: msg });
                return;
            }
            try {
                await socket.groupSettingUpdate(from, 'not_announcement');
                await socket.sendMessage(from, { text: '✅ Group opened.' }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to open group.' }, { quoted: msg });
            }
        }
    }
};


