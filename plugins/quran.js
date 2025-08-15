const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'ayat',
  react: '📖',
  desc: 'Get Quran Ayah in Arabic with Surah info',
  category: 'islamic',
  usage: '.ayat 1 1',
  filename: __filename
}, async (client, m) => {
  let fullText = m.text || (m.message && m.message.conversation) || '';
  let [surah, ayahNumber] = fullText.split(' ').slice(1);

  if (!surah || !ayahNumber) {
    return client.sendMessage(m.chat, {
      text: '⚠️ Use format: .ayat [surah_number] [ayah_number]\nExample: .ayat 1 1',
    }, { quoted: m });
  }

  try {
    let { data } = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayahNumber}/quran-uthmani-quran-academy`);
    let ayahText = data.data.text;
    let surahName = data.data.surah.name;
    let surahEnglish = data.data.surah.englishName;
    let surahTrans = data.data.surah.englishNameTranslation;
    let number = data.data.numberInSurah;

    let msg = `📖 *Surah:* ${surahName} (${surahEnglish} - ${surahTrans})\n📌 *Ayah:* ${number}\n\n${ayahText}\n\n_🕋 Plugin by Umar Rehman_`;
    await client.sendMessage(m.chat, { text: msg }, { quoted: m });
  } catch (e) {
    console.error(e);
    await client.sendMessage(m.chat, { text: '❌ Ayah fetch karne me error aya. Check surah/ayah number.' }, { quoted: m });
  }
});
