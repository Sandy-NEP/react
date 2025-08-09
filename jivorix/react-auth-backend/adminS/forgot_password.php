<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require_once '../config/config.php';

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $resetCode = rand(100000, 999999); 

    try {
        $stmt = $conn->prepare("SELECT * FROM admins WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() === 1) {
            $user = $stmt->fetch();
            $to = 'sg9816062923@gmail.com'; // Always send to your Gmail
            $subject = 'Admin Password Reset Request';
            $message = "<p><strong>Reset code for admin: $username</strong></p><p>Code: <code>$resetCode</code></p>";

            // Call your SMTP server
            $payload = json_encode([
                'to' => $to,
                'subject' => $subject,
                'message' => $message
            ]);

            $ch = curl_init('http://localhost:3000/send-mail');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($http_code == 200) {
                $_SESSION['reset_user'] = $username;
                $_SESSION['reset_code'] = $resetCode;
                header("Location: reset_password.php");
                exit;
            } else {
                $error = "Failed to send reset email.";
            }
        } else {
            $error = "Username not found.";
        }
    } catch (PDOException $e) {
        $error = "DB error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="login-container">
    <h1>Forgot Password</h1>
    <?php if (!empty($error)): ?><div class="error-message"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <?php if (!empty($success)): ?><div class="success-message"><?= htmlspecialchars($success) ?></div><?php endif; ?>

    <form method="POST">
        <label for="username">Enter Admin Username:</label>
        <input type="text" name="username" id="username" required>
        <button type="submit">Send Reset Code</button>
    </form>
</div>
</body>
</html>
