const axios = require("axios");
const fs = require("fs");
const path = require("path");

const pluginDir = path.join(__dirname, "../plugins");
const pluginDBPath = path.join(__dirname, "plugins.json");

// Ensure plugin directory exists
if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir, { recursive: true });
// Ensure plugin DB file exists
if (!fs.existsSync(pluginDBPath)) fs.writeFileSync(pluginDBPath, "[]", "utf-8");

// Helper: Read & write plugin DB
function readPluginDB() {
  return JSON.parse(fs.readFileSync(pluginDBPath, "utf-8"));
}
function writePluginDB(data) {
  fs.writeFileSync(pluginDBPath, JSON.stringify(data, null, 2), "utf-8");
}

// Install a plugin
async function installPlugin(url, name) {
  const db = readPluginDB();
  if (db.find(p => p.url === url)) return false;

  const pluginPath = path.join(pluginDir, `${name}.js`);
  const { data } = await axios.get(url);
  fs.writeFileSync(pluginPath, data);
  require(pluginPath);

  db.push({ name, url });
  writePluginDB(db);
  return true;
}

// Remove a plugin
async function removePlugin(name) {
  const db = readPluginDB();
  const plugin = db.find(p => p.name === name);
  if (!plugin) return false;

  const pluginPath = path.join(pluginDir, `${name}.js`);
  if (fs.existsSync(pluginPath)) fs.unlinkSync(pluginPath);
  delete require.cache[require.resolve(pluginPath)];

  const updated = db.filter(p => p.name !== name);
  writePluginDB(updated);
  return true;
}

// Load all plugins on start
async function loadAllPlugins() {
  const db = readPluginDB();
  for (const p of db) {
    const pluginPath = path.join(pluginDir, `${p.name}.js`);
    try {
      const { data } = await axios.get(p.url);
      fs.writeFileSync(pluginPath, data);
      require(pluginPath);
      console.log(`✅ Plugin loaded: ${p.name}`);
    } catch (e) {
      console.error(`❌ Error loading plugin ${p.name}`, e.message);
    }
  }
}

module.exports = {
  installPlugin,
  removePlugin,
  loadAllPlugins,
};
