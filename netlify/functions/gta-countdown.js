const { schedule } = require('@netlify/functions');

const handler = async function(event, context) {
    try {
        // Устанавливаем целевую дату релиза (19 ноября 2026)
        const targetDate = new Date('2026-11-19T00:00:00+03:00'); // +03:00 — это МСК
        
        // Текущее время
        const now = new Date();
        
        // Считаем разницу в днях
        const difference = targetDate - now;
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

        let text = '';
        if (daysLeft > 0) {
            text = `До релиза GTA VI осталось: ${daysLeft} дней!`;
        } else if (daysLeft === 0) {
            text = '🔥 ЭТОТ ДЕНЬ НАСТАЛ! СЕГОДНЯ РЕЛИЗ GTA VI! 🔥';
        } else {
            text = 'GTA VI уже вышла!';
        }

        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // Отправка в Telegram
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            console.log('Сообщение успешно отправлено в Telegram!');
        } else {
            console.error('Ошибка API Telegram:', await response.text());
        }

    } catch (error) {
        console.error('Ошибка функции:', error);
    }

    return {
        statusCode: 200,
    };
};

// Запуск каждый день в 21:00 UTC (это ровно 00:00 по МСК)
exports.handler = schedule('0 21 * * *', handler);
