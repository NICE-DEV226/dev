module.exports = {
    commands: {
        bot_info: async ({ socket, msg, config }) => {
            const from = msg.key.remoteJid;
            const captionText = `\n⋆────────────⋆\n│ ɴᴀᴍᴇ: Small-spirity-XMD\n│ ᴄʀᴇᴀᴛᴏʀ: NICE-DEV\n│ ᴠᴇʀsɪᴏɴ: ${config.version}\n│ ᴘʀᴇғɪx: ${config.PREFIX}\n│ ᴅᴇsᴄ: ᴠᴏᴛʀᴇ ᴄᴏᴍᴘᴀɢɴᴏɴ ᴡʜᴀᴛsᴀᴘᴘ ᴇᴘɪᴄᴇ\n⋆────────────⋆`;
            await socket.sendMessage(from, {
                image: { url: "https://files.catbox.moe/69ruml.png" },
                caption: captionText
            }, { quoted: msg });
        }
    }
};


