module.exports = {
    commands: {
        add: async ({ socket, msg, config }) => {
            const sender = msg.key.remoteJid;
            const from = msg.key.remoteJid;
            const isGroup = from.endsWith("@g.us");

            // Minimal admin checks require context from original code; here we just guard basics
            if (!isGroup) {
                await socket.sendMessage(sender, { text: '❌ This command is for groups only.' }, { quoted: msg });
                return;
            }
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const parts = body.trim().split(/\s+/);
            const args = parts.slice(1);
            if (args.length === 0) {
                await socket.sendMessage(sender, { text: `📌 Usage: ${config.PREFIX}add +221xxxxx` }, { quoted: msg });
                return;
            }
            try {
                const numberToAdd = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                await socket.groupParticipantsUpdate(from, [numberToAdd], 'add');
                await socket.sendMessage(sender, { text: `✅ Added ${args[0]} to the group.` }, { quoted: msg });
            } catch (e) {
                await socket.sendMessage(sender, { text: `❌ Failed to add member: ${e?.message || 'unknown error'}` }, { quoted: msg });
            }
        }
    }
};


