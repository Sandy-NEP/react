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

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Only GET method allowed');
}

$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;

switch ($action) {
    case 'list':
        getUserOrders($userId);
        break;
    case 'details':
        getOrderDetails();
        break;
    case 'by-payment-method':
        getOrdersByPaymentMethod();
        break;
    default:
        getUserOrders($userId);
}

function getUserOrders($userId) {
    global $conn;
    
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
        $stmt = $conn->prepare("
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                'paymentondelivery' as table_source
            FROM paymentondelivery 
            WHERE user_id = :userId 
            ORDER BY order_date DESC
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $codOrders = $stmt->fetchAll();
        
        // Get orders from onlinepayment table
        $stmt = $conn->prepare("
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                payment_gateway, gateway_transaction_id, payment_status,
                'onlinepayment' as table_source
            FROM onlinepayment 
            WHERE user_id = :userId 
            ORDER BY order_date DESC
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $onlineOrders = $stmt->fetchAll();
        
        // Get orders from creditcardpayment table
        $stmt = $conn->prepare("
            SELECT 
                id, customer_name, phone, email, country, city, address, products,
                transaction_id, payment_method, payment_amount, product_amount,
                delivery_charge, discount, applied_promo, order_date,
                card_last_four, card_type, payment_processor, processor_transaction_id, payment_status,
                'creditcardpayment' as table_source
            FROM creditcardpayment 
            WHERE user_id = :userId 
            ORDER BY order_date DESC
        ");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $cardOrders = $stmt->fetchAll();
        
        // Combine all orders
        $allOrders = array_merge($codOrders, $onlineOrders, $cardOrders);
        
        // Sort by order_date descending
        usort($allOrders, function($a, $b) {
            return strtotime($b['order_date']) - strtotime($a['order_date']);
        });
        
        // Parse products JSON for each order
        foreach ($allOrders as &$order) {
            $order['products'] = json_decode($order['products'], true);
            $order['item_count'] = count($order['products']);
        }
        
        sendResponse(true, 'Orders retrieved successfully', [
            'orders' => $allOrders,
            'totalOrders' => count($allOrders),
            'ordersByPaymentMethod' => [
                'paymentondelivery' => count($codOrders),
                'onlinepayment' => count($onlineOrders),
                'creditcardpayment' => count($cardOrders)
            ]
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function getOrderDetails() {
    global $conn;
    
    $transactionId = isset($_GET['transactionId']) ? trim($_GET['transactionId']) : null;
    $paymentMethod = isset($_GET['paymentMethod']) ? trim($_GET['paymentMethod']) : null;
    
    if (!$transactionId) {
        sendResponse(false, 'Transaction ID is required');
    }
    
    try {
        $order = null;
        
        // If payment method is specified, search in that table only
        if ($paymentMethod) {
            $order = getOrderFromTable($paymentMethod, $transactionId);
        } else {
            // Search in all tables
            $tables = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
            foreach ($tables as $table) {
                $order = getOrderFromTable($table, $transactionId);
                if ($order) {
                    break;
                }
            }
        }
        
        if (!$order) {
            sendResponse(false, 'Order not found', [], 404);
        }
        
        // Parse products JSON
        $order['products'] = json_decode($order['products'], true);
        $order['item_count'] = count($order['products']);
        
        sendResponse(true, 'Order details retrieved successfully', [
            'order' => $order
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}

function getOrderFromTable($tableName, $transactionId) {
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
        case 'onlinepayment':
            $query = $baseQuery . ", payment_gateway, gateway_transaction_id, payment_status FROM $tableName WHERE transaction_id = :transactionId";
            break;
        case 'creditcardpayment':
            $query = $baseQuery . ", card_last_four, card_type, payment_processor, processor_transaction_id, payment_status FROM $tableName WHERE transaction_id = :transactionId";
            break;
        default:
            $query = $baseQuery . " FROM $tableName WHERE transaction_id = :transactionId";
    }
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':transactionId', $transactionId);
    $stmt->execute();
    
    return $stmt->fetch();
}

function getOrdersByPaymentMethod() {
    global $conn;
    
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : null;
    $paymentMethod = isset($_GET['paymentMethod']) ? trim($_GET['paymentMethod']) : null;
    
    if (!$userId || !$paymentMethod) {
        sendResponse(false, 'User ID and payment method are required');
    }
    
    $validMethods = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
    if (!in_array($paymentMethod, $validMethods)) {
        sendResponse(false, 'Invalid payment method');
    }
    
    try {
        $orders = [];
        
        switch ($paymentMethod) {
            case 'paymentondelivery':
                $stmt = $conn->prepare("
                    SELECT 
                        id, customer_name, phone, email, country, city, address, products,
                        transaction_id, payment_method, payment_amount, product_amount,
                        delivery_charge, discount, applied_promo, order_date,
                        'paymentondelivery' as table_source
                    FROM paymentondelivery 
                    WHERE user_id = :userId 
                    ORDER BY order_date DESC
                ");
                break;
                
            case 'onlinepayment':
                $stmt = $conn->prepare("
                    SELECT 
                        id, customer_name, phone, email, country, city, address, products,
                        transaction_id, payment_method, payment_amount, product_amount,
                        delivery_charge, discount, applied_promo, order_date,
                        payment_gateway, gateway_transaction_id, payment_status,
                        'onlinepayment' as table_source
                    FROM onlinepayment 
                    WHERE user_id = :userId 
                    ORDER BY order_date DESC
                ");
                break;
                
            case 'creditcardpayment':
                $stmt = $conn->prepare("
                    SELECT 
                        id, customer_name, phone, email, country, city, address, products,
                        transaction_id, payment_method, payment_amount, product_amount,
                        delivery_charge, discount, applied_promo, order_date,
                        card_last_four, card_type, payment_processor, processor_transaction_id, payment_status,
                        'creditcardpayment' as table_source
                    FROM creditcardpayment 
                    WHERE user_id = :userId 
                    ORDER BY order_date DESC
                ");
                break;
        }
        
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        // Parse products JSON for each order
        foreach ($orders as &$order) {
            $order['products'] = json_decode($order['products'], true);
            $order['item_count'] = count($order['products']);
        }
        
        sendResponse(true, 'Orders retrieved successfully', [
            'orders' => $orders,
            'paymentMethod' => $paymentMethod,
            'totalOrders' => count($orders)
        ]);
        
    } catch(PDOException $e) {
        sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
    }
}
?>