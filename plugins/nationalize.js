const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: "nationality",
  alias: ["nationalize", "nation"],
  desc: "Predict nationality from a name",
  category: "tools",
  usage: ".nationality <name>",
  filename: __filename,
}, async (client, m, info) => {
  const text = info?.text || m.body?.split(" ")?.slice(1)?.join(" ");
  if (!text) return m.reply("⚠️ *Please provide a name!*\nExample: `.nationality Umar`\n\n_🤖 Plugin by Umar Rehman_");

  try {
    const res = await fetchJson(`https://api.nationalize.io?name=${encodeURIComponent(text)}`);
    if (!res.country || res.country.length === 0) {
      return m.reply(`❌ No country prediction found for *${text}*\n\n_🤖 Plugin by Umar Rehman_`);
    }

    let reply = `🌍 *Nationality prediction for:* _${text}_\n\n`;
    res.country.slice(0, 3).forEach((item, index) => {
      reply += `🔹 ${index + 1}. Country Code: *${item.country_id}* | Probability: *${(item.probability * 100).toFixed(2)}%*\n`;
    });

    m.reply(reply + "\n\n_🤖 Plugin by Umar Rehman_");
  } catch (e) {
    console.error(e);
    m.reply("❌ Error fetching nationality prediction.\n\n_🤖 Plugin by Umar Rehman_");
  }
});
