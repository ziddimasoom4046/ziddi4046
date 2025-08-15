const { cmd } = require('../command');
const fs = require('fs');

const namesFile = require('../lib/asmaulhusna.json');

cmd({
  pattern: '99names',   // yahan space aur number capture karne ke liye (.*)
  react: '🕋',
  desc: 'Shows Allah’s 99 beautiful names (Asma Ul Husna)',
  category: 'islamic',
  usage: '.99names OR .99names 25',
  filename: __filename
}, async (client, m, { match }) => {
  const input = match?.trim();

  if (input && !isNaN(input)) {
    const num = parseInt(input);
    const name = namesFile.find(n => n.number === num);
    if (!name) {
      return client.sendMessage(m.chat, { text: `❌ Invalid number. Please enter between 1 to 99.` }, { quoted: m });
    }

    let msg = `📿 *Name ${name.number} of Allah*:\n\n` +
              `🕋 Arabic: *${name.name}*\n` +
              `🔤 Transliteration: _${name.transliteration}_\n` +
              `📖 Meaning: ${name.meaning}\n\n` +
              `_Plugin by Umar Rehman_`;
    return client.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  // Agar number nahi diya to full list bhej do (lekin dhyan rahe ki message limit cross na ho)
  let msg = `📿 *Asma Ul Husna – 99 Names of Allah*\n\n`;
  namesFile.forEach(n => {
    msg += `*${n.number}.* ${n.name} — _${n.transliteration}_ (${n.meaning})\n`;
  });
  msg += `\n🕋 _Use .99names <number> to get one name's detail._\n_Plugin by Umar Rehman_`;

  await client.sendMessage(m.chat, { text: msg }, { quoted: m });
});
