module.exports = {
    commands: {
        tagall: async ({ socket, msg }) => {
            const from = msg.key.remoteJid;
            if (!from.endsWith('@g.us')) {
                await socket.sendMessage(from, { text: '❌ Group only.' }, { quoted: msg });
                return;
            }
            try {
                const metadata = await socket.groupMetadata(from);
                const participants = metadata.participants || [];
                const mentions = participants.map(p => p.id);
                const text = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');
                await socket.sendMessage(from, { text, mentions }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to tag members.' }, { quoted: msg });
            }
        }
    }
};


