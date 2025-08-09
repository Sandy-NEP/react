<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
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
$quantity = isset($data['quantity']) ? intval($data['quantity']) : null;

if (!$userId || !$cartItemId || $quantity === null || $quantity < 1) {
    sendResponse(false, 'Missing required fields or invalid quantity (userId, cartItemId, quantity >= 1)');
}

try {
    // Verify user exists and owns the cart item
    $stmt = $conn->prepare("
        SELECT ci.id, ci.name, ci.price 
        FROM cart_items ci 
        JOIN users u ON ci.user_id = u.id 
        WHERE ci.id = :cartItemId AND u.id = :userId
    ");
    $stmt->bindParam(':cartItemId', $cartItemId);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    $cartItem = $stmt->fetch();
    if (!$cartItem) {
        sendResponse(false, 'Cart item not found or access denied', [], 404);
    }

    // Update the quantity
    $stmt = $conn->prepare("
        UPDATE cart_items 
        SET quantity = :quantity 
        WHERE id = :cartItemId AND user_id = :userId
    ");
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':cartItemId', $cartItemId);
    $stmt->bindParam(':userId', $userId);

    if ($stmt->execute()) {
        sendResponse(true, 'Cart item quantity updated successfully', [
            'cartItemId' => $cartItemId,
            'newQuantity' => $quantity,
            'itemName' => $cartItem['name'],
            'itemTotal' => $cartItem['price'] * $quantity
        ]);
    } else {
        sendResponse(false, 'Failed to update cart item quantity', [], 500);
    }
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>