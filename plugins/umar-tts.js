const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "tts",
  alias: ["say", "speak"],
  react: "🗣️",
  desc: "Convert text to voice using TTS",
  category: "converter",
  use: ".tts <text>",
  filename: __filename,
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Please provide some text!*\nExample: `.tts Hello Umar`");

  try {
    const { data } = await axios.get(`https://rest-lily.vercel.app/api/tts/tts?text=${encodeURIComponent(q)}`);

    if (!data.status || !data.data) {
      return reply("❌ *TTS Error:* Couldn't fetch audio.");
    }

    await conn.sendMessage(from, {
      audio: { url: data.data },
      mimetype: "audio/mp4",
      ptt: true,
    }, { quoted: mek });

  } catch (e) {
    console.error("TTS Plugin Error:", e);
    reply("❌ *Something went wrong while generating the audio.*");
  }
});
