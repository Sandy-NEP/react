<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/config.php';

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Invalid JSON data received');
}

$userId = isset($data['userId']) ? trim($data['userId']) : null;

if (!$userId) {
    sendResponse(false, 'Missing required field (userId)');
}

try {
    // Verify user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        sendResponse(false, 'User not found', [], 404);
    }

    // Delete all favorite items for the user
    $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = :userId");
    $stmt->bindParam(':userId', $userId);

    if ($stmt->execute()) {
        $deletedCount = $stmt->rowCount();
        sendResponse(true, 'All favorites cleared successfully', [
            'deletedCount' => $deletedCount
        ]);
    } else {
        sendResponse(false, 'Failed to clear favorites', [], 500);
    }
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>