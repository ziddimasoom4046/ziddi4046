const { fetchJson } = require('../lib/functions');
const config = require('../config');
const { cmd } = require('../command');

const yourName = "*Plugin By ZiDdi MaSOoM*";
const IGDL_API = "https://rest-lily.vercel.app/api/downloader/igdl"; // ✅ direct endpoint

cmd({
    pattern: "insta",
    alias: ["instagram", "ig"],
    desc: "Download Instagram post/reel media",
    category: "download",
    react: "📩",
    filename: __filename
},
async (conn, mek, m, { from, q, quoted, reply }) => {
    try {
        if (!q || !q.startsWith("http")) return reply("*Please provide a valid Instagram post/reel URL.*");

        reply("*ZiDDi-MaSOoM INSTAGRAM VIDEO DOWNLOADING...📥*");

        // Use direct API endpoint
        const response = await fetchJson(`${IGDL_API}?url=${q}`);
        const mediaList = response?.data;

        if (!mediaList || mediaList.length === 0) {
            return reply("❌ No media found in the Instagram post. Check the link.");
        }

        for (const item of mediaList) {
            if (item.type === "image") {
                await conn.sendMessage(from, { image: { url: item.url }, caption: yourName }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { video: { url: item.url }, mimetype: 'video/mp4', caption: yourName }, { quoted: mek });
            }
        }

    } catch (err) {
        console.log("Instagram Plugin Error:", err);
        reply("❌ Error downloading from Instagram. Please try again.");
    }
});
