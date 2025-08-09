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

    // Get favorite items for the user
    $stmt = $conn->prepare("
        SELECT 
            id, product_id, name, image, description, price, original_price, category, gender, available, created_at
        FROM favorites 
        WHERE user_id = :userId 
        ORDER BY created_at DESC
    ");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $favoriteItems = $stmt->fetchAll();
    
    // Format items to match frontend structure
    $formattedItems = array_map(function($item) {
        return [
            'id' => $item['id'],
            '_id' => $item['product_id'],
            'name' => $item['name'],
            'image' => $item['image'],
            'desc' => $item['description'],
            'sp' => $item['price'],
            'cp' => $item['original_price'],
            'category' => $item['category'],
            'gender' => $item['gender'],
            'available' => $item['available'],
            'created_at' => $item['created_at']
        ];
    }, $favoriteItems);
    
    sendResponse(true, 'Favorite items retrieved successfully', [
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'phone' => $user['phone']
        ],
        'items' => $formattedItems,
        'itemCount' => count($formattedItems)
    ]);
    
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>