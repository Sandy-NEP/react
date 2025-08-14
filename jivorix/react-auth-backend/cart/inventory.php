<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/config.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetInventory();
        break;
    case 'POST':
        handleUpdateInventory();
        break;
    case 'PUT':
        handleReduceInventory();
        break;
    default:
        sendResponse(false, 'Method not allowed');
}

function handleGetInventory() {
    global $conn;
    
    $itemId = isset($_GET['itemId']) ? trim($_GET['itemId']) : null;
    
    try {
        if ($itemId) {
            // Get inventory for specific item
            $stmt = $conn->prepare("SELECT item_id, quantity FROM inventory WHERE item_id = :itemId");
            $stmt->bindParam(':itemId', $itemId);
            $stmt->execute();
            
            $result = $stmt->fetch();
            if ($result) {
                sendResponse(true, 'Inventory retrieved successfully', [
                    'itemId' => $result['item_id'],
                    'quantity' => intval($result['quantity'])
                ]);
            } else {
                sendResponse(false, 'Item not found in inventory', [], 404);
            }
        } else {
            // Get all inventory
            $stmt = $conn->prepare("SELECT item_id, quantity FROM inventory ORDER BY item_id");
            $stmt->execute();
            
            $inventory = [];
            while ($row = $stmt->fetch()) {
                $inventory[$row['item_id']] = intval($row['quantity']);
            }
            
            sendResponse(true, 'All inventory retrieved successfully', [
                'inventory' => $inventory
            ]);
        }
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function handleUpdateInventory() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['itemId']) || !isset($input['quantity'])) {
        sendResponse(false, 'itemId and quantity are required');
    }
    
    $itemId = trim($input['itemId']);
    $quantity = intval($input['quantity']);
    
    if ($quantity < 0) {
        sendResponse(false, 'Quantity cannot be negative');
    }
    
    try {
        // Check if item exists in inventory
        $stmt = $conn->prepare("SELECT id FROM inventory WHERE item_id = :itemId");
        $stmt->bindParam(':itemId', $itemId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            // Update existing inventory
            $stmt = $conn->prepare("UPDATE inventory SET quantity = :quantity, updated_at = NOW() WHERE item_id = :itemId");
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':itemId', $itemId);
            $stmt->execute();
            
            sendResponse(true, 'Inventory updated successfully', [
                'itemId' => $itemId,
                'quantity' => $quantity
            ]);
        } else {
            // Insert new inventory record
            $stmt = $conn->prepare("INSERT INTO inventory (item_id, quantity, created_at, updated_at) VALUES (:itemId, :quantity, NOW(), NOW())");
            $stmt->bindParam(':itemId', $itemId);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->execute();
            
            sendResponse(true, 'Inventory created successfully', [
                'itemId' => $itemId,
                'quantity' => $quantity
            ]);
        }
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function handleReduceInventory() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['items']) || !is_array($input['items'])) {
        sendResponse(false, 'items array is required');
    }
    
    try {
        $conn->beginTransaction();
        
        $updatedItems = [];
        
        foreach ($input['items'] as $item) {
            if (!isset($item['product_id']) || !isset($item['quantity'])) {
                $conn->rollBack();
                sendResponse(false, 'Each item must have product_id and quantity');
            }
            
            $itemId = trim($item['product_id']);
            $quantityToReduce = intval($item['quantity']);
            
            if ($quantityToReduce <= 0) {
                continue; // Skip items with zero or negative quantity
            }
            
            // Get current inventory
            $stmt = $conn->prepare("SELECT quantity FROM inventory WHERE item_id = :itemId");
            $stmt->bindParam(':itemId', $itemId);
            $stmt->execute();
            
            $result = $stmt->fetch();
            if (!$result) {
                $conn->rollBack();
                sendResponse(false, "Item $itemId not found in inventory");
            }
            
            $currentQuantity = intval($result['quantity']);
            $newQuantity = max(0, $currentQuantity - $quantityToReduce);
            
            // Update inventory
            $stmt = $conn->prepare("UPDATE inventory SET quantity = :quantity, updated_at = NOW() WHERE item_id = :itemId");
            $stmt->bindParam(':quantity', $newQuantity);
            $stmt->bindParam(':itemId', $itemId);
            $stmt->execute();
            
            $updatedItems[] = [
                'itemId' => $itemId,
                'previousQuantity' => $currentQuantity,
                'reducedBy' => $quantityToReduce,
                'newQuantity' => $newQuantity
            ];
        }
        
        $conn->commit();
        
        sendResponse(true, 'Inventory reduced successfully', [
            'updatedItems' => $updatedItems
        ]);
        
    } catch(PDOException $e) {
        $conn->rollBack();
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}
?>