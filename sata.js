const { Telegraf } = require('telegraf');
const axios = require("axios");
const fs = require("fs");

const bot = new Telegraf('ISI_TOKEN_BOT_ANDA');

bot.command('update', async (ctx) => {
    if (!ctx || !ctx.chat) {
        return console.log("Context error");
    }
    
    const chatId = ctx.chat.id;
    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/sata.js";

    const msg = await ctx.reply("⏳ Mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);
        if (!data || data.length < 100) throw new Error();

        if (fs.existsSync("./sata.js")) {
            fs.writeFileSync(`./backup_${Date.now()}.js`, fs.readFileSync("./sata.js"));
        }

        fs.writeFileSync("./sata.js", data);
        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "✅ Berhasil! Restarting...");
        setTimeout(() => process.exit(0), 2000);

    } catch (e) {
        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "❌ Gagal!");
    }
});

bot.launch();
