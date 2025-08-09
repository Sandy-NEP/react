<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Sanitize and validate input
$userId = isset($data['userId']) ? trim($data['userId']) : null;
$productId = isset($data['product_id']) ? trim($data['product_id']) : null;
$name = isset($data['name']) ? trim($data['name']) : null;
$image = isset($data['image']) ? trim($data['image']) : null;
$desc = isset($data['desc']) ? trim($data['desc']) : null;
$price = isset($data['sp']) ? trim($data['sp']) : null;
$originalPrice = isset($data['cp']) ? trim($data['cp']) : null;
$category = isset($data['category']) ? trim($data['category']) : null;
$gender = isset($data['gender']) ? trim($data['gender']) : null;
$available = isset($data['available']) ? intval($data['available']) : null;

if (!$userId || !$productId || !$name || !$price) {
    sendResponse(false, 'Missing required fields (userId, product_id, name, price)');
}

try {
    // Verify user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        sendResponse(false, 'User not found', [], 404);
    }

    // Check if product already exists in favorites for this user
    $stmt = $conn->prepare("SELECT id FROM favorites WHERE user_id = :userId AND product_id = :productId");
    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':productId', $productId);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Product already in favorites');
    }

    // Insert favorite item
    $stmt = $conn->prepare("
        INSERT INTO favorites (
            user_id, product_id, name, image, description, price, original_price, category, gender, available, created_at
        ) VALUES (
            :userId, :productId, :name, :image, :description, :price, :originalPrice, :category, :gender, :available, NOW()
        )
    ");
    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':productId', $productId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':image', $image);
    $stmt->bindParam(':description', $desc);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':originalPrice', $originalPrice);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':available', $available);

    if ($stmt->execute()) {
        $favoriteId = $conn->lastInsertId();
        sendResponse(true, 'Item added to favorites successfully', [
            'favoriteId' => $favoriteId,
            'productId' => $productId,
            'name' => $name
        ]);
    } else {
        sendResponse(false, 'Failed to add item to favorites', [], 500);
    }
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
}
?>