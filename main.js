const { Telegraf } = require('telegraf');
const axios = require("axios");
const fs = require("fs");

const bot = new Telegraf('8870671364:AAHerJP-xFbpA99zm20nes9xkLtILcoXAz0');

bot.command('update', async (ctx) => {
    const chatId = ctx.chat.id;
    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/main.js";
    
    const statusMsg = await ctx.reply("⏳ Mengupdate main.js...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data || data.length < 100) {
            throw new Error("File tidak valid");
        }

        // Backup main.js lama
        if (fs.existsSync("./main.js")) {
            const backup = fs.readFileSync("./main.js", "utf8");
            fs.writeFileSync(`./main_backup_${Date.now()}.js`, backup);
        }

        // Update main.js
        fs.writeFileSync("./main.js", data);

        await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null,
            "✅ Update main.js berhasil!\n🔄 Bot akan restart..."
        );

        setTimeout(() => process.exit(0), 2000);

    } catch (e) {
        await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null,
            "❌ Update gagal!"
        );
    }
});
