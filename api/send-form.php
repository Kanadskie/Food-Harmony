<?php
// Настройка заголовков для CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Обработка предварительного запроса OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Метод не разрешен. Используйте POST'
    ]);
    exit();
}

// Получаем данные из запроса
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'Не получены данные формы'
    ]);
    exit();
}

// Извлекаем данные
$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';  // ← ДОБАВЛЕНО
$goal = isset($data['goal']) ? trim(strip_tags($data['goal'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

// Маппинг целей
$goalMapping = [
    'energy' => 'Энергия и ясность',
    'digestion' => 'Комфорт пищеварения',
    'longevity' => 'Здоровое долголетие',
    'other' => 'Другое'
];
$goalDisplay = isset($goalMapping[$goal]) ? $goalMapping[$goal] : $goal;

// Валидация
$errors = [];

if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
}

if (empty($email)) {
    $errors[] = 'Email обязателен для заполнения';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный формат email';
}

if (empty($phone)) {
    $errors[] = 'Телефон обязателен для заполнения';
}

if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit();
}

// Генерируем номер заявки
$requestNumber = 'FH-' . date('Ymd') . '-' . rand(1000, 9999);
$timestamp = date('d.m.Y H:i:s');
$currentYear = date('Y');

// Сохраняем в лог-файл
$logFile = __DIR__ . '/food_harmony_submissions.log';
$logEntry = "========== НОВАЯ ЗАЯВКА ==========\n";
$logEntry .= "Номер: $requestNumber\n";
$logEntry .= "Дата: $timestamp\n";
$logEntry .= "Имя: $name\n";
$logEntry .= "Email: $email\n";
$logEntry .= "Телефон: $phone\n";  // ← ДОБАВЛЕНО
$logEntry .= "Цель: $goalDisplay\n";
$logEntry .= "Сообщение:\n$message\n";
$logEntry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Неизвестно') . "\n";
$logEntry .= "================================\n\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Функция для кодирования темы письма
function encodeSubject($subject) {
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

// ====================================================
// 1. Письмо администратору
// ====================================================
$adminEmail = 'foodharmony@yandex.ru';
$adminSubject = "Заявка с сайта Food Harmony № $requestNumber";

$adminEmailBody = "
<!DOCTYPE html>
<html>
<head>
<meta charset=\"UTF-8\">
<title>Новая заявка с сайта</title>
<link href=\"https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap\" rel=\"stylesheet\">
<style>
    body { 
        font-family: 'Lato', 'Segoe UI', Arial, sans-serif; 
        line-height: 1.6; 
        color: #2C2C2C; 
        background: #FDF8F0; 
        margin: 0; 
        padding: 20px; 
    }
    .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: #FFFFFF; 
        border-radius: 24px; 
        overflow: hidden; 
        box-shadow: 0 8px 30px rgba(0,0,0,0.08); 
    }
    .header { 
        background: linear-gradient(135deg, #88957F 0%, #6B7A62 100%); 
        padding: 30px 25px; 
        text-align: center; 
    }
    .header h1 { 
        margin: 0; 
        color: #FFFFFF; 
        font-size: 24px; 
        font-weight: 700; 
        letter-spacing: -0.3px;
    }
    .header p { 
        margin: 10px 0 0; 
        color: rgba(255,255,255,0.9); 
        font-size: 14px; 
        font-weight: 300;
    }
    .content { padding: 30px 25px; }
    .request-number { 
        background: #F0EDE6; 
        padding: 15px 20px; 
        border-radius: 16px; 
        margin: 20px 0; 
        text-align: center; 
        border-left: 4px solid #E09B7E; 
    }
    .request-number strong { 
        color: #E09B7E; 
        font-size: 18px; 
        display: block; 
        margin-bottom: 5px; 
        font-weight: 900;
    }
    .field-group { 
        margin: 20px 0; 
        padding-bottom: 15px; 
        border-bottom: 1px solid #EEE8E0; 
    }
    .field-label { 
        font-size: 12px; 
        text-transform: uppercase; 
        letter-spacing: 1px; 
        color: #88957F; 
        margin-bottom: 8px; 
        font-weight: 700; 
    }
    .field-value { 
        font-size: 16px; 
        color: #2C2C2C; 
        background: #FDF8F0; 
        padding: 12px 15px; 
        border-radius: 12px; 
        margin-top: 5px; 
        font-weight: 400;
    }
    .message-box { 
        background: #FDF8F0; 
        padding: 20px; 
        border-radius: 16px; 
        margin: 15px 0; 
        border: 1px solid #E8D9C5; 
    }
    .message-text { 
        color: #2C2C2C; 
        font-size: 15px; 
        line-height: 1.5; 
        font-weight: 400;
    }
    .footer { 
        background: #FDF8F0; 
        padding: 20px 25px; 
        text-align: center; 
        border-top: 1px solid #EEE8E0; 
        color: #88957F; 
        font-size: 12px; 
        font-weight: 300;
    }
    .phone-link { 
        color: #E09B7E; 
        text-decoration: none; 
        font-weight: 700; 
    }
    a { 
        color: #E09B7E; 
        text-decoration: none; 
        font-weight: 600;
    }
</style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h1>🍎 Гармония с едой / Food Harmony</h1>
            <p>Новая заявка на консультацию</p>
        </div>
        <div class=\"content\">
            <div class=\"request-number\">
                <strong>№ $requestNumber</strong>
                <span style=\"font-size: 13px; color: #88957F;\">$timestamp</span>
            </div>
            <div class=\"field-group\">
                <div class=\"field-label\">👤 Имя клиента</div>
                <div class=\"field-value\">$name</div>
            </div>
            <div class=\"field-group\">
                <div class=\"field-label\">📧 Email</div>
                <div class=\"field-value\"><a href=\"mailto:$email\">$email</a></div>
            </div>
            <div class=\"field-group\">
                <div class=\"field-label\">📱 Телефон</div>
                <div class=\"field-value\"><a href=\"tel:$phone\" class=\"phone-link\">$phone</a></div>
            </div>
            <div class=\"field-group\">
                <div class=\"field-label\">🎯 Цель программы</div>
                <div class=\"field-value\">$goalDisplay</div>
            </div>
            <div class=\"field-group\">
                <div class=\"field-label\">💬 Сообщение</div>
                <div class=\"message-box\">
                    <div class=\"message-text\">" . nl2br(htmlspecialchars($message ?: '—')) . "</div>
                </div>
            </div>
        </div>
        <div class=\"footer\">
            <p>IP: " . ($_SERVER['REMOTE_ADDR'] ?? '—') . "</p>
        </div>
    </div>
</body>
</html>
";

// Заголовки для письма администратору
$adminHeaders = "MIME-Version: 1.0\r\n";
$adminHeaders .= "Content-Type: text/html; charset=utf-8\r\n";
$adminHeaders .= "From: no-reply@food-harmony.ru\r\n";
$adminHeaders .= "Reply-To: $email\r\n";
$adminHeaders .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправляем письмо администратору
$adminEmailSent = mail($adminEmail, encodeSubject($adminSubject), $adminEmailBody, $adminHeaders, "-f no-reply@food-harmony.ru");

// ====================================================
// 2. Письмо пользователю (подтверждение) с телефоном
// ====================================================
$userSubject = "Food Harmony — подтверждение заявки № $requestNumber";

$userEmailBody = "
<!DOCTYPE html>
<html>
<head>
<meta charset=\"UTF-8\">
<title>Подтверждение заявки</title>
<link href=\"https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap\" rel=\"stylesheet\">
<style>
    body { 
        font-family: 'Lato', 'Segoe UI', Arial, sans-serif; 
        line-height: 1.6; 
        color: #2C2C2C; 
        background: #FDF8F0; 
        margin: 0; 
        padding: 20px; 
    }
    .container { 
        max-width: 550px; 
        margin: 0 auto; 
        background: #FFFFFF; 
        border-radius: 24px; 
        overflow: hidden; 
        box-shadow: 0 8px 30px rgba(0,0,0,0.08); 
    }
    .header { 
        background: linear-gradient(135deg, #88957F 0%, #6B7A62 100%); 
        padding: 35px 25px; 
        text-align: center; 
    }
    .header h1 { 
        margin: 0; 
        color: #FFFFFF; 
        font-size: 26px; 
        font-weight: 700; 
        letter-spacing: -0.5px;
    }
    .header p { 
        margin: 10px 0 0; 
        color: rgba(255,255,255,0.85); 
        font-size: 14px; 
        font-weight: 300;
    }
    .content { padding: 30px 25px; }
    .thank-you { 
        font-size: 20px; 
        color: #6B5B4E; 
        margin-bottom: 15px; 
        font-weight: 700;
    }
    .request-number { 
        background: #F0EDE6; 
        padding: 15px 20px; 
        border-radius: 16px; 
        text-align: center; 
        margin: 20px 0; 
    }
    .request-number .number { 
        font-size: 20px; 
        font-weight: 900; 
        color: #E09B7E; 
    }
    .request-number .label { 
        font-size: 11px; 
        text-transform: uppercase; 
        color: #88957F; 
        letter-spacing: 1px;
        font-weight: 700;
    }
    .info-box { 
        background: #FDF8F0; 
        padding: 20px; 
        border-radius: 16px; 
        margin: 20px 0; 
        border-left: 3px solid #E09B7E; 
    }
    .info-box p { 
        margin: 8px 0; 
        font-size: 14px; 
        font-weight: 400;
    }
    .contact-block { 
        background: #F0EDE6; 
        padding: 20px; 
        border-radius: 16px; 
        margin: 25px 0; 
        text-align: center; 
    }
    .contact-block h3 { 
        color: #6B5B4E; 
        font-size: 16px; 
        margin: 0 0 15px; 
        font-weight: 700;
    }
    .contact-item { 
        margin: 12px 0; 
        font-weight: 400;
    }
    .contact-item a { 
        color: #E09B7E; 
        text-decoration: none; 
        font-weight: 600;
    }
    .signature { 
        margin-top: 30px; 
        padding-top: 20px; 
        border-top: 1px solid #EEE8E0; 
        text-align: center; 
    }
    .signature strong { 
        font-weight: 900;
    }
    .footer { 
        background: #FDF8F0; 
        padding: 20px 25px; 
        text-align: center; 
        border-top: 1px solid #EEE8E0; 
        color: #88957F; 
        font-size: 11px; 
        font-weight: 300;
    }
</style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h1>🍃 Гармония с едой / Food Harmony</h1>
            <p>Осознанное питание без жёстких правил</p>
        </div>
        <div class=\"content\">
            <div class=\"thank-you\">Здравствуйте, $name!</div>
            <p>Спасибо, что выбрали путь осознанного питания. Я получила вашу заявку и скоро свяжусь с вами.</p>
            <div class=\"request-number\">
                <div class=\"label\">Номер вашей заявки</div>
                <div class=\"number\">$requestNumber</div>
                <div style=\"font-size: 11px; color: #88957F; margin-top: 5px;\">$timestamp</div>
            </div>
            <div class=\"info-box\">
                <p><strong>📱 Ваш телефон:</strong> $phone</p>
                <p><strong>🎯 Ваша цель:</strong> $goalDisplay</p>
                <p><strong>📧 Email:</strong> $email</p>
            </div>
            <p>Я свяжусь с вами по указанному телефону в ближайшее рабочее время (обычно в течение 24 часов).</p>
            <div class=\"contact-block\">
                <h3>✨ Связаться со мной напрямую</h3>
                <div class=\"contact-item\">📱 Telegram: <a href=\"https://t.me/Nutriciolog_Anatolevna\">@Nutriciolog_Anatolevna</a></div>
                <div class=\"contact-item\">💬 WhatsApp: <a href=\"https://wa.me/79257558859\">+7 (925) 755-88-59</a></div>
                <div class=\"contact-item\">📞 Телефон: <a href=\"tel:+79257558859\">+7 (925) 755-88-59</a></div>
            </div>
            <div class=\"signature\">
                <p>С заботой о вашем здоровье,</p>
                <p><strong>Николаева Анна</strong><br>
                <span style=\"color: #88957F; font-size: 13px;\">Дипломированный нутрициолог</span></p>
            </div>
        </div>
        <div class=\"footer\">
            <p>© $currentYear Гармония с едой / Food Harmony</p>
            <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
";

// Заголовки для письма пользователю
$userHeaders = "MIME-Version: 1.0\r\n";
$userHeaders .= "Content-Type: text/html; charset=utf-8\r\n";
$userHeaders .= "From: no-reply@food-harmony.ru\r\n";
$userHeaders .= "Reply-To: $adminEmail\r\n";
$userHeaders .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправляем письмо пользователю
$userEmailSent = mail($email, encodeSubject($userSubject), $userEmailBody, $userHeaders, "-f no-reply@food-harmony.ru");

// Записываем результат в лог
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Отправка админу ($adminEmail): " . ($adminEmailSent ? 'OK' : 'FAIL') . "\n", FILE_APPEND);
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Отправка пользователю ($email): " . ($userEmailSent ? 'OK' : 'FAIL') . "\n", FILE_APPEND);

// ====================================================
// 3. Отправляем JSON-ответ для React-приложения
// ====================================================
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Мы свяжемся с вами по телефону в ближайшее время.',
    'requestNumber' => $requestNumber,
    'timestamp' => $timestamp,
    'emailsSent' => [
        'admin' => $adminEmailSent,
        'user' => $userEmailSent
    ]
], JSON_UNESCAPED_UNICODE);