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
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

switch ($method) {
    case 'GET':
        handleGetRequest($action);
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
    switch ($action) {
        case 'list':
            getUserOrderHistory();
            break;
        case 'details':
            getOrderDetails();
            break;
        case 'status':
            getOrderStatus();
            break;
        default:
            getUserOrderHistory();
    }
}

function handlePutRequest($action) {
    switch ($action) {
        case 'status':
            updateOrderStatus();
            break;
        default:
            sendResponse(false, 'Invalid action for PUT request');
    }
}

function handleDeleteRequest($action) {
    switch ($action) {
        case 'cancel':
            cancelOrder();
            break;
        default:
            sendResponse(false, 'Invalid action for DELETE request');
    }
}

function getUserOrderHistory() {
    global $conn;
    
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    $status = isset($_GET['status']) ? trim($_GET['status']) : null;
    
    if (!$userId) {
        sendResponse(false, 'User ID is required');
    }
    
    try {
        // Verify user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        
        if (!$stmt->fetch()) {
            sendResponse(false, 'User not found', [], 404);
        }
        
        $allOrders = [];
        
        // Get orders from paymentondelivery table
        $codQuery = "
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                'pending' as order_status, 'paymentondelivery' as table_source
            FROM paymentondelivery 
            WHERE user_id = :userId
        ";
        
        // Get orders from onlinepayment table
        $onlineQuery = "
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                payment_gateway, gateway_transaction_id, payment_status as order_status,
                'onlinepayment' as table_source
            FROM onlinepayment 
            WHERE user_id = :userId
        ";
        
        // Get orders from creditcardpayment table
        $cardQuery = "
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                card_last_four, card_type, payment_processor, processor_transaction_id, 
                payment_status as order_status, 'creditcardpayment' as table_source
            FROM creditcardpayment 
            WHERE user_id = :userId
        ";
        
        // Add status filter if provided
        if ($status) {
            $codQuery .= " AND 'pending' = :status";
            $onlineQuery .= " AND payment_status = :status";
            $cardQuery .= " AND payment_status = :status";
        }
        
        // Add ordering and pagination
        $codQuery .= " ORDER BY order_date DESC LIMIT :limit OFFSET :offset";
        $onlineQuery .= " ORDER BY order_date DESC LIMIT :limit OFFSET :offset";
        $cardQuery .= " ORDER BY order_date DESC LIMIT :limit OFFSET :offset";
        
        // Execute queries
        foreach ([$codQuery, $onlineQuery, $cardQuery] as $query) {
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            if ($status) {
                $stmt->bindParam(':status', $status);
            }
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $orders = $stmt->fetchAll();
            $allOrders = array_merge($allOrders, $orders);
        }
        
        // Sort by order_date descending
        usort($allOrders, function($a, $b) {
            return strtotime($b['order_date']) - strtotime($a['order_date']);
        });
        
        // Parse products JSON and add additional info for each order
        foreach ($allOrders as &$order) {
            $order['products'] = json_decode($order['products'], true);
            $order['item_count'] = count($order['products']);
            $order['can_cancel'] = canCancelOrder($order['order_status'], $order['order_date']);
            $order['formatted_date'] = date('M d, Y h:i A', strtotime($order['order_date']));
            
            // Set default status for COD orders
            if ($order['table_source'] === 'paymentondelivery' && !isset($order['order_status'])) {
                $order['order_status'] = 'pending';
            }
        }
        
        // Get total count for pagination
        $totalCount = getTotalOrderCount($userId, $status);
        
        sendResponse(true, 'Order history retrieved successfully', [
            'orders' => $allOrders,
            'totalOrders' => count($allOrders),
            'totalCount' => $totalCount,
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'hasMore' => ($offset + $limit) < $totalCount
            ]
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function getOrderDetails() {
    global $conn;
    
    $transactionId = isset($_GET['transactionId']) ? trim($_GET['transactionId']) : null;
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    
    if (!$transactionId || !$userId) {
        sendResponse(false, 'Transaction ID and User ID are required');
    }
    
    try {
        $order = null;
        $tables = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
        
        foreach ($tables as $table) {
            $order = getOrderFromTableWithStatus($table, $transactionId, $userId);
            if ($order) {
                break;
            }
        }
        
        if (!$order) {
            sendResponse(false, 'Order not found', [], 404);
        }
        
        // Parse products JSON
        $order['products'] = json_decode($order['products'], true);
        $order['item_count'] = count($order['products']);
        $order['can_cancel'] = canCancelOrder($order['order_status'], $order['order_date']);
        $order['formatted_date'] = date('M d, Y h:i A', strtotime($order['order_date']));
        
        // Set default status for COD orders
        if ($order['table_source'] === 'paymentondelivery' && !isset($order['order_status'])) {
            $order['order_status'] = 'pending';
        }
        
        sendResponse(true, 'Order details retrieved successfully', [
            'order' => $order
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function updateOrderStatus() {
    global $conn;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $transactionId = isset($input['transactionId']) ? trim($input['transactionId']) : null;
    $userId = isset($input['userId']) ? trim($input['userId']) : null;
    $newStatus = isset($input['status']) ? trim($input['status']) : null;
    
    if (!$transactionId || !$userId || !$newStatus) {
        sendResponse(false, 'Transaction ID, User ID, and status are required');
    }
    
    $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        sendResponse(false, 'Invalid status. Valid statuses: ' . implode(', ', $validStatuses));
    }
    
    try {
        $conn->beginTransaction();
        
        $updated = false;
        $tables = [
            'onlinepayment' => 'payment_status',
            'creditcardpayment' => 'payment_status'
        ];
        
        foreach ($tables as $table => $statusColumn) {
            $stmt = $conn->prepare("
                UPDATE $table 
                SET $statusColumn = :status 
                WHERE transaction_id = :transactionId AND user_id = :userId
            ");
            $stmt->bindParam(':status', $newStatus);
            $stmt->bindParam(':transactionId', $transactionId);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $updated = true;
                break;
            }
        }
        
        // For COD orders, we need to add a status column or handle differently
        if (!$updated) {
            // Check if it's a COD order
            $stmt = $conn->prepare("
                SELECT id FROM paymentondelivery 
                WHERE transaction_id = :transactionId AND user_id = :userId
            ");
            $stmt->bindParam(':transactionId', $transactionId);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            
            if ($stmt->fetch()) {
                // For now, we'll add a status column to paymentondelivery table
                // First, check if status column exists
                try {
                    $conn->exec("ALTER TABLE paymentondelivery ADD COLUMN order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'");
                } catch (PDOException $e) {
                    // Column might already exist, ignore error
                }
                
                $stmt = $conn->prepare("
                    UPDATE paymentondelivery 
                    SET order_status = :status 
                    WHERE transaction_id = :transactionId AND user_id = :userId
                ");
                $stmt->bindParam(':status', $newStatus);
                $stmt->bindParam(':transactionId', $transactionId);
                $stmt->bindParam(':userId', $userId);
                $stmt->execute();
                
                $updated = $stmt->rowCount() > 0;
            }
        }
        
        if ($updated) {
            $conn->commit();
            sendResponse(true, 'Order status updated successfully', [
                'transactionId' => $transactionId,
                'newStatus' => $newStatus
            ]);
        } else {
            $conn->rollBack();
            sendResponse(false, 'Order not found or no changes made', [], 404);
        }
        
    } catch(PDOException $e) {
        $conn->rollBack();
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function cancelOrder() {
    global $conn;
    
    $transactionId = isset($_GET['transactionId']) ? trim($_GET['transactionId']) : null;
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    
    if (!$transactionId || !$userId) {
        sendResponse(false, 'Transaction ID and User ID are required');
    }
    
    try {
        // First, get the order to check if it can be cancelled
        $order = null;
        $tables = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
        
        foreach ($tables as $table) {
            $order = getOrderFromTableWithStatus($table, $transactionId, $userId);
            if ($order) {
                break;
            }
        }
        
        if (!$order) {
            sendResponse(false, 'Order not found', [], 404);
        }
        
        // Check if order can be cancelled
        if (!canCancelOrder($order['order_status'], $order['order_date'])) {
            sendResponse(false, 'Order cannot be cancelled. It may have already been processed or delivered.');
        }
        
        // Update status to cancelled
        $input = [
            'transactionId' => $transactionId,
            'userId' => $userId,
            'status' => 'cancelled'
        ];
        
        // Temporarily set input for updateOrderStatus function
        $_POST['json_input'] = json_encode($input);
        
        $conn->beginTransaction();
        
        $updated = false;
        $tables = [
            'onlinepayment' => 'payment_status',
            'creditcardpayment' => 'payment_status'
        ];
        
        foreach ($tables as $table => $statusColumn) {
            $stmt = $conn->prepare("
                UPDATE $table 
                SET $statusColumn = 'cancelled' 
                WHERE transaction_id = :transactionId AND user_id = :userId
            ");
            $stmt->bindParam(':transactionId', $transactionId);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $updated = true;
                break;
            }
        }
        
        // Handle COD orders
        if (!$updated) {
            try {
                $conn->exec("ALTER TABLE paymentondelivery ADD COLUMN order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'");
            } catch (PDOException $e) {
                // Column might already exist
            }
            
            $stmt = $conn->prepare("
                UPDATE paymentondelivery 
                SET order_status = 'cancelled' 
                WHERE transaction_id = :transactionId AND user_id = :userId
            ");
            $stmt->bindParam(':transactionId', $transactionId);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            
            $updated = $stmt->rowCount() > 0;
        }
        
        if ($updated) {
            $conn->commit();
            sendResponse(true, 'Order cancelled successfully', [
                'transactionId' => $transactionId,
                'status' => 'cancelled'
            ]);
        } else {
            $conn->rollBack();
            sendResponse(false, 'Failed to cancel order', [], 500);
        }
        
    } catch(PDOException $e) {
        $conn->rollBack();
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function getOrderFromTableWithStatus($tableName, $transactionId, $userId) {
    global $conn;
    
    $validTables = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
    if (!in_array($tableName, $validTables)) {
        return null;
    }
    
    $baseQuery = "
        SELECT 
            id, user_id, customer_name, phone, email, country, city, address, products,
            transaction_id, payment_method, payment_amount, product_amount,
            delivery_charge, discount, applied_promo, order_date,
            '$tableName' as table_source
    ";
    
    switch ($tableName) {
        case 'paymentondelivery':
            // Try to get order_status if column exists, otherwise default to 'pending'
            $query = $baseQuery . ", COALESCE(order_status, 'pending') as order_status FROM $tableName WHERE transaction_id = :transactionId AND user_id = :userId";
            break;
        case 'onlinepayment':
            $query = $baseQuery . ", payment_gateway, gateway_transaction_id, payment_status as order_status FROM $tableName WHERE transaction_id = :transactionId AND user_id = :userId";
            break;
        case 'creditcardpayment':
            $query = $baseQuery . ", card_last_four, card_type, payment_processor, processor_transaction_id, payment_status as order_status FROM $tableName WHERE transaction_id = :transactionId AND user_id = :userId";
            break;
    }
    
    try {
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':transactionId', $transactionId);
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        
        return $stmt->fetch();
    } catch (PDOException $e) {
        // If order_status column doesn't exist in paymentondelivery, try without it
        if ($tableName === 'paymentondelivery') {
            $query = $baseQuery . ", 'pending' as order_status FROM $tableName WHERE transaction_id = :transactionId AND user_id = :userId";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':transactionId', $transactionId);
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            
            return $stmt->fetch();
        }
        return null;
    }
}

function canCancelOrder($status, $orderDate) {
    // Orders can be cancelled if:
    // 1. Status is 'pending' or 'processing'
    // 2. Order was placed within last 24 hours (for other statuses)
    
    $cancellableStatuses = ['pending', 'processing'];
    
    if (in_array($status, $cancellableStatuses)) {
        return true;
    }
    
    // Check if order is within 24 hours
    $orderTime = strtotime($orderDate);
    $currentTime = time();
    $hoursDiff = ($currentTime - $orderTime) / 3600;
    
    return $hoursDiff <= 24 && !in_array($status, ['delivered', 'cancelled']);
}

function getTotalOrderCount($userId, $status = null) {
    global $conn;
    
    $totalCount = 0;
    $tables = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
    
    foreach ($tables as $table) {
        $query = "SELECT COUNT(*) as count FROM $table WHERE user_id = :userId";
        
        if ($status) {
            if ($table === 'paymentondelivery') {
                $query .= " AND COALESCE(order_status, 'pending') = :status";
            } else {
                $query .= " AND payment_status = :status";
            }
        }
        
        try {
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':userId', $userId);
            if ($status) {
                $stmt->bindParam(':status', $status);
            }
            $stmt->execute();
            
            $result = $stmt->fetch();
            $totalCount += intval($result['count']);
        } catch (PDOException $e) {
            // Handle case where order_status column doesn't exist
            if ($table === 'paymentondelivery' && $status) {
                $query = "SELECT COUNT(*) as count FROM $table WHERE user_id = :userId";
                if ($status === 'pending') {
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':userId', $userId);
                    $stmt->execute();
                    $result = $stmt->fetch();
                    $totalCount += intval($result['count']);
                }
            }
        }
    }
    
    return $totalCount;
}
?>