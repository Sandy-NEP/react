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
$cartItemId = isset($data['cartItemId']) ? trim($data['cartItemId']) : null;

if (!$userId || !$cartItemId) {
    sendResponse(false, 'Missing required fields (userId, cartItemId)');
}

try {
    // Verify user exists and owns the cart item
    $stmt = $conn->prepare("
        SELECT ci.id 
        FROM cart_items ci 
        JOIN users u ON ci.user_id = u.id 
        WHERE ci.id = :cartItemId AND u.id = :userId
    ");
    $stmt->bindParam(':cartItemId', $cartItemId);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        sendResponse(false, 'Cart item not found or access denied', [], 404);
    }

    // Delete the cart item
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE id = :cartItemId AND user_id = :userId");
    $stmt->bindParam(':cartItemId', $cartItemId);
    $stmt->bindParam(':userId', $userId);

    if ($stmt->execute()) {
        sendResponse(true, 'Item removed from cart successfully', [
            'removedItemId' => $cartItemId
        ]);
    } else {
        sendResponse(false, 'Failed to remove item from cart', [], 500);
    }
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>