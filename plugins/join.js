module.exports = {
    commands: {
        join: async ({ socket, msg, config }) => {
            const from = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const invite = body.trim().split(/\s+/)[1] || config.GROUP_INVITE_LINK || '';
            const match = invite.match(/chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]+)/);
            if (!match) {
                await socket.sendMessage(from, { text: '📌 Usage: .join <group invite link>' }, { quoted: msg });
                return;
            }
            try {
                await socket.groupAcceptInvite(match[1]);
                await socket.sendMessage(from, { text: '✅ Joined group.' }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(from, { text: '❌ Failed to join group.' }, { quoted: msg });
            }
        }
    }
};


