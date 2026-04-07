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

// Если совсем нет данных
if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'Не получены данные формы'
    ]);
    exit();
}

// Извлекаем и очищаем данные (соответствует полям формы в App.tsx)
$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$goal = isset($data['goal']) ? trim(strip_tags($data['goal'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

// Маппинг целей для читаемого отображения
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

// Цель не обязательна, но если есть - валидируем
if (!empty($goal) && !array_key_exists($goal, $goalMapping)) {
    $goalDisplay = $goal;
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

// 1. Сохраняем заявку в текстовый файл
$logEntry = "========== НОВАЯ ЗАЯВКА (Гармония с едой / Food Harmony) ==========\n";
$logEntry .= "Номер: $requestNumber\n";
$logEntry .= "Дата: $timestamp\n";
$logEntry .= "Имя: $name\n";
$logEntry .= "Email: $email\n";
$logEntry .= "Цель: $goalDisplay\n";
$logEntry .= "Сообщение:\n$message\n";
$logEntry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Неизвестно') . "\n";
$logEntry .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Неизвестно') . "\n";
$logEntry .= "================================================\n\n";

// Сохраняем в файл
$logFile = __DIR__ . '/food_harmony_submissions.log';
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Общие настройки для email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";

// Функция для кодирования темы
function encodeSubject($subject) {
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

// ====================================================
// 1. Письмо администратору
// ====================================================
$adminEmail = 'foodharmony@yandex.ru';
$adminSubject = "Заявка с сайта Гармония с едой / Food Harmony № $requestNumber";

$adminEmailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Новая заявка с сайта</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #2C2C2C; background: #FDF8F0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #88957F 0%, #6B7A62 100%); padding: 30px 25px; text-align: center; }
        .header h1 { margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 500; letter-spacing: -0.3px; }
        .header p { margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; }
        .content { padding: 30px 25px; }
        .badge { display: inline-block; background: #E8D9C5; color: #6B5B4E; padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 500; margin-bottom: 20px; }
        .request-number { background: #F0EDE6; padding: 15px 20px; border-radius: 16px; margin: 20px 0; text-align: center; border-left: 4px solid #E09B7E; }
        .request-number strong { color: #E09B7E; font-size: 18px; display: block; margin-bottom: 5px; }
        .field-group { margin: 20px 0; padding-bottom: 15px; border-bottom: 1px solid #EEE8E0; }
        .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #88957F; margin-bottom: 8px; font-weight: 600; }
        .field-value { font-size: 16px; color: #2C2C2C; background: #FDF8F0; padding: 12px 15px; border-radius: 12px; margin-top: 5px; }
        .message-box { background: #FDF8F0; padding: 20px; border-radius: 16px; margin: 15px 0; border: 1px solid #E8D9C5; }
        .message-box p { margin: 0 0 10px; color: #88957F; font-size: 13px; font-weight: 500; }
        .message-box .message-text { color: #2C2C2C; font-size: 15px; line-height: 1.5; margin: 0; }
        .quick-actions { background: #F0EDE6; padding: 20px; border-radius: 16px; margin: 25px 0; }
        .quick-actions h4 { margin: 0 0 12px; color: #6B5B4E; font-size: 14px; }
        .quick-actions a { display: inline-block; margin: 5px 10px 5px 0; padding: 8px 16px; background: #FFFFFF; color: #E09B7E; text-decoration: none; border-radius: 30px; font-size: 13px; font-weight: 500; border: 1px solid #E8D9C5; }
        .quick-actions a:hover { background: #E09B7E; color: white; border-color: #E09B7E; }
        .footer { background: #FDF8F0; padding: 20px 25px; text-align: center; border-top: 1px solid #EEE8E0; color: #88957F; font-size: 12px; }
    </style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h1>🍎 Гармония с едой / Food Harmony</h1>
            <p>Новая заявка на консультацию</p>
        </div>
        
        <div class=\"content\">
            <div class=\"badge\">Новая заявка</div>
            
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
                <div class=\"field-value\"><a href=\"mailto:$email\" style=\"color: #E09B7E; text-decoration: none;\">$email</a></div>
            </div>
            
            <div class=\"field-group\">
                <div class=\"field-label\">🎯 Цель программы</div>
                <div class=\"field-value\">$goalDisplay</div>
            </div>
            
            <div class=\"field-group\">
                <div class=\"field-label\">💬 Сообщение / Что важно учесть</div>
                <div class=\"message-box\">
                    <div class=\"message-text\">" . nl2br(htmlspecialchars($message ?: '—')) . "</div>
                </div>
            </div>
            
            <div class=\"quick-actions\">
                <h4>⚡ Быстрые действия</h4>
                <a href=\"mailto:$email?subject=Re:%20Заявка%20№%20$requestNumber%20(Food%20Harmony)\">📧 Ответить клиенту</a>
            </div>
        </div>
        
        <div class=\"footer\">
            <p>Заявка с сайта Гармония с едой / Food Harmony</p>
            <p>IP: " . ($_SERVER['REMOTE_ADDR'] ?? '—') . "</p>
        </div>
    </div>
</body>
</html>
";

$adminHeaders = $headers;
$adminHeaders .= "From: noreply@foodharmony.ru\r\n";
$adminHeaders .= "Reply-To: $email\r\n";

// Отправляем письмо администратору
$adminEmailSent = @mail($adminEmail, encodeSubject($adminSubject), $adminEmailBody, $adminHeaders);

// ====================================================
// 2. Письмо пользователю (подтверждение в стиле сайта)
// ====================================================
$userSubject = "Гармония с едой / Food Harmony — подтверждение заявки № $requestNumber";

$userEmailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Подтверждение заявки — Гармония с едой / Food Harmony</title>
    <style>
        body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #2C2C2C; background: #FDF8F0; margin: 0; padding: 20px; }
        .container { max-width: 550px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #88957F 0%, #6B7A62 100%); padding: 35px 25px; text-align: center; }
        .header h1 { margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 400; letter-spacing: -0.5px; }
        .header p { margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
        .content { padding: 30px 25px; }
        .thank-you { font-size: 20px; color: #6B5B4E; margin-bottom: 15px; font-weight: 400; }
        .request-number { background: #F0EDE6; padding: 15px 20px; border-radius: 16px; text-align: center; margin: 20px 0; }
        .request-number .number { font-size: 20px; font-weight: 600; color: #E09B7E; letter-spacing: 1px; }
        .request-number .label { font-size: 11px; text-transform: uppercase; color: #88957F; letter-spacing: 1px; }
        .info-box { background: #FDF8F0; padding: 20px; border-radius: 16px; margin: 20px 0; border-left: 3px solid #E09B7E; }
        .info-box p { margin: 8px 0; font-size: 14px; }
        .contact-block { background: #F0EDE6; padding: 20px; border-radius: 16px; margin: 25px 0; text-align: center; }
        .contact-block h3 { color: #6B5B4E; font-size: 16px; margin: 0 0 15px; font-weight: 500; }
        .contact-item { margin: 12px 0; }
        .contact-item a { color: #E09B7E; text-decoration: none; font-weight: 500; }
        .contact-item a:hover { text-decoration: underline; }
        .btn { display: inline-block; background: #E09B7E; color: white; padding: 12px 28px; border-radius: 40px; text-decoration: none; font-weight: 500; margin-top: 10px; }
        .btn:hover { background: #88957F; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEE8E0; text-align: center; }
        .signature p { margin: 5px 0; }
        .footer { background: #FDF8F0; padding: 20px 25px; text-align: center; border-top: 1px solid #EEE8E0; color: #88957F; font-size: 11px; }
    </style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h1>🍃 Гармония с едой</h1>
            <p>Осознанное питание без жёстких правил</p>
        </div>
        
        <div class=\"content\">
            <div class=\"thank-you\">
                Здравствуйте, $name!
            </div>
            
            <p>Спасибо, что выбрали путь осознанного питания. Я получила вашу заявку и скоро свяжусь с вами.</p>
            
            <div class=\"request-number\">
                <div class=\"label\">Номер вашей заявки</div>
                <div class=\"number\">$requestNumber</div>
                <div style=\"font-size: 11px; color: #88957F; margin-top: 5px;\">$timestamp</div>
            </div>
            
            <div class=\"info-box\">
                <p><strong>🎯 Ваша цель:</strong> $goalDisplay</p>
                <p><strong>📧 Email:</strong> $email</p>
            </div>
            
            <p>Я отвечу вам в ближайшее рабочее время (обычно в течение 24 часов). Мы проведём онлайн-встречу, чтобы глубже разобрать ваш запрос, образ жизни и цели.</p>
            
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
            <p style=\"margin-top: 8px;\">Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
";

$userHeaders = $headers;
$userHeaders .= "From: noreply@foodharmony.ru\r\n";
$userHeaders .= "Reply-To: $adminEmail\r\n";

// Отправляем письмо пользователю
$userEmailSent = @mail($email, encodeSubject($userSubject), $userEmailBody, $userHeaders);

// ====================================================
// 3. Отправляем JSON-ответ для React-приложения
// ====================================================
echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Мы вернёмся с ответом в течение рабочего дня.',
    'requestNumber' => $requestNumber,
    'timestamp' => $timestamp,
    'emailsSent' => [
        'admin' => $adminEmailSent,
        'user' => $userEmailSent
    ]
], JSON_UNESCAPED_UNICODE);