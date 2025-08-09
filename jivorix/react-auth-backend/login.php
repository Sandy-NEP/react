<?php
require_once 'config/config.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and validate input
$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['emailOrPhone']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email/phone and password are required']);
    exit;
}

try {
    // Check if input is email or phone
    $isEmail = filter_var($input['emailOrPhone'], FILTER_VALIDATE_EMAIL);
    $field = $isEmail ? 'email' : 'phone';
    
    // Query database
    $stmt = $conn->prepare("SELECT * FROM users WHERE $field = ?");
    $stmt->execute([$input['emailOrPhone']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    // Verify password (plain text comparison - INSECURE for production)
    if ($input['password'] !== $user['password']) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit;
    }
    
    // Generate token
    $token = base64_encode(json_encode([
        'userId' => $user['id'],
        'exp' => time() + (7 * 24 * 3600) // 7 days for testing
    ]));
    
    // Successful login response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'user' => [
                'id' => $user['id'],
                'firstName' => $user['first_name'],
                'email' => $user['email']
            ],
            'token' => $token
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>