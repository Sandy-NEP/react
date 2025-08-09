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

$requiredFields = ['id', 'firstName', 'lastName', 'email', 'phone'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        sendResponse(false, "Missing or empty required field: $field");
    }
}

try {
    // Check if email already exists for another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email AND id != :id");
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':id', $data['id']);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Email already registered');
    }

    // Check if phone already exists for another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE phone = :phone AND id != :id");
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':id', $data['id']);
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Phone number already registered');
    }

    // Check if national ID already exists for another user (if provided)
    if (isset($data['nationalId']) && $data['nationalId']) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE national_id = :nationalId AND id != :id");
        $stmt->bindParam(':nationalId', $data['nationalId']);
        $stmt->bindParam(':id', $data['id']);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            sendResponse(false, 'National ID already registered');
        }
    }

    // Prepare the base update query
    $query = "
        UPDATE users SET
            first_name = :firstName,
            middle_name = :middleName,
            last_name = :lastName,
            email = :email,
            phone = :phone,
            address = :address,
            city = :city,
            state = :state,
            postcode = :postcode,
            date_of_birth = :dateOfBirth,
            national_id = :nationalId,
            gender = :gender
    ";

    // Add password update if provided
    if (isset($data['password']) && !empty($data['password'])) {
        $query .= ", password = :password";
    }

    $query .= " WHERE id = :id";

    $stmt = $conn->prepare($query);

    // Bind parameters
    $stmt->bindParam(':id', $data['id']);
    $stmt->bindParam(':firstName', $data['firstName']);
    $stmt->bindParam(':middleName', $data['middleName']);
    $stmt->bindParam(':lastName', $data['lastName']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':phone', $data['phone']);
    $stmt->bindParam(':address', $data['address']);
    $stmt->bindParam(':city', $data['city']);
    $stmt->bindParam(':state', $data['state']);
    $stmt->bindParam(':postcode', $data['postcode']);
    $stmt->bindParam(':dateOfBirth', $data['dateOfBirth']);
    $stmt->bindParam(':nationalId', $data['nationalId']);
    $stmt->bindParam(':gender', $data['gender']);

    // Bind password if provided
    if (isset($data['password']) && !empty($data['password'])) {
        $stmt->bindParam(':password', $data['password']); // Storing plain password
    }

    if ($stmt->execute()) {
        $userData = [
            'id' => $data['id'],
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
            'profileImage' => $data['profileImage'] ?? null
        ];
        sendResponse(true, 'User updated successfully', $userData);
    } else {
        sendResponse(false, 'Failed to update user');
    }
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>