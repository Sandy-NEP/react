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

// Get available payment methods
function getPaymentMethods() {
    $paymentMethods = [
        [
            'id' => 'paymentondelivery',
            'name' => 'Cash on Delivery',
            'description' => 'Pay when your order is delivered to your doorstep',
            'icon' => 'cash',
            'enabled' => true,
            'processingTime' => 'Instant',
            'additionalFields' => []
        ],
        [
            'id' => 'onlinepayment',
            'name' => 'Online Payment',
            'description' => 'Pay securely using online payment gateways',
            'icon' => 'online',
            'enabled' => true,
            'processingTime' => '1-2 minutes',
            'additionalFields' => [
                'paymentGateway' => [
                    'type' => 'select',
                    'label' => 'Payment Gateway',
                    'options' => ['paypal', 'stripe', 'razorpay', 'default'],
                    'required' => false,
                    'default' => 'default'
                ]
            ]
        ],
        [
            'id' => 'creditcardpayment',
            'name' => 'Credit/Debit Card',
            'description' => 'Pay using your credit or debit card',
            'icon' => 'card',
            'enabled' => true,
            'processingTime' => '1-2 minutes',
            'additionalFields' => [
                'cardNumber' => [
                    'type' => 'text',
                    'label' => 'Card Number',
                    'required' => true,
                    'placeholder' => '1234 5678 9012 3456'
                ],
                'expiryDate' => [
                    'type' => 'text',
                    'label' => 'Expiry Date',
                    'required' => true,
                    'placeholder' => 'MM/YY'
                ],
                'cvv' => [
                    'type' => 'text',
                    'label' => 'CVV',
                    'required' => true,
                    'placeholder' => '123'
                ],
                'cardHolderName' => [
                    'type' => 'text',
                    'label' => 'Card Holder Name',
                    'required' => true,
                    'placeholder' => 'John Doe'
                ],
                'paymentProcessor' => [
                    'type' => 'select',
                    'label' => 'Payment Processor',
                    'options' => ['stripe', 'square', 'paypal', 'authorize.net'],
                    'required' => false,
                    'default' => 'stripe'
                ]
            ]
        ]
    ];
    
    return $paymentMethods;
}

// Get payment method configuration
function getPaymentMethodConfig($methodId) {
    $methods = getPaymentMethods();
    
    foreach ($methods as $method) {
        if ($method['id'] === $methodId) {
            return $method;
        }
    }
    
    return null;
}

// Validate payment method data
function validatePaymentMethodData($methodId, $data) {
    $config = getPaymentMethodConfig($methodId);
    
    if (!$config) {
        return ['valid' => false, 'errors' => ['Invalid payment method']];
    }
    
    $errors = [];
    
    if (isset($config['additionalFields'])) {
        foreach ($config['additionalFields'] as $fieldName => $fieldConfig) {
            if ($fieldConfig['required'] && (!isset($data[$fieldName]) || empty(trim($data[$fieldName])))) {
                $errors[] = "Field '{$fieldConfig['label']}' is required";
            }
            
            // Additional validation based on field type
            if (isset($data[$fieldName]) && !empty($data[$fieldName])) {
                switch ($fieldName) {
                    case 'cardNumber':
                        $cardNumber = preg_replace('/\s+/', '', $data[$fieldName]);
                        if (!preg_match('/^\d{13,19}$/', $cardNumber)) {
                            $errors[] = 'Invalid card number format';
                        }
                        break;
                    case 'expiryDate':
                        if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $data[$fieldName])) {
                            $errors[] = 'Invalid expiry date format (MM/YY)';
                        }
                        break;
                    case 'cvv':
                        if (!preg_match('/^\d{3,4}$/', $data[$fieldName])) {
                            $errors[] = 'Invalid CVV format';
                        }
                        break;
                }
            }
        }
    }
    
    return ['valid' => empty($errors), 'errors' => $errors];
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : 'list';
    
    switch ($action) {
        case 'list':
            sendResponse(true, 'Payment methods retrieved successfully', [
                'paymentMethods' => getPaymentMethods()
            ]);
            break;
            
        case 'config':
            $methodId = isset($_GET['methodId']) ? $_GET['methodId'] : null;
            if (!$methodId) {
                sendResponse(false, 'Method ID is required');
            }
            
            $config = getPaymentMethodConfig($methodId);
            if (!$config) {
                sendResponse(false, 'Payment method not found', [], 404);
            }
            
            sendResponse(true, 'Payment method configuration retrieved successfully', [
                'config' => $config
            ]);
            break;
            
        case 'validate':
            $methodId = isset($_GET['methodId']) ? $_GET['methodId'] : null;
            if (!$methodId) {
                sendResponse(false, 'Method ID is required');
            }
            
            $data = isset($_GET['data']) ? json_decode($_GET['data'], true) : [];
            $validation = validatePaymentMethodData($methodId, $data);
            
            sendResponse($validation['valid'], 
                $validation['valid'] ? 'Payment method data is valid' : 'Validation failed', 
                $validation
            );
            break;
            
        default:
            sendResponse(false, 'Invalid action');
    }
} else {
    sendResponse(false, 'Only GET method allowed');
}
?>