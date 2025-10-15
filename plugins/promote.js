module.exports = {
    commands: {
        promote: async ({ socket, msg }) => {
            const from = msg.key.remoteJid;
            if (!from.endsWith('@g.us')) {
                await socket.sendMessage(from, { text: '❌ Group only.' }, { quoted: msg });
                return;
            }
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const target = body.trim().split(/\s+/)[1];
            if (!target) {
                await socket.sendMessage(from, { text: '📌 Usage: .promote +221xxxxx' }, { quoted: msg });
                return;
            }
            try {
                const jid = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                await socket.groupParticipantsUpdate(from, [jid], 'promote');
                await socket.sendMessage(from, { text: `👑 Promoted ${target}.` }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to promote.' }, { quoted: msg });
            }
        }
    }
};


