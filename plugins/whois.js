const { cmd } = require('../command');

cmd({
    pattern: 'whois',
    alias: ['user', 'userinfo'],
    desc: 'Get user info (name, number, status)',
    category: 'utility',
    use: '.whois [@user or reply]',
    filename: __filename
}, async (conn, m, msg, { mention, reply, sender, isGroup }) => {
    try {
        let targetJid = sender;
        let name = msg.pushName || "Unknown";
        let status = '';
        let isAdmin = false;

        // If user is mentioned
        if (mention && mention.length > 0) {
            targetJid = mention[0];
        }

        // If it's a reply to someone
        else if (m.quoted && m.quoted.participant) {
            targetJid = m.quoted.participant;
        }

        // Proper format
        if (!targetJid.includes('@')) targetJid += '@s.whatsapp.net';

        // Get name
        const contact = await conn.onWhatsApp(targetJid);
        name = contact?.[0]?.notify || contact?.[0]?.jid?.split('@')[0] || name;

        // Get status
        try {
            let presence = await conn.fetchStatus(targetJid);
            status = presence?.status || 'Not public';
        } catch {
            status = 'Hidden or unavailable';
        }

        // Check admin
        if (isGroup) {
            const groupData = await conn.groupMetadata(m.chat);
            const isAdminList = groupData.participants.filter(p => p.admin).map(p => p.id);
            isAdmin = isAdminList.includes(targetJid);
        }

        // Send info
        const text = `👤 *User Info*\n\n` +
            `📛 *Name:* ${name}\n` +
            `📱 *Number:* ${targetJid.split('@')[0]}\n` +
            `💬 *Status:* ${status}\n` +
            `🛡️ *Admin:* ${isAdmin ? 'Yes' : 'No'}\n` +
            `👤 *Mention:* @${targetJid.split('@')[0]}`;

        await conn.sendMessage(m.chat, { text, mentions: [targetJid] }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply('❌ Error getting user info.');
    }
});
