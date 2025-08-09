<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/config.php';

function sendResponse($success, $message, $data = null) {
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Invalid JSON data received');
}

$requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        sendResponse(false, "Missing or empty required field: $field");
    }
}

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $data['email']);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Email already registered');
    }

    // Check if phone already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE phone = :phone");
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Phone number already registered');
    }

    // Check if national ID already exists (if provided)
    if (isset($data['nationalId']) && $data['nationalId']) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE national_id = :nationalId");
        $stmt->bindParam(':nationalId', $data['nationalId']);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            sendResponse(false, 'National ID already registered');
        }
    }

    // Insert new user with plain password
    $stmt = $conn->prepare("
        INSERT INTO users (
            first_name, middle_name, last_name, email, phone, password, 
            address, city, state, postcode, date_of_birth, national_id, gender
        ) VALUES (
            :firstName, :middleName, :lastName, :email, :phone, :password, 
            :address, :city, :state, :postcode, :dateOfBirth, :nationalId, :gender
        )
    ");

    // Bind parameters
    $stmt->bindParam(':firstName', $data['firstName']);
    $stmt->bindParam(':middleName', $data['middleName']);
    $stmt->bindParam(':lastName', $data['lastName']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':password', $data['password']); // Storing plain password
    $stmt->bindParam(':address', $data['address']);
    $stmt->bindParam(':city', $data['city']);
    $stmt->bindParam(':state', $data['state']);
    $stmt->bindParam(':postcode', $data['postcode']);
    $stmt->bindParam(':dateOfBirth', $data['dateOfBirth']);
    $stmt->bindParam(':nationalId', $data['nationalId']);
    $stmt->bindParam(':gender', $data['gender']);

    if ($stmt->execute()) {
        $userId = $conn->lastInsertId();
        $userData = [
            'id' => $userId,
            'firstName' => $data['firstName'],
            'middleName' => $data['middleName'],
            'lastName' => $data['lastName'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'city' => $data['city'],
            'state' => $data['state'],
            'postcode' => $data['postcode'],
            'dateOfBirth' => $data['dateOfBirth'],
            'nationalId' => $data['nationalId'],
            'gender' => $data['gender'],
            'profileImage' => null
        ];
        sendResponse(true, 'User added successfully', $userData);
    } else {
        sendResponse(false, 'Failed to add user');
    }
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>