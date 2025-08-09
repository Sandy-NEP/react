<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($userId) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Missing userId or password']);
        exit;
    }

    // Check if admin already exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM admins WHERE user_id = ?");
    $stmt->execute([$userId]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Admin already exists']);
        exit;
    }

    // Insert new admin with plain text password (NOT RECOMMENDED)
    $stmt = $conn->prepare("INSERT INTO admins (user_id, password) VALUES (?, ?)");
    $stmt->execute([$userId, $password]);

    echo json_encode(['success' => true, 'message' => 'Admin credentials stored successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>