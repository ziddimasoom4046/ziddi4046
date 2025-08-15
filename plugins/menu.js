const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const replyCache = new Map();

cmd({
  pattern: "menu",
  react: "🛸",
  alias: ["panel", "commands"],
  desc: "Displays the bot menu",
  category: "main"
},
async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const categoryMap = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!categoryMap[cmd.category]) categoryMap[cmd.category] = [];
      categoryMap[cmd.category].push(cmd.pattern || '');
    }

    const categories = Object.keys(categoryMap);
    const emojiList = ['📿', '👤', '🌐', '👥', '📝', '⚡', '🔄', '🤖', '🌆', '🎯'];
    let numberedList = categories.map((cat, i) => `${emojiList[i] || '🔹'} ┇ *${i + 1}. ${cat.toUpperCase()}*`).join("\n");

    let desc = `╭━━⊷ *𓆩 ${config.BOT_NAME} MENU 𓆪* ⊷━━╮
┃ 🧑‍💻 ʜᴇʟʟᴏ, *${pushname}*!
┃
┃ ⏱ ᴜᴘᴛɪᴍᴇ: *${runtime(process.uptime())}*
┃ ⚙️ ᴘʟᴀᴛꜰᴏʀᴍ: *${process.env.DYNO ? "Heroku" : "Localhost"}*
┃ 🤖 ᴍᴏᴅᴇ: *${config.MODE}*
┃ 🧩 ᴘʀᴇꜰɪx: *${config.PREFIX}*
┃ 📚 ᴘʟᴜɢɪɴꜱ: *${commands.length}*
╰━━━━━━━━━━━━━━━━━━╯

╭─⟪ *💫 ᴍᴇɴᴜ ᴄᴀᴛᴇɢᴏʀɪᴇꜱ 💫* ⟫
${numberedList}
╰━━━━━━━━━━━━━━━━━━╯

╰➤ ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ꜱᴇᴇ ᴄᴏᴍᴍᴀɴᴅꜱ.
🔗 ɪɴꜱᴛᴀ: *https://instagram.com/um4rxd*
🔈 ᴏᴘᴇɴɪɴɢ ᴠᴏɪᴄᴇ: ꜱᴇɴᴛ ʙᴇʟᴏᴡ.
✉️ ᴄᴏɴᴛᴀᴄᴛ: *@Ziddi Masoom*
${config.CAPTION || ''}`;

    // Save menu context
    const sent = await conn.sendMessage(from, {
      image: { url: config.ALIVE_IMG },
      caption: desc,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: '𓆩 Umar Private Bot 𓆪',
          body: 'Click to follow on Instagram!',
          mediaType: 1,
          sourceUrl: 'https://instagram.com/um4rxd',
          thumbnailUrl: 'https://qu.ax/HlOGU.jpg',
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: mek });

    await new Promise(resolve => setTimeout(resolve, 500));

    await conn.sendMessage(from, {
      audio: {
        url: 'https://raw.githubusercontent.com/Um4r719/UD-MD-DATABASE/main/UMAR_VOICE/UMAR-MD-MEDIA/menu.mp3'
      },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });

    // Store reply context in memory
    replyCache.set(from, {
      messageId: sent.key.id,
      categories,
      categoryMap
    });

    // Auto clear after 1 minute
    setTimeout(() => replyCache.delete(from), 60000);

  } catch (e) {
    console.error(e);
    reply("🚫 *Error generating the menu.* Please try again.");
  }
});

// Export the replyCache for use in index.js
module.exports.replyCache = replyCache;
