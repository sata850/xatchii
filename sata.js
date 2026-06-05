‎const { Telegraf } = require('telegraf');
‎const axios = require("axios");
‎const fs = require("fs");
‎
‎const bot = new Telegraf('ISI_TOKEN_BOT_ANDA');
‎
‎bot.telegram.deleteWebhook().catch(() => {});
‎
‎bot.command('update', async (ctx) => {
‎    const chatId = ctx.chat.id;
‎    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/sata.js";
‎
‎    const msg = await ctx.reply("⏳ Sedang mengecek update...");
‎
‎    try {
‎        const { data } = await axios.get(repoRaw);
‎
‎        if (!data || data.length < 100) {
‎            return ctx.telegram.editMessageText(chatId, msg.message_id, null, "❌ Update gagal: File kosong atau tidak valid!");
‎        }
‎
‎        if (fs.existsSync("./sata.js")) {
‎            fs.writeFileSync(`./backup_${Date.now()}.js`, fs.readFileSync("./sata.js"));
‎        }
‎
‎        fs.writeFileSync("./sata.js", data);
‎
‎        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "✅ Update berhasil!\n🔄 Bot akan restart...");
‎
‎        setTimeout(() => process.exit(0), 2000);
‎
‎    } catch (e) {
‎        console.error(e);
‎        await ctx.telegram.editMessageText(chatId, msg.message_id, null, "❌ Update gagal. Pastikan repo RAW bisa diakses.");
‎    }
‎});
‎
‎bot.launch();
