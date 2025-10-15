const os = require('os');

module.exports = {
    commands: {
        menu: async ({ socket, msg, config, number, socketCreationTime }) => {
            const sender = msg.key.remoteJid;
            const startTime = socketCreationTime.get(number) || Date.now();
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const usedMemory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
            const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

            const menuText = ` 
⋆────────────⋆
│ ʙᴏᴛ : Small-spirity-XMD
│ ᴜsᴇʀ: @${sender.split("@")[0]}
│ ᴘʀᴇғɪx: ${config.PREFIX}
│ ᴍᴇᴍᴏʀʏ : ${usedMemory}MB/${totalMemory}ᴍʙ
│ ᴅᴇᴠ : NICE-DEV
⋆────────────⋆

> ɢᴇɴᴇʀᴀʟ
- ${config.PREFIX}alive
- ${config.PREFIX}ping
- ${config.PREFIX}bot_info
- ${config.PREFIX}bot_stats
- ${config.PREFIX}menu
- ${config.PREFIX}allmenu

> ᴍᴇᴅɪᴀ
- ${config.PREFIX}song
- ${config.PREFIX}tiktok
- ${config.PREFIX}fb
- ${config.PREFIX}ig
- ${config.PREFIX}aiimg
- ${config.PREFIX}viewonce
- ${config.PREFIX}obf_js

> ɢʀᴏᴜᴘ
- ${config.PREFIX}add
- ${config.PREFIX}kick
- ${config.PREFIX}open
- ${config.PREFIX}close
- ${config.PREFIX}promote
- ${config.PREFIX}demote
- ${config.PREFIX}tagall
- ${config.PREFIX}join
`;

            const buttons = [
                {
                    buttonId: `${config.PREFIX}menu_action`,
                    buttonText: { displayText: '📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴ' },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: 'Small-spirity-XMD ᴍᴇɴᴜ',
                            sections: [
                                {
                                    title: '🌐 ɢᴇɴᴇʀᴀʟ',
                                    highlight_label: 'Basics',
                                    rows: [
                                        { title: '🟢 ᴀʟɪᴠᴇ', description: 'ᴠᴇʀɪғɪᴇʀ ʟᴇ sᴛᴀᴛᴜs', id: `${config.PREFIX}alive` },
                                        { title: '📈 sᴛᴀᴛs', description: 'sᴛᴀᴛɪsᴛɪǫᴜᴇs ʙᴏᴛ', id: `${config.PREFIX}bot_stats` },
                                        { title: 'ℹ️ ɪɴғᴏ', description: 'ɪɴғᴏ ʙᴏᴛ', id: `${config.PREFIX}bot_info` },
                                        { title: '📋 ᴀʟʟ ᴍᴇɴᴜ', description: 'ᴛᴏᴜᴛ ʟᴇ ᴍᴇɴᴜ', id: `${config.PREFIX}allmenu` }
                                    ]
                                },
                                {
                                    title: '🎵 ᴍᴇᴅɪᴀ',
                                    rows: [
                                        { title: '🎵 sᴏɴɢ', description: 'ʏᴛ ᴀᴜᴅɪᴏ', id: `${config.PREFIX}song` },
                                        { title: '🎬 ᴛɪᴋᴛᴏᴋ', description: 'ᴛɪᴋᴛᴏᴋ ᴅʟ', id: `${config.PREFIX}tiktok` },
                                        { title: '📘 ғʙ', description: 'ғᴀᴄᴇʙᴏᴏᴋ ᴅʟ', id: `${config.PREFIX}fb` },
                                        { title: '📸 ɪɢ', description: 'ɪɴsᴛᴀɢʀᴀᴍ ᴅʟ', id: `${config.PREFIX}ig` },
                                        { title: '👀 ᴠɪᴇᴡᴏɴᴄᴇ', description: 'ʀᴇᴠᴇᴀʟ ᴏɴᴄᴇ', id: `${config.PREFIX}viewonce` }
                                        { title: '🛡️obf_js', description: 'obfus du code js', id: `${config.PREFIX}obf_js` }
                                    ]
                                },
                                {
                                    title: '🫂 ɢʀᴏᴜᴘ',
                                    rows: [
                                        { title: '➕ ᴀᴅᴅ', description: 'ᴀᴊᴏᴜᴛᴇʀ ᴍᴇᴍʙʀᴇ', id: `${config.PREFIX}add` },
                                        { title: '🦶 ᴋɪᴄᴋ', description: 'ʀᴇᴛɪʀᴇʀ ᴍᴇᴍʙʀᴇ', id: `${config.PREFIX}kick` },
                                        { title: '🔓 ᴏᴘᴇɴ', description: 'ᴏᴜᴠʀɪʀ ɢʀᴏᴜᴘᴇ', id: `${config.PREFIX}open` },
                                        { title: '🔒 ᴄʟᴏsᴇ', description: 'ғᴇʀᴍᴇʀ ɢʀᴏᴜᴘᴇ', id: `${config.PREFIX}close` },
                                        { title: '👑 ᴘʀᴏᴍᴏᴛᴇ', description: 'ᴘᴀssᴇʀ ᴀᴅᴍɪɴ', id: `${config.PREFIX}promote` },
                                        { title: '😢 ᴅᴇᴍᴏᴛᴇ', description: 'ʀᴇᴛɪʀᴇʀ ᴀᴅᴍɪɴ', id: `${config.PREFIX}demote` },
                                        { title: '👥 ᴛᴀɢᴀʟʟ', description: 'ᴍᴇɴᴛɪᴏɴ ᴛᴏᴜs', id: `${config.PREFIX}tagall` },
                                        { title: '👤 ᴊᴏɪɴ', description: 'ʀᴇᴊᴏɪɴᴅʀᴇ ɢʀᴏᴜᴘᴇ', id: `${config.PREFIX}join` }
                                    ]
                                }
                            ]
                        })
                    }
                },
                { buttonId: `${config.PREFIX}bot_info`, buttonText: { displayText: '🔈 ʙᴏᴛ ɪɴғᴏ' }, type: 1 },
                { buttonId: `${config.PREFIX}bot_stats`, buttonText: { displayText: '📊 ʙᴏᴛ sᴛᴀᴛs' }, type: 1 }
            ];

            await socket.sendMessage(sender, {
                image: { url: "https://files.catbox.moe/69ruml.png" },
                caption: `*Small-spirity-XMD*\n${menuText}`,
                buttons,
                headerType: 1,
                viewOnce: true
            }, { quoted: msg });
        }
    }
};


