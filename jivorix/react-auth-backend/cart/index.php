<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parse the request to determine the action
$action = 'view'; // default action

// Check if there's an action in the query string
if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

switch ($method) {
    case 'GET':
        handleGetRequest($action);
        break;
    case 'POST':
        handlePostRequest($action);
        break;
    case 'PUT':
        handlePutRequest($action);
        break;
    case 'DELETE':
        handleDeleteRequest($action);
        break;
    default:
        sendResponse(false, 'Method not allowed');
}

function handleGetRequest($action) {
    global $conn;
    
    switch ($action) {
        case 'view':
        case 'get':
            getCartItems();
            break;
        case 'count':
            getCartCount();
            break;
        default:
            getCartItems();
    }
}

function handlePostRequest($action) {
    global $conn;
    
    switch ($action) {
        case 'add':
            addToCart();
            break;
        case 'checkout':
            // Redirect to checkout.php
            include 'checkout.php';
            break;
        default:
            addToCart();
    }
}

function handlePutRequest($action) {
    global $conn;
    
    switch ($action) {
        case 'update':
        case 'quantity':
            updateCartItemQuantity();
            break;
        default:
            updateCartItemQuantity();
    }
}

function handleDeleteRequest($action) {
    global $conn;
    
    switch ($action) {
        case 'remove':
        case 'delete':
            removeFromCart();
            break;
        case 'clear':
            clearCart();
            break;
        default:
            removeFromCart();
    }
}

function getCartItems() {
    global $conn;
    
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
}

function getCartCount() {
    global $conn;
    
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    
    if (!$userId) {
        sendResponse(false, 'User ID is required');
    }
    
    try {
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM cart_items WHERE user_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        
        $result = $stmt->fetch();
        
        sendResponse(true, 'Cart count retrieved successfully', [
            'count' => intval($result['count'])
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function addToCart() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $requiredFields = ['userId', 'productId', 'name', 'price', 'available'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || (is_string($input[$field]) && empty(trim($input[$field])))) {
            sendResponse(false, "Field '$field' is required");
        }
    }
    
    $userId = trim($input['userId']);
    $productId = trim($input['productId']);
    $name = trim($input['name']);
    $image = isset($input['image']) ? trim($input['image']) : null;
    $description = isset($input['description']) ? trim($input['description']) : null;
    $price = floatval($input['price']);
    $available = intval($input['available']);
    $size = isset($input['size']) ? trim($input['size']) : null;
    $quantity = isset($input['quantity']) ? intval($input['quantity']) : 1;
    
    if ($quantity <= 0) {
        sendResponse(false, 'Quantity must be greater than 0');
    }
    
    if ($quantity > $available) {
        sendResponse(false, 'Requested quantity exceeds available stock');
    }
    
    try {
        // Check if item already exists in cart
        $stmt = $conn->prepare("
            SELECT id, quantity FROM cart_items 
            WHERE user_id = :userId AND product_id = :productId AND size = :size
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':productId', $productId);
        $stmt->bindParam(':size', $size);
        $stmt->execute();
        
        $existingItem = $stmt->fetch();
        
        if ($existingItem) {
            // Update existing item quantity
            $newQuantity = $existingItem['quantity'] + $quantity;
            
            if ($newQuantity > $available) {
                sendResponse(false, 'Total quantity would exceed available stock');
            }
            
            $stmt = $conn->prepare("
                UPDATE cart_items 
                SET quantity = :quantity 
                WHERE id = :id
            ");
            $stmt->bindParam(':quantity', $newQuantity);
            $stmt->bindParam(':id', $existingItem['id']);
            $stmt->execute();
            
            sendResponse(true, 'Cart item quantity updated successfully', [
                'itemId' => $existingItem['id'],
                'newQuantity' => $newQuantity
            ]);
        } else {
            // Add new item to cart
            $stmt = $conn->prepare("
                INSERT INTO cart_items 
                (user_id, product_id, name, image, description, price, available, size, quantity)
                VALUES 
                (:userId, :productId, :name, :image, :description, :price, :available, :size, :quantity)
            ");
            $stmt->bindParam(':userId', $userId);
            $stmt->bindParam(':productId', $productId);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':image', $image);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':available', $available);
            $stmt->bindParam(':size', $size);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->execute();
            
            $itemId = $conn->lastInsertId();
            
            sendResponse(true, 'Item added to cart successfully', [
                'itemId' => $itemId
            ]);
        }
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function updateCartItemQuantity() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['itemId']) || !isset($input['quantity'])) {
        sendResponse(false, 'Item ID and quantity are required');
    }
    
    $itemId = intval($input['itemId']);
    $quantity = intval($input['quantity']);
    
    if ($quantity <= 0) {
        sendResponse(false, 'Quantity must be greater than 0');
    }
    
    try {
        // Get current item details
        $stmt = $conn->prepare("SELECT available FROM cart_items WHERE id = :itemId");
        $stmt->bindParam(':itemId', $itemId);
        $stmt->execute();
        
        $item = $stmt->fetch();
        if (!$item) {
            sendResponse(false, 'Cart item not found', [], 404);
        }
        
        if ($quantity > $item['available']) {
            sendResponse(false, 'Requested quantity exceeds available stock');
        }
        
        // Update quantity
        $stmt = $conn->prepare("UPDATE cart_items SET quantity = :quantity WHERE id = :itemId");
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':itemId', $itemId);
        $stmt->execute();
        
        sendResponse(true, 'Cart item quantity updated successfully', [
            'itemId' => $itemId,
            'newQuantity' => $quantity
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function removeFromCart() {
    global $conn;
    
    $itemId = isset($_GET['itemId']) ? intval($_GET['itemId']) : null;
    
    if (!$itemId) {
        sendResponse(false, 'Item ID is required');
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM cart_items WHERE id = :itemId");
        $stmt->bindParam(':itemId', $itemId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Item removed from cart successfully');
        } else {
            sendResponse(false, 'Cart item not found', [], 404);
        }
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function clearCart() {
    global $conn;
    
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    
    if (!$userId) {
        sendResponse(false, 'User ID is required');
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        
        sendResponse(true, 'Cart cleared successfully', [
            'removedItems' => $stmt->rowCount()
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}
?>