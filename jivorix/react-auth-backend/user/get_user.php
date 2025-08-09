<?php
require_once '../config/config.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get Authorization header (Bearer token)
$headers = apache_request_headers();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authorization token required']);
    exit;
}

$token = $matches[1];

try {
    // Decode token
    $decoded = json_decode(base64_decode($token), true);
    if (!$decoded || !isset($decoded['userId']) || !isset($decoded['exp'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token format']);
        exit;
    }

    if ($decoded['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token expired']);
        exit;
    }

    $userId = $decoded['userId'];

    // Query database for user details
    $stmt = $conn->prepare("
        SELECT id, first_name, middle_name, last_name, email, phone, 
               address, city, state, postcode, date_of_birth, national_id, gender, profile_image 
        FROM users WHERE id = ?
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Successful response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $user['id'],
            'firstName' => $user['first_name'],
            'middleName' => $user['middle_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'city' => $user['city'],
            'state' => $user['state'],
            'postcode' => $user['postcode'],
            'dateOfBirth' => $user['date_of_birth'],
            'nationalId' => $user['national_id'],
            'gender' => $user['gender'],
            'profileImage' => $user['profile_image'] ? 'http://localhost/react-auth-backend/user/uploads/' . $user['profile_image'] : null
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>