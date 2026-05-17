const targetDate = new Date('November 19, 2026 00:00:00').getTime();

export default async (req, context) => {
    try {
        const now = new Date();
        
        // Считаем разницу в днях (округляем в большую сторону)
        const difference = targetDate - now.getTime();
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

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

        // Отправляем запрос в Telegram API
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

// Настройка расписания (каждый день в 00:00 по Москве / 21:00 UTC)
export const config = {
    schedule: "0 21 * * *"
};
