const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "news",
  react: "📰",
  desc: "Top latest news about Pakistan",
  category: "news",
  filename: __filename
},
async (client, m) => {
  try {
    const apiKey = "ba78300ac41c450a8f23f5d67c94ce5d";
    const url = `https://newsapi.org/v2/everything?q=Pakistan&pageSize=5&sortBy=publishedAt&language=en&apiKey=${apiKey}`;
    
    const { data } = await axios.get(url);
    
    if (!data.articles || data.articles.length === 0) {
      return client.sendMessage(m.chat, { text: "❌ No news found at the moment." }, { quoted: m });
    }

    let newsList = "*📰 Latest News on Pakistan:*\n\n";
    data.articles.forEach((article, index) => {
      newsList += `*${index + 1}. ${article.title}*\n_${article.source.name}_\n${article.url}\n\n`;
    });

    await client.sendMessage(m.chat, { text: newsList.trim() }, { quoted: m });

  } catch (err) {
    console.error(err?.response?.data || err);
    await client.sendMessage(m.chat, { text: "❌ Failed to fetch news. Check your API key or connection." }, { quoted: m });
  }
});
