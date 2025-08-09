<?php
// Include the configuration file
require_once '../config/config.php';

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Function to generate a 6-digit OTP
function generateOTP() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Invalid JSON data received', [], 400);
}

// Sanitize and validate input
$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : null;

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Valid email is required', [], 400);
}

try {
    // Clean up expired OTPs (older than 10 minutes)
    $stmt = $conn->prepare("DELETE FROM otp WHERE expires_at < NOW()");
    $stmt->execute();

    // Rate limiting: Check reset attempts from the same IP
    $ip = $_SERVER['REMOTE_ADDR'];
    $stmt = $conn->prepare("SELECT COUNT(*) as attempts FROM otp WHERE ip = :ip AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $stmt->bindParam(':ip', $ip);
    $stmt->execute();
    $attempts = $stmt->fetchColumn();

    if ($attempts >= 5) {
        sendResponse(false, 'Too many attempts. Please try again later.', [], 429);
    }

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, first_name FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        // Log attempt for rate limiting
        $stmt = $conn->prepare("INSERT INTO otp (email, ip, created_at) VALUES (:email, :ip, NOW())");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':ip', $ip);
        $stmt->execute();
        sendResponse(false, 'No account found with this email', [], 404);
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $userId = $user['id'];
    $name = $user['first_name'];

    // Generate OTP
    $otp = generateOTP();

    // Store OTP in database
    $stmt = $conn->prepare("INSERT INTO otp (user_id, email, otp, first_name, ip, created_at, expires_at) VALUES (:user_id, :email, :otp, :first_name, :ip, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':otp', $otp);
    $stmt->bindParam(':first_name', $name);
    $stmt->bindParam(':ip', $ip);

    if (!$stmt->execute()) {
        sendResponse(false, 'Failed to store OTP', [], 500);
    }

    // Return success response with OTP
    sendResponse(true, 'OTP generated successfully', [
        'userId' => $userId,
        'name' => $name,
        'email' => $email,
        'otp' => $otp
    ]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    sendResponse(false, 'Database error occurred: ' . $e->getMessage(), [], 500);
}
?>