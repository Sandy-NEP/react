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
$productId = isset($data['product_id']) ? trim($data['product_id']) : null;

if (!$userId || !$productId) {
    sendResponse(false, 'Missing required fields (userId, product_id)');
}

try {
    // Verify user exists and owns the favorite item
    $stmt = $conn->prepare("
        SELECT f.id 
        FROM favorites f 
        JOIN users u ON f.user_id = u.id 
        WHERE f.product_id = :productId AND u.id = :userId
    ");
    $stmt->bindParam(':productId', $productId);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        sendResponse(false, 'Favorite item not found or access denied', [], 404);
    }

    // Delete the favorite item
    $stmt = $conn->prepare("DELETE FROM favorites WHERE product_id = :productId AND user_id = :userId");
    $stmt->bindParam(':productId', $productId);
    $stmt->bindParam(':userId', $userId);

    if ($stmt->execute()) {
        sendResponse(true, 'Item removed from favorites successfully', [
            'removedProductId' => $productId
        ]);
    } else {
        sendResponse(false, 'Failed to remove item from favorites', [], 500);
    }
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>