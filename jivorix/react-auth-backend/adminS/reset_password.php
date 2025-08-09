<?php
session_start();
require_once '../config/config.php';

if (!isset($_SESSION['reset_user'], $_SESSION['reset_code'])) {
    header("Location: forgot_password.php");
    exit;
}

$error = $success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = trim($_POST['code']);
    $newPassword = trim($_POST['new_password']);

    if ($code == $_SESSION['reset_code']) {
        try {
            $stmt = $conn->prepare("UPDATE admins SET password = :password WHERE username = :username");
            $stmt->bindParam(':password', $newPassword);
            $stmt->bindParam(':username', $_SESSION['reset_user']);
            $stmt->execute();

            $success = "Password reset successful!";
            unset($_SESSION['reset_user'], $_SESSION['reset_code']);
        } catch (PDOException $e) {
            $error = "Error: " . $e->getMessage();
        }
    } else {
        $error = "Incorrect reset code!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="login-container">
    <h1>Reset Password</h1>
    <?php if (!empty($error)): ?><div class="error-message"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <?php if (!empty($success)): ?><div class="success-message"><?= htmlspecialchars($success) ?></div><?php endif; ?>

    <form method="POST">
        <label for="code">Reset Code (Check Gmail):</label>
        <input type="text" name="code" id="code" required>

        <label for="new_password">New Password:</label>
        <input type="text" name="new_password" id="new_password" required>

        <button type="submit">Reset</button>
    </form>
</div>
</body>
</html>
