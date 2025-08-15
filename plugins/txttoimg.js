const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "txt2img",
  alias: ["t2i", "text2img"],
  react: "🖼️",
  desc: "Generate image from text (AI Art)",
  category: "converter",
  use: ".txt2img <text prompt>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Please provide a text prompt!*\n\nExample: `.txt2img fantasy castle at night`");

  try {
    const response = await axios.get(`https://rest-lily.vercel.app/api/generator/txt2img?prompt=${encodeURIComponent(q)}`, {
      responseType: 'arraybuffer' // Important for image
    });

    let buffer = Buffer.from(response.data);

    await conn.sendMessage(from, {
      image: buffer,
      caption: `🎨 *AI Image Generated*\n\n📝 *Prompt:* ${q}\n\n_🤖 Powered by: Ziddi MaSOoM (um4rxd)_`
    }, { quoted: mek });

  } catch (err) {
    console.error("❌ txt2img Plugin Error:", err);
    reply("⚠️ *Failed to generate image from text. Try again later.*");
  }
});
