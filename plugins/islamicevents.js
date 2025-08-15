const { cmd } = require('../command');
const axios = require('axios');

// Static list of events
const islamicEvents = [
  { day: 1, month: 9, name: "Start of Ramadan" },
  { day: 27, month: 9, name: "Laylat al-Qadr (Night of Decree)" },
  { day: 1, month: 10, name: "Eid al-Fitr" },
  { day: 9, month: 12, name: "Day of Arafah" },
  { day: 10, month: 12, name: "Eid al-Adha" },
  { day: 1, month: 1, name: "Islamic New Year" },
  { day: 10, month: 1, name: "Day of Ashura" },
  { day: 12, month: 3, name: "Mawlid (Prophet's Birthday)" },
];

cmd({
  pattern: 'events',
  react: '📅',
  desc: 'Upcoming Islamic events from Hijri calendar',
  category: 'islamic',
  usage: '.events',
  filename: __filename
}, async (client, m) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // JS months are 0-based
    const year = today.getFullYear();

    // Convert today's date to Hijri
    const { data } = await axios.get(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`);
    const hijri = data.data.hijri;
    const currentHijriDay = parseInt(hijri.day);
    const currentHijriMonth = parseInt(hijri.month.number);

    // Filter events that are upcoming (same month or later)
    const upcoming = islamicEvents
      .filter(e => (e.month > currentHijriMonth) || (e.month === currentHijriMonth && e.day >= currentHijriDay))
      .slice(0, 5); // limit to next 5 events

    if (upcoming.length === 0) {
      return client.sendMessage(m.chat, { text: '📅 No upcoming Islamic events found for this year.' }, { quoted: m });
    }

    let msg = `📅 *Upcoming Islamic Events* (Hijri Calendar):\n\n`;
    upcoming.forEach(e => {
      msg += `🕌 *${e.name}* — ${e.day} / ${e.month} Hijri\n`;
    });

    msg += `\n_🕋 Plugin by Umar Rehman_`;

    await client.sendMessage(m.chat, { text: msg }, { quoted: m });
  } catch (err) {
    console.error(err);
    await client.sendMessage(m.chat, { text: '❌ Error while fetching Islamic events.' }, { quoted: m });
  }
});
