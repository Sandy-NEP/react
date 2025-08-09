<?php
// Include the configuration file
require_once '../config/config.php';

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get POST data
$json = file_get_contents('php://input');
error_log('Received JSON: ' . $json); // Log raw JSON
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('JSON decode error: ' . json_last_error_msg());
    sendResponse(false, 'Invalid JSON data received: ' . json_last_error_msg(), [], 400);
}

// Sanitize and validate input
$action = isset($data['action']) ? trim($data['action']) : null;
$userId = isset($data['userId']) ? filter_var($data['userId'], FILTER_VALIDATE_INT) : null;
$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : null;

error_log("Action: $action, UserID: " . var_export($userId, true) . ", Email: $email"); // Log inputs

if (!$action || !in_array($action, ['verify_otp', 'reset_password'])) {
    error_log('Invalid action: ' . $action);
    sendResponse(false, 'Invalid action specified', [], 400);
}

if (!$userId || $userId <= 0 || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("Validation failed - UserID: " . var_export($userId, true) . ", Email: " . var_export($email, true));
    sendResponse(false, 'Valid user ID and email are required', [], 400);
}

// Get client IP address
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
error_log("Client IP: $clientIp");

try {
    if ($action === 'verify_otp') {
        // Validate OTP
        $otp = isset($data['otp']) ? trim($data['otp']) : null;
        error_log("OTP: $otp");
        if (!$otp || !preg_match('/^\d{6}$/', $otp)) {
            error_log('Invalid OTP format');
            sendResponse(false, 'Valid 6-digit OTP is required', [], 400);
        }

        // Check if OTP exists and is valid
        $stmt = $conn->prepare("SELECT id FROM otp WHERE user_id = :user_id AND email = :email AND otp = :otp AND expires_at > NOW()");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':otp', $otp);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            error_log('OTP not found or expired');
            sendResponse(false, 'Invalid OTP or OTP expired', [], 404);
        }

        // OTP is valid, do not delete it yet to allow password reset
        sendResponse(true, 'OTP verified successfully');
    } elseif ($action === 'reset_password') {
        // Validate new password
        $newPassword = isset($data['newPassword']) ? trim($data['newPassword']) : null;
        error_log("New Password: " . (empty($newPassword) ? 'empty' : 'provided'));
        if (!$newPassword || strlen($newPassword) < 8) {
            error_log('Invalid password length');
            sendResponse(false, 'New password must be at least 8 characters', [], 400);
        }

        // Start transaction
        $conn->beginTransaction();

        // Verify user exists and get old password and first_name
        $stmt = $conn->prepare("SELECT first_name, password FROM users WHERE id = :user_id AND email = :email");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            $conn->rollBack();
            error_log('User not found for ID: ' . $userId . ', Email: ' . $email);
            sendResponse(false, 'User not found', [], 404);
        }

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $oldPassword = $user['password'];
        $userName = $user['first_name'];
        error_log("User found - First Name: $userName, Old Password: $oldPassword");

        // Use plain text password
        $plainPassword = $newPassword;

        // Update password in users table
        $stmt = $conn->prepare("UPDATE users SET password = :password WHERE id = :user_id AND email = :email");
        $stmt->bindParam(':password', $plainPassword);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':email', $email);
        if (!$stmt->execute()) {
            $conn->rollBack();
            error_log('Failed to update password');
            sendResponse(false, 'Failed to update password', [], 500);
        }

        // Log password change in pass_update table
        $stmt = $conn->prepare("
            INSERT INTO pass_update (name, gmail, old_pass, new_pass, password_change_time, user_browser_ip)
            VALUES (:name, :gmail, :old_pass, :new_pass, NOW(), :user_browser_ip)
        ");
        $stmt->bindParam(':name', $userName);
        $stmt->bindParam(':gmail', $email);
        $stmt->bindParam(':old_pass', $oldPassword);
        $stmt->bindParam(':new_pass', $plainPassword);
        $stmt->bindParam(':user_browser_ip', $clientIp);
        if (!$stmt->execute()) {
            $conn->rollBack();
            error_log('Failed to log password change');
            sendResponse(false, 'Failed to log password change', [], 500);
        }

        // Delete OTP after successful password reset
        $stmt = $conn->prepare("DELETE FROM otp WHERE user_id = :user_id AND email = :email");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':email', $email);
        if (!$stmt->execute()) {
            $conn->rollBack();
            error_log('Failed to clean up OTP');
            sendResponse(false, 'Failed to clean up OTP', [], 500);
        }

        // Commit transaction
        $conn->commit();
        error_log('Password reset successful');
        sendResponse(true, 'Password updated successfully');
    }
} catch (PDOException $e) {
    $conn->rollBack();
    error_log('Database error: ' . $e->getMessage());
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>