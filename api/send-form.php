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
$goal = isset($data['goal']) ? trim(strip_tags($data['goal'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

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
$logEntry = "========== НОВАЯ ЗАЯВКА ==========\n";
$logEntry .= "Номер: $requestNumber\n";
$logEntry .= "Дата: $timestamp\n";
$logEntry .= "Имя: $name\n";
$logEntry .= "Email: $email\n";
$logEntry .= "Цель: $goalDisplay\n";
$logEntry .= "Сообщение:\n$message\n";
$logEntry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Неизвестно') . "\n";
$logEntry .= "================================\n\n";

$logFile = __DIR__ . '/food_harmony_submissions.log';
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Функция для отправки через SMTP Яндекс
function sendSMTP($to, $subject, $body, $replyTo = null) {
    // Настройки SMTP Яндекса
    $smtpHost = 'ssl://smtp.yandex.ru';
    $smtpPort = 465;
    $smtpUser = 'foodharmony@yandex.ru';
    $smtpPass = 'fekbrqycuyzzleel'; // ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ПАРОЛЬ!
    
    $fromName = 'Food Harmony';
    $fromEmail = 'foodharmony@yandex.ru';
    
    // Формируем письмо
    $eol = "\r\n";
    $boundary = md5(time());
    
    $headers = "MIME-Version: 1.0" . $eol;
    $headers .= "Content-Type: text/html; charset=utf-8" . $eol;
    $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$fromEmail>" . $eol;
    if ($replyTo) {
        $headers .= "Reply-To: $replyTo" . $eol;
    }
    $headers .= "Date: " . date('r') . $eol;
    
    $subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    
    $content = $headers . $eol . $body;
    
    // Отправляем через сокет
    $socket = fsockopen($smtpHost, $smtpPort, $errno, $errstr, 30);
    
    if (!$socket) {
        error_log("SMTP connection failed: $errstr ($errno)");
        return false;
    }
    
    // HELO
    fgets($socket, 515);
    fputs($socket, "EHLO " . $_SERVER['HTTP_HOST'] . $eol);
    fgets($socket, 515);
    
    // AUTH LOGIN
    fputs($socket, "AUTH LOGIN" . $eol);
    fgets($socket, 515);
    fputs($socket, base64_encode($smtpUser) . $eol);
    fgets($socket, 515);
    fputs($socket, base64_encode($smtpPass) . $eol);
    fgets($socket, 515);
    
    // MAIL FROM
    fputs($socket, "MAIL FROM: <$fromEmail>" . $eol);
    fgets($socket, 515);
    
    // RCPT TO
    fputs($socket, "RCPT TO: <$to>" . $eol);
    fgets($socket, 515);
    
    // DATA
    fputs($socket, "DATA" . $eol);
    fgets($socket, 515);
    fputs($socket, "To: $to" . $eol);
    fputs($socket, "Subject: $subjectEncoded" . $eol);
    fputs($socket, $headers . $eol);
    fputs($socket, $body . $eol);
    fputs($socket, "." . $eol);
    $result = fgets($socket, 515);
    
    // QUIT
    fputs($socket, "QUIT" . $eol);
    fclose($socket);
    
    return strpos($result, '250') !== false;
}

// Функция для отправки через mail() с дополнительными заголовками
function sendMail($to, $subject, $body, $replyTo = null) {
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8\r\n";
    $headers .= "From: foodharmony@yandex.ru\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    if ($replyTo) {
        $headers .= "Reply-To: $replyTo\r\n";
    }
    
    $subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    
    return @mail($to, $subjectEncoded, $body, $headers, "-ffoodharmony@yandex.ru");
}

// Формируем тело письма для администратора
$adminEmailBody = "
<!DOCTYPE html>
<html>
<head><meta charset=\"UTF-8\"><title>Новая заявка</title></head>
<body style=\"font-family: Georgia, serif; background: #FDF8F0; padding: 20px;\">
<div style=\"max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden;\">
<div style=\"background: #88957F; padding: 30px; text-align: center; color: white;\">
<h1>🍎 Food Harmony</h1>
<p>Новая заявка на консультацию</p>
</div>
<div style=\"padding: 30px;\">
<p><strong>Номер заявки:</strong> $requestNumber</p>
<p><strong>Дата:</strong> $timestamp</p>
<p><strong>Имя:</strong> $name</p>
<p><strong>Email:</strong> <a href=\"mailto:$email\">$email</a></p>
<p><strong>Цель:</strong> $goalDisplay</p>
<p><strong>Сообщение:</strong><br>" . nl2br(htmlspecialchars($message ?: '—')) . "</p>
</div>
</div>
</body>
</html>
";

// Формируем тело письма для пользователя
$userEmailBody = "
<!DOCTYPE html>
<html>
<head><meta charset=\"UTF-8\"><title>Подтверждение заявки</title></head>
<body style=\"font-family: Georgia, serif; background: #FDF8F0; padding: 20px;\">
<div style=\"max-width: 550px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden;\">
<div style=\"background: #88957F; padding: 35px; text-align: center; color: white;\">
<h1>🍃 Гармония с едой</h1>
</div>
<div style=\"padding: 30px;\">
<h2>Здравствуйте, $name!</h2>
<p>Спасибо, что выбрали путь осознанного питания. Я получила вашу заявку и скоро свяжусь с вами.</p>
<p><strong>Номер заявки:</strong> $requestNumber</p>
<p><strong>Ваша цель:</strong> $goalDisplay</p>
<p>Я отвечу вам в ближайшее рабочее время (обычно в течение 24 часов).</p>
<hr>
<p>С заботой о вашем здоровье,<br><strong>Николаева Анна</strong><br>Дипломированный нутрициолог</p>
</div>
<div style=\"background: #FDF8F0; padding: 20px; text-align: center; color: #88957F; font-size: 12px;\">
<p>© $currentYear Гармония с едой / Food Harmony</p>
</div>
</div>
</body>
</html>
";

// Пробуем отправить через mail()
$adminSubject = "Заявка с сайта Food Harmony № $requestNumber";
$userSubject = "Food Harmony — подтверждение заявки № $requestNumber";

$adminEmailSent = sendMail($adminEmail, $adminSubject, $adminEmailBody, $email);
$userEmailSent = sendMail($email, $userSubject, $userEmailBody, $adminEmail);

// Если mail() не сработал, пробуем SMTP
if (!$adminEmailSent) {
    $adminEmailSent = sendSMTP($adminEmail, $adminSubject, $adminEmailBody, $email);
}
if (!$userEmailSent) {
    $userEmailSent = sendSMTP($email, $userSubject, $userEmailBody, $adminEmail);
}

// Записываем результат в лог
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Отправка админу: " . ($adminEmailSent ? 'OK' : 'FAIL') . "\n", FILE_APPEND);
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Отправка пользователю: " . ($userEmailSent ? 'OK' : 'FAIL') . "\n", FILE_APPEND);

// Ответ
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