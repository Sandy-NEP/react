<?php
// update_user.php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data received']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE users SET 
            first_name = :firstName,
            last_name = :lastName,
            email = :email,
            phone = :phone,
            is_active = :isActive
        WHERE id = :id
    ");
    
    $stmt->bindParam(':firstName', $data['firstName']);
    $stmt->bindParam(':lastName', $data['lastName']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':isActive', $data['isActive'], PDO::PARAM_BOOL);
    $stmt->bindParam(':id', $data['id']);
    
    if ($stmt->execute()) {
        $stmt = $conn->prepare("
            SELECT 
                id, 
                first_name, 
                middle_name, 
                last_name, 
                email, 
                phone,
                is_active
            FROM users
            WHERE id = :id
        ");
        $stmt->bindParam(':id', $data['id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => $user['id'],
                'firstName' => $user['first_name'],
                'middleName' => $user['middle_name'],
                'lastName' => $user['last_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'isActive' => (bool)$user['is_active']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>