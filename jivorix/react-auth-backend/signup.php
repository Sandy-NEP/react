<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/config.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Invalid JSON data received');
}

// Sanitize input
$firstName = isset($data['firstName']) ? trim($data['firstName']) : null;
$middleName = isset($data['middleName']) ? trim($data['middleName']) : null;
$lastName = isset($data['lastName']) ? trim($data['lastName']) : null;
$email = isset($data['email']) ? trim($data['email']) : null;
$phone = isset($data['phone']) ? trim($data['phone']) : null;
$password = isset($data['password']) ? trim($data['password']) : null;
$address = isset($data['address']) ? trim($data['address']) : null;
$city = isset($data['city']) ? trim($data['city']) : null;
$state = isset($data['state']) ? trim($data['state']) : null;
$postcode = isset($data['postcode']) ? trim($data['postcode']) : null;
$dateOfBirth = isset($data['dateOfBirth']) ? trim($data['dateOfBirth']) : null;
$nationalId = isset($data['nationalId']) ? trim($data['nationalId']) : null;
$gender = isset($data['gender']) ? trim($data['gender']) : null;

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Email already registered');
    }

    // Check if phone already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE phone = :phone");
    $stmt->bindParam(':phone', $phone);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(false, 'Phone number already registered');
    }

    // Check if national ID already exists if provided
    if ($nationalId) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE national_id = :nationalId");
        $stmt->bindParam(':nationalId', $nationalId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(false, 'National ID already registered');
        }
    }

    // Insert new user with all fields (password stored as plain text)
    $stmt = $conn->prepare("
        INSERT INTO users (
            first_name, middle_name, last_name, email, phone, password, 
            address, city, state, postcode, date_of_birth, national_id, gender, profile_image
        ) VALUES (
            :firstName, :middleName, :lastName, :email, :phone, :password, 
            :address, :city, :state, :postcode, :dateOfBirth, :nationalId, :gender, NULL
        )
    ");

    $stmt->bindParam(':firstName', $firstName);
    $stmt->bindParam(':middleName', $middleName);
    $stmt->bindParam(':lastName', $lastName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':password', $password); // Store password as plain text
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':state', $state);
    $stmt->bindParam(':postcode', $postcode);
    $stmt->bindParam(':dateOfBirth', $dateOfBirth);
    $stmt->bindParam(':nationalId', $nationalId);
    $stmt->bindParam(':gender', $gender);
    
    if ($stmt->execute()) {
        $userId = $conn->lastInsertId();
        $token = generateJWT($userId, $email);
        
        sendResponse(true, 'Registration successful', [
            'user_id' => $userId,
            'token' => $token
        ]);
    } else {
        sendResponse(false, 'Registration failed');
    }
} catch(PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>