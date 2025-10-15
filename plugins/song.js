const yts = require('yt-search');
const ddownr = require('denethdev-ytmp3');
const fs = require('fs').promises;
const { existsSync, mkdirSync } = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const TEMP_DIR = './temp';
const MAX_FILE_SIZE_MB = 4;
const TARGET_SIZE_MB = 3.8;

if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
}

async function compressAudio(inputPath, outputPath, targetSizeMB = TARGET_SIZE_MB) {
    try {
        const { stdout: durationOutput } = await execPromise(
            `ffprobe -i "${inputPath}" -show_entries format=duration -v quiet -of csv="p=0"`
        );
        const duration = parseFloat(durationOutput) || 180;
        const targetBitrate = Math.floor((targetSizeMB * 8192) / duration);
        const constrainedBitrate = Math.min(Math.max(targetBitrate, 32), 128);
        await execPromise(`ffmpeg -i "${inputPath}" -b:a ${constrainedBitrate}k -vn -y "${outputPath}"`);
        return true;
    } catch { return false; }
}

async function cleanupFiles(...filePaths) {
    for (const filePath of filePaths) {
        if (filePath) {
            try { await fs.unlink(filePath); } catch {}
        }
    }
}

module.exports = {
    commands: {
        song: async ({ socket, msg }) => {
            const sender = msg.key.remoteJid;
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const query = body.replace(/^\.song\s*/i, '').trim();
            if (!query) {
                await socket.sendMessage(sender, { text: '*Give me a title or YouTube link*' }, { quoted: msg });
                return;
            }
            try {
                const search = await yts(query);
                const videoInfo = search.videos && search.videos.length > 0 ? search.videos[0] : null;
                if (!videoInfo) {
                    await socket.sendMessage(sender, { text: '*No songs found*' }, { quoted: msg });
                    return;
                }
                const download = await ddownr.ytmp3(videoInfo.url);
                if (!download?.result?.download) throw new Error('No download link');

                const tempFilePath = path.join(TEMP_DIR, `song_${Date.now()}.mp3`);
                const compressedFilePath = path.join(TEMP_DIR, `song_${Date.now()}_c.mp3`);

                const res = await fetch(download.result.download);
                const arrayBuffer = await res.arrayBuffer();
                await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

                const stats = await fs.stat(tempFilePath);
                let finalPath = tempFilePath;
                if (stats.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    const ok = await compressAudio(tempFilePath, compressedFilePath);
                    finalPath = ok ? compressedFilePath : tempFilePath;
                }

                await socket.sendMessage(sender, {
                    audio: { url: finalPath },
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, { quoted: msg });

                await cleanupFiles(tempFilePath, compressedFilePath);
            } catch (e) {
                await socket.sendMessage(sender, { text: `❌ Failed to download: ${e?.message || 'unknown'}` }, { quoted: msg });
            }
        },
        play: async (ctx) => module.exports.commands.song(ctx)
    }
};


