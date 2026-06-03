‎const axios = require("axios");
‎const fs = require("fs");
‎
‎bot.onText(/\/update/, async (msg) => {
‎    const chatId = msg.chat.id;
‎
‎    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/index.js";
‎
‎    bot.sendMessage(chatId, "⏳ Sedang mengecek update...");
‎
‎    try {
‎        const { data } = await axios.get(repoRaw);
‎
‎        if (!data) return bot.sendMessage(chatId, "❌ Update gagal: File kosong!");
‎
‎        fs.writeFileSync("./index.js", data);
‎
‎        bot.sendMessage(chatId, "✅ Update berhasil!\nSilakan restart bot.");
‎
‎        process.exit(); // restart jika pakai PM2
‎    } catch (e) {
‎        console.log(e);
‎        bot.sendMessage(chatId, "❌ Update gagal. Pastikan repo dan file index.js tersedia.");
‎    }
‎});
