<?php
header('Access-Control-Allow-Origin: *'); // Allow all origins, or specify 'http://localhost:5173'
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start session to track login attempts
session_start();

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

// Initialize login attempts if not set
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

try {
    // Establish PDO connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get input data
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'] ?? '';
    $password = $data['password'] ?? '';
    $adminType = $data['adminType'] ?? '';
    $adminName = $data['adminName'] ?? ''; // Optional admin name

    // Validate input
    if (empty($userId) || empty($password) || empty($adminType)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing userId, password, or adminType']);
        exit;
    }

    // Validate adminType
    $validAdminTypes = ['Admin1', 'Admin2', 'Admin3'];
    if (!in_array($adminType, $validAdminTypes)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid admin type']);
        exit;
    }

    // Handle POST requests
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Check if max attempts reached
        if ($_SESSION['login_attempts'] >= 3) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Maximum login attempts exceeded', 'maxAttemptsReached' => true]);
            exit;
        }

        // Check if admin exists
        $query = "SELECT user_id, password, admin_name FROM admins WHERE user_id = ? AND admin_type = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$userId, $adminType]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            // Verify password (plain text comparison)
            if ($password === $admin['password']) {
                // Verify admin_name if provided
                if (!empty($adminName) && $adminName !== $admin['admin_name']) {
                    $_SESSION['login_attempts']++;
                    http_response_code(401);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Invalid admin name',
                        'attempts' => $_SESSION['login_attempts']
                    ]);
                    exit;
                }

                // Reset login attempts on successful login
                $_SESSION['login_attempts'] = 0;

                // Update last_login timestamp
                $stmt = $conn->prepare("UPDATE admins SET last_login = NOW() WHERE user_id = ? AND admin_type = ?");
                $stmt->execute([$userId, $adminType]);

                echo json_encode(['success' => true, 'message' => 'Login successful']);
            } else {
                $_SESSION['login_attempts']++;
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid password',
                    'attempts' => $_SESSION['login_attempts']
                ]);
            }
        } else {
            $_SESSION['login_attempts']++;
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Admin does not exist',
                'attempts' => $_SESSION['login_attempts']
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
} finally {
    $conn = null; // Close connection
}
?>