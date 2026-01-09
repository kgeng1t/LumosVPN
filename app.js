// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Инициализируем приложение
tg.ready();
tg.expand(); // Раскрываем на весь экран

// Имя бота для отправки APK
const BOT_USERNAME = 'Lumos1VPN_bot';

// Получаем данные пользователя (для аналитики)
const user = tg.initDataUnsafe.user;
if (user) {
    console.log('👤 Пользователь:', {
        id: user.id,
        firstName: user.first_name,
        username: user.username
    });
}

// Настройка кнопки Telegram
tg.MainButton.setText("ℹ️ Помощь по установке");
tg.MainButton.onClick(() => {
    tg.showAlert(
        "📱 Помощь по установке Lumos VPN:\n\n" +
        "1. Нажмите кнопку 'Получить APK в Telegram'\n" +
        "2. Откроется бот @" + BOT_USERNAME + "\n" +
        "3. Нажмите 'START' в боте\n" +
        "4. Отправьте команду /apk\n" +
        "5. Бот перешлет файл в чат\n" +
        "6. Скачайте и установите файл\n\n" +
        "💬 Поддержка: @lumos_support"
    );
});
tg.MainButton.show();

// Функция для открытия бота
function openBotForAPK() {
    // Показываем подтверждение
    tg.showConfirm(
        "📱 Открыть бота @" + BOT_USERNAME + "?\n\n" +
        "Бот отправит APK файл Lumos VPN прямо в ваш чат Telegram.",
        function(confirmed) {
            if (confirmed) {
                // Открываем бота с параметром start
                const botLink = `https://t.me/${BOT_USERNAME}?start=apk`;
                tg.openTelegramLink(botLink);
                
                // Показываем инструкцию
                setTimeout(() => {
                    tg.showAlert(
                        "✅ Открываю бота @" + BOT_USERNAME + "\n\n" +
                        "📝 Что делать дальше:\n" +
                        "1. Нажмите 'START' в боте\n" +
                        "2. Отправьте команду /apk\n" +
                        "3. Бот перешлет файл в чат\n" +
                        "4. Скачайте и установите файл\n\n" +
                        "💬 Вопросы? @lumos_support"
                    );
                }, 800);
                
                // Логируем событие (можно отправлять на сервер)
                console.log('🎯 Пользователь открыл бота для APK:', {
                    userId: user?.id,
                    bot: BOT_USERNAME,
                    timestamp: new Date().toISOString()
                });
            }
        }
    );
}

// Обработчик кнопки "Получить APK в Telegram"
document.addEventListener('DOMContentLoaded', function() {
    const getApkButton = document.getElementById('getApkButton');
    
    if (getApkButton) {
        getApkButton.addEventListener('click', openBotForAPK);
        
        // Добавляем анимацию при наведении
        getApkButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 136, 204, 0.4)';
        });
        
        getApkButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 25px rgba(0, 102, 255, 0.3)';
        });
    }
    
    // Проверяем если пользователь вернулся от бота
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'bot') {
        tg.showAlert('✅ Бот уже отправил вам APK файл! Проверьте чат с @' + BOT_USERNAME);
    }
    
    // Автоматическое открытие бота если в мини-приложение зашли по специальной ссылке
    if (tg.initDataUnsafe.start_param === 'get_apk') {
        setTimeout(() => {
            openBotForAPK();
        }, 1500);
    }
});

// Дополнительные функции для улучшения UX
function trackEvent(eventName, data = {}) {
    // Можно отправлять события на сервер для аналитики
    console.log('📊 Event:', eventName, {
        ...data,
        userId: user?.id,
        timestamp: new Date().toISOString()
    });
}

// Обработчик видимости страницы
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Пользователь вернулся на вкладку
        trackEvent('page_visible');
    }
});

// Инициализация при загрузке
window.addEventListener('load', function() {
    console.log('🚀 Lumos VPN Mini App loaded');
    trackEvent('app_loaded');
    
    // Если в мини-приложении есть текстовые элементы, можно динамически обновлять
    const botElements = document.querySelectorAll('.bot-username');
    botElements.forEach(el => {
        if (el.textContent.includes('@BOT')) {
            el.textContent = '@' + BOT_USERNAME;
        }
    });
});