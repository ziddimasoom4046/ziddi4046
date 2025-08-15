const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'namaz',
  react: '🕌',
  desc: 'Namaz timings for Pakistani cities',
  category: 'islamic',
  usage: '.namaz Karachi',
  filename: __filename
}, async (client, m) => {
  // m.text ya m.message.conversation me pura message hota hai
  // command ke baad city nikalna
  let fullText = m.text || (m.message && m.message.conversation) || '';
  let city = fullText.split(' ').slice(1).join(' ').trim();

  if (!city) {
    return client.sendMessage(m.chat, { text: '⚠️ Please provide a city name.\nExample: .namaz Karachi' }, { quoted: m });
  }

  try {
    let { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=2`);
    let timings = data.data.timings;
    let msg = `🕌 Namaz timings for *${city}* (Pakistan):\n\n` +
      `Fajr: ${timings.Fajr}\n` +
      `Dhuhr: ${timings.Dhuhr}\n` +
      `Asr: ${timings.Asr}\n` +
      `Maghrib: ${timings.Maghrib}\n` +
      `Isha: ${timings.Isha}\n\n` +
      `_Plugin by Umar Rehman_`;
    await client.sendMessage(m.chat, { text: msg }, { quoted: m });
  } catch (e) {
    console.log(e);
    await client.sendMessage(m.chat, { text: '❌ Namaz timings fetch karne me error aya.', quoted: m });
  }
});
