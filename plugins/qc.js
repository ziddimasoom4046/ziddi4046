const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "qc",
  alias: ["quotecreate", "quotecreator"],
  react: "🖼️",
  desc: "Create stylish quote images from text.",
  category: "converter",
  use: ".qc <text> | <author name> | <photo: yes/no>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Please provide the quote text, author name, and optional photo option.*\n\nExample:\n.qc Umar Rehman | Umar | yes");

  // Split input by "|"
  const parts = q.split('|').map(v => v.trim());
  if (parts.length < 2) return reply("❌ *Please provide at least quote text and author name.*\n\nExample:\n.qc Umar Rehman | Umar | yes");

  const text = encodeURIComponent(parts[0]);
  const name = encodeURIComponent(parts[1]);
  const photo = parts[2] && parts[2].toLowerCase() === 'yes' ? 'yes' : 'no';

  try {
    const url = `https://rest-lily.vercel.app/api/generator/qc?text=${text}&name=${name}&photo=${photo}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const imageBuffer = Buffer.from(response.data);

    await conn.sendMessage(from, {
      image: imageBuffer,
      caption: `🖼️ *Quote Creator*\n\nText: ${decodeURIComponent(text)}\nAuthor: ${decodeURIComponent(name)}`
    }, { quoted: mek });

  } catch (err) {
    console.log("❌ QC Plugin Error:", err);
    reply("⚠️ *Error generating quote image. Please try again later.*");
  }
});
