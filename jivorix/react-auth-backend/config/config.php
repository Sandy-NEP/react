<?php
// Enable CORS for the React frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'user_auth';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // It will create database tables if not exist
    $conn->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100),
            middle_name VARCHAR(100),
            last_name VARCHAR(100),
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(20),
            password VARCHAR(255),
            address TEXT,
            city VARCHAR(100),
            state VARCHAR(100),
            postcode VARCHAR(20),
            date_of_birth DATE,
            national_id VARCHAR(50),
            gender ENUM('Male', 'Female', 'Other'),
            profile_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            password VARCHAR(255),
            admin_name VARCHAR(100),
            admin_type ENUM('Super', 'Moderator', 'Support', 'Custom') DEFAULT 'Support',
            last_login DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS otp (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE),
            first_name VARCHAR(100),
            ip VARCHAR(45) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_email (email),
            INDEX idx_user_id (user_id),
            INDEX idx_ip (ip)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            item_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            available INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS cart_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            available INT NOT NULL,
            size VARCHAR(50),
            quantity INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS favorites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255),
            description TEXT,
            price VARCHAR(50) NOT NULL,
            original_price VARCHAR(50),
            category VARCHAR(100),
            gender VARCHAR(50),
            available INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_product (user_id, product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS paymentondelivery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            customer_name VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            country VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            products JSON NOT NULL,
            transaction_id VARCHAR(50) NOT NULL UNIQUE,
            payment_method VARCHAR(50) NOT NULL,
            payment_amount DECIMAL(10, 2) NOT NULL,
            product_amount DECIMAL(10, 2) NOT NULL,
            delivery_charge DECIMAL(10, 2) NOT NULL,
            discount DECIMAL(10, 2) NOT NULL,
            applied_promo VARCHAR(100),
            order_date DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS onlinepayment (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            customer_name VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            country VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            products JSON NOT NULL,
            transaction_id VARCHAR(50) NOT NULL UNIQUE,
            payment_method VARCHAR(50) NOT NULL,
            payment_amount DECIMAL(10, 2) NOT NULL,
            product_amount DECIMAL(10, 2) NOT NULL,
            delivery_charge DECIMAL(10, 2) NOT NULL,
            discount DECIMAL(10, 2) NOT NULL,
            applied_promo VARCHAR(100),
            order_date DATETIME NOT NULL,
            payment_gateway VARCHAR(50),
            gateway_transaction_id VARCHAR(100),
            payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS creditcardpayment (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            customer_name VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            country VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            products JSON NOT NULL,
            transaction_id VARCHAR(50) NOT NULL UNIQUE,
            payment_method VARCHAR(50) NOT NULL,
            payment_amount DECIMAL(10, 2) NOT NULL,
            product_amount DECIMAL(10, 2) NOT NULL,
            delivery_charge DECIMAL(10, 2) NOT NULL,
            discount DECIMAL(10, 2) NOT NULL,
            applied_promo VARCHAR(100),
            order_date DATETIME NOT NULL,
            card_last_four VARCHAR(4),
            card_type VARCHAR(20),
            payment_processor VARCHAR(50),
            processor_transaction_id VARCHAR(100),
            payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch(PDOException $e) {
    sendResponse(false, "Database connection or table creation failed: " . $e->getMessage());
}

// JWT Secret Key (replace with a secure key in production)
define('JWT_SECRET', 'your_very_strong_secret_key_here_change_this');

// Response function for consistent API responses
function sendResponse($success, $message = '', $data = []) {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// JWT generation function
function generateJWT($userId, $email) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'userId' => $userId,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24) // 24 hours
    ]);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// JWT verification function (JSON(JavaScript Object Notation) Web Token)
function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }

    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
    $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[2]));

    $expectedSignature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], JWT_SECRET, true);

    if (hash_equals($signature, $expectedSignature)) {
        $payloadData = json_decode($payload, true);
        if ($payloadData['exp'] > time()) {
            return $payloadData;
        }
    }
    return false;
}

// Password hashing and verification functions
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Cleanup old OTP records
function cleanupOldResetAttempts($conn) {
    $stmt = $conn->prepare('DELETE FROM otp WHERE expires_at < NOW()');
    $stmt->execute();
}

cleanupOldResetAttempts($conn);
?>