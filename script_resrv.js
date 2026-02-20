


// Генерація або отримання постійного UUID для користувача
const getUserUUID = () => {
    const STORAGE_KEY = 'pedro_user_uuid';
    let uuid = localStorage.getItem(STORAGE_KEY);

    if (!uuid) {
        // Генеруємо новий UUID (проста версія v4)
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem(STORAGE_KEY, uuid);
    }

    return uuid;
};

// Отримуємо UUID один раз
const userUUID = getUserUUID();


// Визначаємо справжній Telegram Mini App (мобільний/десктоп клієнт)
const tg = window.Telegram?.WebApp;
const isTelegramMiniApp = tg && 
                         tg.initData && 
                         tg.initDataUnsafe && 
                         tg.initDataUnsafe.user && 
                         tg.platform && 
                         ['ios', 'android', 'macos', 'windows'].includes(tg.platform);

const isWebVersion = !isTelegramMiniApp;

// Додаємо клас до body для стилів
if (isTelegramMiniApp) {
    document.body.classList.add('in-telegram');

    // Safe-area та розгортання — тільки для справжнього Mini App
    const safeTop = tg.safeAreaInset?.top || 0;
    document.documentElement.style.setProperty('--tg-safe-area-top', safeTop + 'px');
    tg.expand();
} else {
    document.body.classList.add('in-browser');
}
// Інформація про пристрій (працює у всіх браузерах)
const deviceInfo = {
    screen: `${window.innerWidth}×${window.innerHeight}`,
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage || 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    isMobile: /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent),
    platform: navigator.platform || 'unknown'
};

// Додаткова інформація тільки з Mini App
const miniAppInfo = isTelegramMiniApp ? {
    premium: tg.initDataUnsafe.user.is_premium || false,
    language_code: tg.initDataUnsafe.user.language_code || 'unknown',
    tg_platform: tg.platform || 'unknown',
    tg_version: tg.version || 'unknown'
} : null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const submitBtn = document.querySelector('.submit-btn');
    const field4 = document.getElementById('field4');
    const resultText = document.getElementById('resultText');
    const clearBtn = document.querySelector('.clear-btn');
    const themeToggle = document.getElementById('themeToggle');
    // Логування
    const addLog = (msg, data = {}) => console.log(`${msg}:`, data);
    
    
    // history
    // ─── Кнопка ІСТОРІЯ ТА ФАКТИ ──────────────────────────────────────────────
    document.querySelector('.history-btn')?.addEventListener('click', () => {
        const helpUrl = 'https://discountsfromlexx.github.io/help/history.html';
    
        // Створюємо модальне вікно
        const modal = document.createElement('div');
        modal.id = 'help-modal';
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.background = 'rgba(0,0,0,0.85)';
        modal.style.zIndex = '9999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.overflow = 'auto';
    
        // Відступ зверху для Mini App (щоб не перекривати панель Telegram)
        if (isTelegramMiniApp) {
            const safeTop = window.Telegram.WebApp.safeAreaInset?.top || 50;
            modal.style.paddingTop = `${safeTop + 30}px`;
            modal.style.paddingBottom = 'env(safe-area-inset-bottom)';
        }
    
        // Кнопка закриття (хрестик)
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = isTelegramMiniApp ? `${(window.Telegram.WebApp.safeAreaInset?.top || 50) + 10}px` : '5px';
        closeBtn.style.right = '15px';
        closeBtn.style.background = 'rgba(0,0,0,0.7)';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.width = '44px';
        closeBtn.style.height = '44px';
        closeBtn.style.fontSize = '28px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '10001';
        closeBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    
        // Контейнер для iframe
        const iframeContainer = document.createElement('div');
        iframeContainer.style.width = '100%';
        iframeContainer.style.maxWidth = '1000px'; // обмеження для десктопу
        iframeContainer.style.height = isTelegramMiniApp ? 'calc(100vh - 60px)' : '90vh';
        iframeContainer.style.borderRadius = '16px';
        iframeContainer.style.overflow = 'hidden';
        iframeContainer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';
    
        const iframe = document.createElement('iframe');
        iframe.src = helpUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allowFullscreen = true;
    
        iframeContainer.appendChild(iframe);
        modal.appendChild(closeBtn);
        modal.appendChild(iframeContainer);
        document.body.appendChild(modal);
    
        // Закриття модалки
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    
        // Повідомлення в resultText (опціонально)
        resultText.innerHTML = '<span style="color:#00ff88;">Історія відкрита у повноекранному вікні ↓</span>';
        resultText.style.color = 'inherit';
    });

    
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('scroll', () => {
        const btn = document.querySelector('.scroll-top-btn');
        if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    console.log("Скрипт Педро завантажився");
});
