<?php
session_start();
require_once '../config/config.php';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: form.php');
    exit;
}

// Get stats
try {
    // User count
    $stmt = $conn->query("SELECT COUNT(*) as user_count FROM users");
    $userCount = $stmt->fetch(PDO::FETCH_ASSOC)['user_count'];
    
    // Recent users
    $stmt = $conn->query("SELECT * FROM users ORDER BY id DESC LIMIT 5");
    $recentUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    $error = "Database error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Admin Dashboard</h1>
            <div class="admin-actions">
                <a href="admin_panel.php" class="btn">User Management</a>
                <a href="../logout.php" class="btn logout">Logout</a>
            </div>
        </header>

        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <div class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Users</h3>
                <p><?php echo $userCount; ?></p>
            </div>
        </div>

        <div class="recent-users">
            <h2>Recent Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recentUsers as $user): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($user['id']); ?></td>
                        <td><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></td>
                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                        <td><?php echo date('M j, Y', strtotime($user['created_at'] ?? 'now')); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>