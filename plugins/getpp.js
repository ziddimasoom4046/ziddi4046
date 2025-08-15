const config = require('../config');
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

cmd({
    pattern: 'pp',
    alias: ['profilepic', 'profile'],
    desc: 'Get profile picture of user. Use .pp, .pp @user or reply to message.',
    category: 'utility',
    use: '.pp [@user]',
    filename: __filename
}, async (conn, m, msg, { mention, reply, sender }) => {
    try {
        let targetJid;

        if (mention && mention.length > 0) {
            // Mentioned user
            targetJid = mention[0];
        } else if (m.quoted && m.quoted.participant) {
            // Replied user
            targetJid = m.quoted.participant;
        } else {
            // Sender himself
            targetJid = sender;
        }

        if (!targetJid.includes('@')) targetJid += '@s.whatsapp.net';

        // Fetch HD Profile Picture
        let url;
        try {
            url = await conn.profilePictureUrl(targetJid, 'image');
        } catch {
            url = null;
        }

        if (!url) return reply('⚠️ Profile picture not found or hidden.');

        await conn.sendMessage(
            m.chat, // Send in same group
            {
                image: { url },
                caption: `🖼️ Profile picture of @${targetJid.split('@')[0]}`
            },
            {
                quoted: m,
                contextInfo: {
                    mentionedJid: [targetJid]
                }
            }
        );

    } catch (e) {
        console.error(e);
        reply('❌ Error fetching profile picture.');
    }
});
