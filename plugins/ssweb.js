const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "ss",
  alias: ["ssweb"],
  react: '👽',
  desc: "Download ss of a given link.",
  category: "other",
  use: '.ss <link>',
  filename: __filename
},
async (conn, mek, m, {
  from, q, reply
}) => {
  if (!q) return reply("⚠️ Please provide a link.\nExample: `.ss https://cravo.live/login");

  try {
    // Fetch image as binary data
    let res = await axios.get(`https://rest-lily.vercel.app/api/generator/ssweb?url=${encodeURIComponent(q)}`, {
      responseType: 'arraybuffer'
    });

    let imageBuffer = Buffer.from(res.data, 'binary');

    // Stylish caption with your credits
    let caption = `
*╔═════════════════╗*
*║  UD PRIVATE  ║*
*║ ─────────────── ║*
*║  WEB SCREENSHOT ║*
*╚═════════════════╝*

🌐 Link: _${q}_

📸 Screenshot by: *ZIDDI MASOOM*  
🛠️ Powered by: *CRAVO TECHNOLOGIES*

©️ _All rights reserved._
`;

    await conn.sendMessage(from, {
      image: imageBuffer,
      caption
    }, { quoted: mek });

  } catch (e) {
    console.log("❌ ERROR:", e);
    reply("❌ Screenshot fetch nahi ho saka. Try again later.");
  }
});
