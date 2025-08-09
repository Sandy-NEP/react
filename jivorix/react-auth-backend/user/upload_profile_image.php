<?php
require_once '../config/config.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    // Check if file was uploaded
    if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] === UPLOAD_ERR_NO_FILE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['profile_image'];
    $allowedTypes = ['image/jpeg', 'image/png'];
    $maxSize = 10 * 1024 * 1024; // 10MB

    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG and PNG are allowed.']);
        exit;
    }

    // Validate file size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File size exceeds 10MB limit.']);
        exit;
    }

    // Validate image contents
    $imageInfo = getimagesize($file['tmp_name']);
    if (!$imageInfo) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid image file']);
        exit;
    }

    // Define upload directory
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Delete old image if exists
    $stmt = $conn->prepare("SELECT profile_image FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $oldImage = $stmt->fetchColumn();
    if ($oldImage && file_exists($uploadDir . $oldImage)) {
        unlink($uploadDir . $oldImage);
    }

    // Generate unique filename
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $uniqueFileName = uniqid('profile_', true) . '.' . $fileExtension;
    $uploadPath = $uploadDir . $uniqueFileName;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
        exit;
    }

    // Update user's profile image in the database
    $stmt = $conn->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
    $stmt->execute([$uniqueFileName, $userId]);

    // Verify the update
    $stmt = $conn->prepare("SELECT profile_image FROM users WHERE id = ?");
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
        'message' => 'Profile image uploaded successfully',
        'data' => [
            'profileImage' => 'http://localhost/react-auth-backend/user/uploads/' . $user['profile_image']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>