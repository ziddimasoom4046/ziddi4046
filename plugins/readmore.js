const { cmd } = require('../command');

cmd({
  pattern: "readmore",
  alias: ["rm", "more"],
  desc: "Add Read More effect to your message.",
  category: "fun",
  react: "📖",
  use: ".readmore your message",
  filename: __filename
},
async (conn, mek, m, {
  q, reply
}) => {
  try {
    if (!q) return reply("⚠️ Please provide a message.\nExample: `.readmore I love you bro ❤️`");

    const readMore = String.fromCharCode(8206).repeat(4001);
    const finalText = `${q}${readMore}`;

    await reply(finalText);
  } catch (err) {
    console.error("❌ Readmore error:", err);
    await reply("❌ Something went wrong while adding Read More effect.");
  }
});
