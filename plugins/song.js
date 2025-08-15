const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "play",
  alias: ["splaydl", "splaydownload"],
  react: "🎵",
  desc: "Search and download song info from splay API.",
  category: "downloader",
  use: ".splay <song name>",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("❌ *Please provide a song name!*\n\nExample: `.splay zara zara behgta hai`");

  try {
    const { data } = await axios.get(`https://rest-lily.vercel.app/api/downloader/splay?query=${encodeURIComponent(q)}`, {
      headers: { accept: "*/*" }
    });

    if (!data.status || !data.result || data.result.length === 0) {
      return reply("❌ *No results found for your query.*");
    }

    // Taking the first result (you can adjust if needed)
    const song = data.result[0];

    let caption = `🎵 *SPLAY SONG DOWNLOAD*

🎶 *Title:* ${song.title || "N/A"}
⏳ *Duration:* ${song.duration || "N/A"}
🔗 *Download Link:* ${song.link || song.download_url || "N/A"}

_🤖 Powered by: Umar Rehman (um4rxd)_`;

    await conn.sendMessage(from, {
      text: caption
    }, { quoted: mek });

  } catch (err) {
    console.log("❌ Splay Download Error:", err);
    reply("⚠️ *Failed to fetch song info. Try again later.*");
  }
});
