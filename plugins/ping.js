const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "ping",
    alias: ["🚀", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        // Emojis for spice
        const reactionEmojis = ['⚡', '🚀', '🔥', '💨', '✨'];
        const chosenReact = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        // Send reaction emoji
        await conn.sendMessage(from, {
            react: { text: chosenReact, key: mek.key }
        });

        const end = Date.now();
        const responseTime = end - start;

        const uptime = runtime(process.uptime());
        const finalMsg = `*👋 Hello @${sender.split('@')[0]}!*
        
*🤖 Bot is Online!*
*📡 Ping:* \`${responseTime} ms\`
*⏱ Uptime:* \`${uptime}\`
*🛡 Status:* _Fully Operational_

🔹 *Bot by: U M A R*
`;

        await conn.sendMessage(from, {
            text: finalMsg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Ping command error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
