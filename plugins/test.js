const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "test",
    alias: ["🚀", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender }) => {
    try {
        const start = Date.now();

        await conn.sendMessage(from, {
            react: {
                text: "⚡",
                key: mek.key
            }
        });

        const end = Date.now();
        const responseTime = end - start;
        const uptime = runtime(process.uptime());

        const finalMsg = `*👋 Hello @${sender.split('@')[0]}!*

*🤖 Bot is Online!*
*📡 Ping:* \`${responseTime} ms\`
*⏱ Uptime:* \`${uptime}\`
*🛡 Status:* _Fully Operational_

🔹 *Bot by: U M A R*`;

        const templateButtons = [
            {
                index: 1,
                quickReplyButton: {
                    id: 'menu',
                    displayText: '📜 Menu'
                }
            },
            {
                index: 2,
                quickReplyButton: {
                    id: 'alive',
                    displayText: '💡 Alive'
                }
            }
        ];

        const buttonMessage = {
            text: finalMsg,
            footer: 'Choose an option below',
            mentions: [sender],
            templateButtons: templateButtons
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.error("Ping command error:", e);
        await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});
