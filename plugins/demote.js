module.exports = {
    commands: {
        demote: async ({ socket, msg }) => {
            const from = msg.key.remoteJid;
            if (!from.endsWith('@g.us')) {
                await socket.sendMessage(from, { text: '❌ Group only.' }, { quoted: msg });
                return;
            }
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const target = body.trim().split(/\s+/)[1];
            if (!target) {
                await socket.sendMessage(from, { text: '📌 Usage: .demote +221xxxxx' }, { quoted: msg });
                return;
            }
            try {
                const jid = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                await socket.groupParticipantsUpdate(from, [jid], 'demote');
                await socket.sendMessage(from, { text: `⬇ Demoted ${target}.` }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to demote.' }, { quoted: msg });
            }
        }
    }
};


