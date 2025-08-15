const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "pinterest",
  alias: ["pin", "pindl"],
  react: "📌",
  desc: "Download Pinterest video/image from URL.",
  category: "downloader",
  use: ".pinterest <pinterest_url>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Give me a pinterest link!*\n\nExample: `.pinterest https://pin.it/xxxxxx`");

  try {
    const { data } = await axios.get(`https://rest-lily.vercel.app/api/downloader/pinterestdl?url=${encodeURIComponent(q)}`);
    
    if (!data.status || !data.data.medias || data.data.medias.length === 0) {
      return reply("❌ *I Did`nt Find The Post. Please check The Post Valid Link*");
    }

    const media = data.data.medias.find(m => m.extension === "mp4") || data.data.medias[0];

    let caption = `🖼️ *PINTEREST DOWNLOADER*

🎬 *Title:* ${data.data.title || "N/A"}
📥 *Quality:* ${media.quality || "N/A"}
📦 *Size:* ${media.formattedSize || "N/A"}

_🤖 Powered by: Umar Rehman (um4rxd)_`;

    await conn.sendMessage(from, {
      video: { url: media.url },
      caption: caption
    }, { quoted: mek });

  } catch (err) {
    console.log("❌ Pinterest Download Error:", err);
    reply("⚠️ *Pinterest media did`nt fetch. Try again later.*");
  }
});
