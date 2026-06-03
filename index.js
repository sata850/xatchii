const axios = require("axios");
const fs = require("fs");

// Command /update
bot.onText(/\/update/, async (msg) => {
    const chatId = msg.chat.id;
    const repoRaw = "https://raw.githubusercontent.com/sata850/xatchii/main/index.js";
    
    const statusMsg = await bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data || data.length < 100) {
            return bot.editMessageText("❌ Update gagal: File kosong atau tidak valid!", {
                chat_id: chatId,
                message_id: statusMsg.message_id
            });
        }

        fs.writeFileSync("./index.js", data);

        await bot.editMessageText("✅ Update berhasil!\n🔄 Bot akan restart ulang...", {
            chat_id: chatId,
            message_id: statusMsg.message_id
        });

        // Delay biar pesan terkirim dulu
        setTimeout(() => {
            process.exit(0); // restart jika pakai PM2 / nodemon
        }, 2000);

    } catch (e) {
        console.error("Update error:", e.message);
        await bot.editMessageText("❌ Update gagal. Pastikan repo RAW bisa diakses.", {
            chat_id: chatId,
            message_id: statusMsg.message_id
        });
    }
});
