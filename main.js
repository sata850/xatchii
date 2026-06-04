const { Telegraf } = require('telegraf');
const axios = require("axios");
const fs = require("fs");

const bot = new Telegraf('8870671364:AAHJnoIce8e9g6uvpIQdvmcf3KP003sQI_U');

bot.telegram.deleteWebhook().catch(() => {});

bot.command('update', async (ctx) => {
    const chatId = ctx.chat.id;
    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/main.js";

    const msg = await ctx.reply("⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data || data.length < 100) {
            return ctx.telegram.editMessageText(chatId, msg.message_id, null, "❌ Update gagal: File kosong atau tidak valid!");
        }

        if (fs.existsSync("./main.js")) {
            fs.writeFileSync(`./backup_${Date.now()}.js`, fs.readFileSync("./main.js"));
        }

        fs.writeFileSync("./main.js", data);

        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "✅ Update berhasil!\n🔄 Bot akan restart...");

        setTimeout(() => process.exit(0), 2000);

    } catch (e) {
        console.error(e);
        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "❌ Update gagal. Pastikan repo RAW bisa diakses.");
    }
});

bot.launch();
