const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "dtts",
  alias: ["girl", "dtalk"],
  react: "🗣️",
  desc: "Convert text to speech using Dakshita TTS",
  category: "converter",
  use: ".dtts <text>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Please provide some text to convert to audio!*\n\nExample: `.dtts Hello Umar`");

  try {
    const res = await axios.get(`https://rest-lily.vercel.app/api/tts/dakshita?text=${encodeURIComponent(q)}`);

    if (!res.data?.status || !res.data?.data?.base64Audio) {
      return reply("❌ *Failed to generate audio from Dakshita TTS.*");
    }

    // Extract base64 and convert to buffer
    const base64 = res.data.data.base64Audio.split(',')[1];
    const audioBuffer = Buffer.from(base64, 'base64');

    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: true // true = voice note style
    }, { quoted: mek });

  } catch (err) {
    console.error("Dakshita TTS Plugin Error:", err);
    reply("⚠️ *Something went wrong while processing your request.*");
  }
});
