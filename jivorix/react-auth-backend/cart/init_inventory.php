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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method allowed');
}

// Get JSON input with items data
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['items']) || !is_array($input['items'])) {
    sendResponse(false, 'items array is required');
}

try {
    $conn->beginTransaction();
    
    $initializedItems = [];
    $updatedItems = [];
    
    foreach ($input['items'] as $item) {
        if (!isset($item['_id']) || !isset($item['available'])) {
            continue; // Skip items without required fields
        }
        
        $itemId = trim($item['_id']);
        $quantity = intval($item['available']);
        
        // Check if item already exists in inventory
        $stmt = $conn->prepare("SELECT id, quantity FROM inventory WHERE item_id = :itemId");
        $stmt->bindParam(':itemId', $itemId);
        $stmt->execute();
        
        $result = $stmt->fetch();
        if ($result) {
            // Update existing inventory only if current quantity is 0 or less
            $currentQuantity = intval($result['quantity']);
            if ($currentQuantity <= 0) {
                $stmt = $conn->prepare("UPDATE inventory SET quantity = :quantity, updated_at = NOW() WHERE item_id = :itemId");
                $stmt->bindParam(':quantity', $quantity);
                $stmt->bindParam(':itemId', $itemId);
                $stmt->execute();
                
                $updatedItems[] = [
                    'itemId' => $itemId,
                    'previousQuantity' => $currentQuantity,
                    'newQuantity' => $quantity
                ];
            }
        } else {
            // Insert new inventory record
            $stmt = $conn->prepare("INSERT INTO inventory (item_id, quantity, created_at, updated_at) VALUES (:itemId, :quantity, NOW(), NOW())");
            $stmt->bindParam(':itemId', $itemId);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->execute();
            
            $initializedItems[] = [
                'itemId' => $itemId,
                'quantity' => $quantity
            ];
        }
    }
    
    $conn->commit();
    
    sendResponse(true, 'Inventory initialized successfully', [
        'initializedItems' => $initializedItems,
        'updatedItems' => $updatedItems,
        'totalProcessed' => count($initializedItems) + count($updatedItems)
    ]);
    
} catch(PDOException $e) {
    $conn->rollBack();
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
} catch(Exception $e) {
    $conn->rollBack();
    sendResponse(false, 'Error: ' . $e->getMessage(), [], 500);
}
?>