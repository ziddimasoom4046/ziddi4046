const { cmd } = require('../command');

cmd({
    pattern: 'groupinfo',
    alias: ['ginfo', 'gdetails'],
    desc: 'Get group information',
    category: 'group',
    use: '.groupinfo',
    filename: __filename
}, async (conn, m, msg, { reply, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ Ye command sirf group mein hi kaam karti hai.');

        const groupData = await conn.groupMetadata(m.chat);
        const groupName = groupData.subject;
        const groupId = groupData.id;
        const ownerJid = groupData.owner || groupData.participants.find(p => p.admin === 'superadmin')?.id;
        const participants = groupData.participants.length;
        const description = groupData.desc?.toString() || 'No description set.';

        const text = `👥 *Group Info*\n\n` +
            `📛 *Name:* ${groupName}\n` +
            `🆔 *ID:* ${groupId}\n` +
            `👑 *Owner:* ${ownerJid ? '@' + ownerJid.split('@')[0] : 'Unknown'}\n` +
            `👤 *Members:* ${participants}\n` +
            `📄 *Description:* ${description}`;

        await conn.sendMessage(m.chat, { text, mentions: [ownerJid] }, { quoted: m });

    } catch (err) {
        console.error(err);
        reply('❌ Error fetching group info.');
    }
});
