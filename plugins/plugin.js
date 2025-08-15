const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { cmd } = require("../command");
const { installPlugin, removePlugin, PluginDB } = require("../lib/plugin-utils");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "install",
    fromMe: true,
    desc: "Install a plugin from URL",
    category: "owner",
    filename: __filename
}, async (conn, m, msg, { q, reply }) => {
    if (!q) {
        return reply(`❌ *Plugin URL missing!*\n\n_Example usage:_\n.install https://gist.github.com/yourpluginurl`);
    }

    let url;
    try {
        url = new URL(q);
    } catch {
        return reply("*Invalid URL format provided.*");
    }

    if (url.host === "gist.github.com") {
        url.host = "gist.githubusercontent.com";
        url = url.toString() + "/raw";
    } else {
        url = url.toString();
    }

    try {
        const { data } = await axios.get(url);
        const nameMatch = data.match(/pattern:\s*["'](.*?)["']/);
        const pluginName = nameMatch ? nameMatch[1].split(" ")[0] : "plugin_" + Math.random().toString(36).slice(2);

        const installed = await installPlugin(url, pluginName);
        if (!installed) return reply(`⚠️ Plugin *${pluginName}* is already installed.`);

        return reply(`✅ Plugin *${pluginName}* installed successfully.`);
    } catch (e) {
        console.log(e);
        return reply("❌ Plugin install failed.\n\n" + e.message);
    }
});

cmd({
    pattern: "pluginlist",
    fromMe: true,
    desc: "List all plugins in the plugins folder with count",
    category: "owner",
    filename: __filename
}, async (conn, m, msg, { reply }) => {
    const pluginsPath = path.join(__dirname);
    const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith(".js"));

    if (!files.length) return reply("📭 *No plugins found in the folder.*");

    const list = files.map(f => `🔹 *${f}*`).join("\n");
    return reply(`*Umar Private Haved total Installed Plugins (${files.length}):*\n\n${list}`);
});

cmd({
    pattern: "removeplugin",
    fromMe: true,
    desc: "Remove an installed plugin",
    category: "owner",
    filename: __filename
}, async (conn, m, msg, { q, reply }) => {
    if (!q) return reply("❌ *Please provide a plugin name to remove.*\n\n_Example:_ `.removeplugin hi`");

    const removed = await removePlugin(q);
    if (!removed) return reply("❌ Plugin not found or already removed.");

    reply(`🗑️ Plugin *${q}* removed successfully.\n🔁 Please restart the bot manually to complete removal.`);
});
