<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/config.php';

// Get user ID from query parameter
$userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;

if (!$userId) {
    sendResponse(false, 'User ID is required');
}

try {
    // Verify user exists
    $stmt = $conn->prepare("SELECT id, email, phone FROM users WHERE id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch();
    if (!$user) {
        sendResponse(false, 'User not found', [], 404);
    }

    // Get cart items for the user
    $stmt = $conn->prepare("
        SELECT 
            id, product_id, name, image, description, price, available, size, quantity, created_at
        FROM cart_items 
        WHERE user_id = :userId 
        ORDER BY created_at DESC
    ");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $cartItems = $stmt->fetchAll();
    
    // Calculate total
    $total = 0;
    foreach ($cartItems as $item) {
        $total += $item['price'] * $item['quantity'];
    }
    
    sendResponse(true, 'Cart items retrieved successfully', [
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'phone' => $user['phone']
        ],
        'items' => $cartItems,
        'total' => $total,
        'itemCount' => count($cartItems)
    ]);
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>