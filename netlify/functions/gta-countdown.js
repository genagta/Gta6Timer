const targetDate = new Date('November 19, 2026 00:00:00').getTime();

export default async (req, context) => {
    try {
        // Берем текущее время на сервере
        const now = new Date();
        
        // Сдвигаем время сервера на +2 часа, чтобы получить точное время в Калининграде
        const kaliningradTime = new Date(now.getTime() + (2 * 60 * 60 * 1000));
        
        // Сбрасываем часы, минуты и секунды, чтобы сравнивать только чистые календарные дни
        const todayClean = new Date(kaliningradTime.getFullYear(), kaliningradTime.getMonth(), kaliningradTime.getDate()).getTime();
        const targetClean = new Date(2026, 10, 19).getTime(); // 10 — это ноябрь в JS (счет с 0)

        // Считаем чистую разницу в днях
        const difference = targetClean - todayClean;
        const daysLeft = Math.round(difference / (1000 * 60 * 60 * 24));

        let text = '';
        if (daysLeft > 0) {
            text = `До релиза GTA VI осталось: ${daysLeft} дней!`;
        } else if (daysLeft === 0) {
            text = 'Ура! Сегодня релиз GTA VI!';
        } else {
            text = 'GTA VI уже вышла!';
        }

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка Telegram API:', errorData);
            return new Response('Ошибка отправки в Telegram', { status: 500 });
        }

        console.log(`Успешно отправлено! Дней осталось: ${daysLeft}`);
        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('Критическая ошибка функции:', error);
        return new Response('Внутренняя ошибка сервера', { status: 500 });
    }
};

// Настройка расписания (каждый день в 00:00 по Калининграду / 22:00 UTC)
export const config = {
    schedule: "0 22 * * *"
};
