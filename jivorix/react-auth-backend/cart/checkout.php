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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$requiredFields = ['userId', 'customerName', 'phone', 'email', 'country', 'city', 'address', 'paymentMethod'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        sendResponse(false, "Field '$field' is required");
    }
}

$userId = trim($input['userId']);
$customerName = trim($input['customerName']);
$phone = trim($input['phone']);
$email = trim($input['email']);
$country = trim($input['country']);
$city = trim($input['city']);
$address = trim($input['address']);
$paymentMethod = trim($input['paymentMethod']);
$appliedPromo = isset($input['appliedPromo']) ? trim($input['appliedPromo']) : null;
$deliveryCharge = isset($input['deliveryCharge']) ? floatval($input['deliveryCharge']) : 0.00;
$discount = isset($input['discount']) ? floatval($input['discount']) : 0.00;

// Validate payment method
$validPaymentMethods = ['paymentondelivery', 'onlinepayment', 'creditcardpayment'];
if (!in_array($paymentMethod, $validPaymentMethods)) {
    sendResponse(false, 'Invalid payment method. Must be one of: ' . implode(', ', $validPaymentMethods));
}

try {
    // Start transaction
    $conn->beginTransaction();

    // Verify user exists
    $stmt = $conn->prepare("SELECT id, email FROM users WHERE id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch();
    if (!$user) {
        $conn->rollBack();
        sendResponse(false, 'User not found', [], 404);
    }

    // Get cart items for the user
    $stmt = $conn->prepare("
        SELECT 
            id, product_id, name, image, description, price, available, size, quantity
        FROM cart_items 
        WHERE user_id = :userId 
        ORDER BY created_at DESC
    ");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $cartItems = $stmt->fetchAll();
    
    if (empty($cartItems)) {
        $conn->rollBack();
        sendResponse(false, 'Cart is empty');
    }

    // Calculate totals
    $productAmount = 0;
    foreach ($cartItems as $item) {
        $productAmount += $item['price'] * $item['quantity'];
    }
    
    $paymentAmount = $productAmount + $deliveryCharge - $discount;
    
    // Generate unique transaction ID
    $transactionId = 'TXN_' . time() . '_' . $userId . '_' . rand(1000, 9999);
    
    // Prepare products JSON
    $products = json_encode($cartItems);
    
    $orderDate = date('Y-m-d H:i:s');
    
    // Insert order based on payment method
    switch ($paymentMethod) {
        case 'paymentondelivery':
            $stmt = $conn->prepare("
                INSERT INTO paymentondelivery 
                (user_id, customer_name, phone, email, country, city, address, products, 
                 transaction_id, payment_method, payment_amount, product_amount, 
                 delivery_charge, discount, applied_promo, order_date)
                VALUES 
                (:userId, :customerName, :phone, :email, :country, :city, :address, :products,
                 :transactionId, :paymentMethod, :paymentAmount, :productAmount,
                 :deliveryCharge, :discount, :appliedPromo, :orderDate)
            ");
            break;
            
        case 'onlinepayment':
            // For online payment, we'll add additional fields
            $paymentGateway = isset($input['paymentGateway']) ? trim($input['paymentGateway']) : 'default';
            $gatewayTransactionId = isset($input['gatewayTransactionId']) ? trim($input['gatewayTransactionId']) : null;
            $paymentStatus = isset($input['paymentStatus']) ? trim($input['paymentStatus']) : 'pending';
            
            $stmt = $conn->prepare("
                INSERT INTO onlinepayment 
                (user_id, customer_name, phone, email, country, city, address, products, 
                 transaction_id, payment_method, payment_amount, product_amount, 
                 delivery_charge, discount, applied_promo, order_date, payment_gateway,
                 gateway_transaction_id, payment_status)
                VALUES 
                (:userId, :customerName, :phone, :email, :country, :city, :address, :products,
                 :transactionId, :paymentMethod, :paymentAmount, :productAmount,
                 :deliveryCharge, :discount, :appliedPromo, :orderDate, :paymentGateway,
                 :gatewayTransactionId, :paymentStatus)
            ");
            $stmt->bindParam(':paymentGateway', $paymentGateway);
            $stmt->bindParam(':gatewayTransactionId', $gatewayTransactionId);
            $stmt->bindParam(':paymentStatus', $paymentStatus);
            break;
            
        case 'creditcardpayment':
            // For credit card payment, we'll add card-specific fields
            $cardLastFour = isset($input['cardLastFour']) ? trim($input['cardLastFour']) : null;
            $cardType = isset($input['cardType']) ? trim($input['cardType']) : null;
            $paymentProcessor = isset($input['paymentProcessor']) ? trim($input['paymentProcessor']) : 'stripe';
            $processorTransactionId = isset($input['processorTransactionId']) ? trim($input['processorTransactionId']) : null;
            $paymentStatus = isset($input['paymentStatus']) ? trim($input['paymentStatus']) : 'pending';
            
            $stmt = $conn->prepare("
                INSERT INTO creditcardpayment 
                (user_id, customer_name, phone, email, country, city, address, products, 
                 transaction_id, payment_method, payment_amount, product_amount, 
                 delivery_charge, discount, applied_promo, order_date, card_last_four,
                 card_type, payment_processor, processor_transaction_id, payment_status)
                VALUES 
                (:userId, :customerName, :phone, :email, :country, :city, :address, :products,
                 :transactionId, :paymentMethod, :paymentAmount, :productAmount,
                 :deliveryCharge, :discount, :appliedPromo, :orderDate, :cardLastFour,
                 :cardType, :paymentProcessor, :processorTransactionId, :paymentStatus)
            ");
            $stmt->bindParam(':cardLastFour', $cardLastFour);
            $stmt->bindParam(':cardType', $cardType);
            $stmt->bindParam(':paymentProcessor', $paymentProcessor);
            $stmt->bindParam(':processorTransactionId', $processorTransactionId);
            $stmt->bindParam(':paymentStatus', $paymentStatus);
            break;
    }
    
    // Bind common parameters
    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':customerName', $customerName);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':country', $country);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':products', $products);
    $stmt->bindParam(':transactionId', $transactionId);
    $stmt->bindParam(':paymentMethod', $paymentMethod);
    $stmt->bindParam(':paymentAmount', $paymentAmount);
    $stmt->bindParam(':productAmount', $productAmount);
    $stmt->bindParam(':deliveryCharge', $deliveryCharge);
    $stmt->bindParam(':discount', $discount);
    $stmt->bindParam(':appliedPromo', $appliedPromo);
    $stmt->bindParam(':orderDate', $orderDate);
    
    $stmt->execute();
    $orderId = $conn->lastInsertId();
    
    // Clear the cart after successful order
    $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    // Commit transaction
    $conn->commit();
    
    sendResponse(true, 'Order placed successfully', [
        'orderId' => $orderId,
        'transactionId' => $transactionId,
        'paymentMethod' => $paymentMethod,
        'paymentAmount' => $paymentAmount,
        'productAmount' => $productAmount,
        'deliveryCharge' => $deliveryCharge,
        'discount' => $discount,
        'itemCount' => count($cartItems)
    ]);
    
} catch(PDOException $e) {
    $conn->rollBack();
    sendResponse(false, 'Database error: ' . $e->getMessage(), [], 500);
} catch(Exception $e) {
    $conn->rollBack();
    sendResponse(false, 'Error: ' . $e->getMessage(), [], 500);
}
?>