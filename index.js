const { Telegraf } = require('telegraf');
const axios = require("axios");
const fs = require("fs");

// Inisialisasi bot (ganti dengan token asli)
const bot = new Telegraf('ISI_TOKEN_BOT_ANDA');

// Command /update untuk Telegraf
bot.command('update', async (ctx) => {
    const chatId = ctx.chat.id;
    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/index.js";
    
    // Kirim pesan awal
    const statusMsg = await ctx.reply("⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data || data.length < 100) {
            return ctx.telegram.editMessageText(chatId, statusMsg.message_id, null, 
                "❌ Update gagal: File kosong atau tidak valid!"
            );
        }

        fs.writeFileSync("./index.js", data);

        await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null,
            "✅ Update berhasil!\n🔄 Bot akan restart ulang..."
        );

        // Delay biar pesan terkirim dulu
        setTimeout(() => {
            process.exit(0); // restart jika pakai PM2 / nodemon
        }, 2000);

    } catch (e) {
        console.error("Update error:", e.message);
        await ctx.telegram.editMessageText(chatId, statusMsg.message_id, null,
            "❌ Update gagal. Pastikan repo RAW bisa diakses."
        );
    }
});
