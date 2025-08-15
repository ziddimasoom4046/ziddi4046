const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "joke",
  react: "🤣",
  desc: "Random joke",
  category: "fun",
  filename: __filename
}, 
async (client, m) => {
  try {
    let { data } = await axios.get('https://official-joke-api.appspot.com/jokes/random');
    let joke = `*${data.setup}*\n\n_${data.punchline}_\n\n_🤖 Plugin by Umar Rehman_`;  // <-- Footer added here

    await client.sendMessage(m.chat, { text: joke }, { quoted: m });
  } catch (e) {
    console.log(e);
    await client.sendMessage(m.chat, { text: "❌ Joke fetch karte waqt error aaya.\n\n_🤖 Plugin by Ziddi Masoom_", quoted: m });
  }
});
