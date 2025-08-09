<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $conn->query("SELECT * FROM users");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error fetching users: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $sql = "INSERT INTO users (first_name, middle_name, last_name, email, phone, password, address, city, state, postcode, date_of_birth, national_id, gender)
                    VALUES (:first_name, :middle_name, :last_name, :email, :phone, :password, :address, :city, :state, :postcode, :date_of_birth, :national_id, :gender)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':first_name' => $data['first_name'],
                ':middle_name' => $data['middle_name'] ?? null,
                ':last_name' => $data['last_name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':password' => $data['password'], 
                ':address' => $data['address'] ?? null,
                ':city' => $data['city'] ?? null,
                ':state' => $data['state'] ?? null,
                ':postcode' => $data['postcode'] ?? null,
                ':date_of_birth' => $data['date_of_birth'] ?? null,
                ':national_id' => $data['national_id'] ?? null,
                ':gender' => $data['gender'] ?? null
            ]);
            echo json_encode(["message" => "User created successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error creating user: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $sql = "UPDATE users SET 
                    first_name = :first_name,
                    middle_name = :middle_name,
                    last_name = :last_name,
                    email = :email,
                    phone = :phone,
                    address = :address,
                    city = :city,
                    state = :state,
                    postcode = :postcode,
                    date_of_birth = :date_of_birth,
                    national_id = :national_id,
                    gender = :gender
                    WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ':id' => $data['id'],
                ':first_name' => $data['first_name'],
                ':middle_name' => $data['middle_name'] ?? null,
                ':last_name' => $data['last_name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':address' => $data['address'] ?? null,
                ':city' => $data['city'] ?? null,
                ':state' => $data['state'] ?? null,
                ':postcode' => $data['postcode'] ?? null,
                ':date_of_birth' => $data['date_of_birth'] ?? null,
                ':national_id' => $data['national_id'] ?? null,
                ':gender' => $data['gender'] ?? null
            ]);
            echo json_encode(["message" => "User updated successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error updating user: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete user
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $sql = "DELETE FROM users WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $data['id']);
            $stmt->execute();
            echo json_encode(["message" => "User deleted successfully"]);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error deleting user: " . $e->getMessage()]);
        }
        break;
}

$conn = null;
?>