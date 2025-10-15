module.exports = {
    commands: {
        kick: async ({ socket, msg, config }) => {
            const sender = msg.key.remoteJid;
            const from = msg.key.remoteJid;
            const isGroup = from.endsWith("@g.us");
            if (!isGroup) {
                await socket.sendMessage(sender, { text: '❌ This command is for groups only.' }, { quoted: msg });
                return;
            }
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const parts = body.trim().split(/\s+/);
            const args = parts.slice(1);
            if (args.length === 0) {
                await socket.sendMessage(sender, { text: `📌 Usage: ${config.PREFIX}kick +221xxxxx` }, { quoted: msg });
                return;
            }
            try {
                const numberToKick = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                await socket.groupParticipantsUpdate(from, [numberToKick], 'remove');
                await socket.sendMessage(sender, { text: `✅ Removed ${args[0]} from the group.` }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(sender, { text: `❌ Failed to remove member: ${e?.message || 'unknown error'}` }, { quoted: msg });
            }
        }
    }
};


