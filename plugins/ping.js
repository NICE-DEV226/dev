module.exports = {
    commands: {
        ping: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const t0 = Date.now();
            await socket.sendMessage(sender, { text: 'Pinging...' }, { quoted: msg });
            const ms = Date.now() - t0;
            await socket.sendMessage(sender, { text: `Pong ${ms}ms` }, { quoted: msg });
        }
    }
};


