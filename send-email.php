<?php
declare(strict_types=1);

/**
 * PSPH - send-email.php
 * - Expects camelCase form fields: firstName, lastName, email, appointment, topic, otherTopic, phone, schoolDistrict, school
 * - Sends a styled confirmation email to the user (from /emails/confirmation-email.html)
 * - Sends a plain HTML notification to ADMIN_TO
 * - Returns JSON only
 */

header('Content-Type: application/json');

// Uncomment during local dev (set origin correctly)
// header('Access-Control-Allow-Origin: https://psph.org');
// header('Access-Control-Allow-Methods: POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type');
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// ---- Error logging ----
error_reporting(E_ALL);
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/php-error.log');

// ========================
//   SMTP CONFIG 
// ========================
const SMTP_HOST   = 'mail.spaceship.com';
const SMTP_USER   = 'appointment@psph.org';
const SMTP_PASS   = 'GLK5umB2AvS1!';
const SMTP_PORT   = 465;
const SMTP_SECURE = 'smtps';

const FROM_EMAIL  = 'appointment@psph.org';
const FROM_NAME   = 'PSPH';
const ADMIN_TO    = 'hello@psph.org';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/src/Exception.php';
require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';

// Helpers
function post(string $k): string { return isset($_POST[$k]) ? trim((string)$_POST[$k]) : ''; }
function pick(string ...$keys): string {
  foreach ($keys as $k) { if (isset($_POST[$k]) && trim((string)$_POST[$k]) !== '') return trim((string)$_POST[$k]); }
  return '';
}

// Handle multiple topics 
function getTopic(): string {
  if (isset($_POST['topic'])) {
    if (is_array($_POST['topic'])) {
      $topics = array_filter(array_map('trim', $_POST['topic']), fn($t) => $t !== '');
      return implode(', ', $topics);
    } else {
      return trim((string)$_POST['topic']);
    }
  }
}

// Read fields
$firstName      = pick('firstName', 'First Name', 'First_Name');
$lastName       = pick('lastName',  'Last Name',  'Last_Name');
$email          = pick('email', '_replyto');
$phone          = pick('phone', 'Phone Number', 'Phone');
$schoolDistrict = pick('schoolDistrict', 'School District');
$school         = pick('school', 'School');
$topic          = getTopic();
$otherTopic     = pick('otherTopic', 'Other Topic Details');
$appointment    = pick('appointment', 'Proposed Appointment Time');

// Normalize topic (expand "Other")
if (strpos($topic, 'Other') !== false && $otherTopic !== '') { 
  $topic = str_replace('Other', $otherTopic, $topic); 
}

$displayTopic = $topic;

// Honeypot 
if (post('website') !== '') {
  echo json_encode(['ok' => true]); // pretend success
  exit;
}

// Validate required fields
if ($firstName === '' || $lastName === '' || $appointment === '' || $topic === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode([
    'ok' => false,
    'error' => 'Missing or invalid required fields',
    'debug' => [
      'firstName'   => $firstName !== '',
      'lastName'    => $lastName !== '',
      'email'       => $email,
      'appointment' => $appointment !== '',
      'topic'       => $topic !== ''
    ],
    // 'post_keys' => array_keys($_POST), // uncomment briefly if you need to debug incoming keys
  ]);
  exit;
}

$fullName    = $firstName . ' ' . $lastName;
$apptDisplay = $appointment; // optionally format server-side if desired (keep as-is for consistency)

// Load user HTML email template and replace tokens
$templatePath = __DIR__ . '/emails/confirmation-email.html';
$userHtml = file_exists($templatePath) ? file_get_contents($templatePath) : '';

$replacements = [
  '{{FULL_NAME}}'   => htmlspecialchars($fullName,    ENT_QUOTES, 'UTF-8'),
  '{{APPOINTMENT}}' => htmlspecialchars($apptDisplay, ENT_QUOTES, 'UTF-8'),
  '{{TOPIC}}'       => htmlspecialchars($displayTopic,ENT_QUOTES, 'UTF-8'),
];
$userHtml = strtr($userHtml, $replacements);
if (!$userHtml) {
  $userHtml = "<p>Hello ".htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8').",</p>"
            . "<p>Your appointment: ".htmlspecialchars($apptDisplay, ENT_QUOTES, 'UTF-8')."</p>"
            . "<p>Topic: ".htmlspecialchars($displayTopic, ENT_QUOTES, 'UTF-8')."</p>";
}

// Build admin notification (HTML + Alt)
$adminSubject = "New Appointment: {$fullName}";
$adminText = "Name: {$fullName}\nEmail: {$email}\nPhone: {$phone}\n"
           . "District: {$schoolDistrict}\nSchool: {$school}\n"
           . "Topic: {$displayTopic}\nAppointment: {$apptDisplay}\n";
$adminHtml = nl2br(htmlspecialchars($adminText, ENT_QUOTES, 'UTF-8'));

// === Configure PHPMailer (SMTP) ===
function newMailer(): PHPMailer {
  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host       = 'mail.spacemail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'appointment@psph.org';
  $mail->Password   = 'GLK5umB2AvS1!';   // same password that worked before
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SMTPS on 465
  $mail->Port       = 465;
  $mail->CharSet    = 'UTF-8';
  return $mail;
}

try {
  // 1) Confirmation to the user
  $userMail = newMailer();
  $userMail->setFrom('appointment@psph.org', 'PSPH');
  $userMail->Sender  = 'appointment@psph.org';
  $userMail->addAddress($email, $firstName . ' ' . $lastName);
  $userMail->addReplyTo('hello@psph.org', 'PSPH');
  $userMail->isHTML(true);
  $userMail->Subject = 'Your Appointment is Confirmed';
  $userMail->Body    = $userHtml;
  $userMail->AltBody = "Hello {$firstName},\n\nAppointment: {$appointment}\nTopic: {$displayTopic}";
  $userMail->send();

  // 2) Notification to the team
  $notify = newMailer();
  $notify->setFrom('appointment@psph.org', 'PSPH');
  $notify->Sender  = 'appointment@psph.org';
  $notify->addAddress('hello@psph.org', 'PSPH');
  $notify->addReplyTo($email, $firstName . ' ' . $lastName);
  $notify->isHTML(true);
  $notify->Subject = "New Appointment: {$firstName} {$lastName}";
  $notify->Body    = nl2br(htmlspecialchars($adminText, ENT_QUOTES, 'UTF-8'));
  $notify->AltBody = $adminText;
  $notify->send();

  echo json_encode(['ok' => true]);

} catch (Exception $e) {
  error_log('Mailer exception: ' . $e->getMessage());
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mail send failed']);
}
