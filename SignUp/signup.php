<?php
header('Content-Type: application/json');

$servername = "sql211.infinityfree.com";
$username = "if0_39214006";
$password = 'Aneleh001';
$dbname = "if0_39214006_marketplace";
$port = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception("No data received");
    }

    $userName = $input['userName'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $phoneNum = $input['phoneNum'] ?? '';
    $address = $input['address'] ?? '';
    $userRole = $input['userRole'] ?? '';

    if (empty($userName) || empty($email) || empty($password) || empty($phoneNum) || empty($address) || empty($userRole)) {
        throw new Exception("All fields are required");
    }

    $checkStmt = $conn->prepare("SELECT userId FROM Users WHERE userName = :userName OR email = :email");
    $checkStmt->bindParam(':userName', $userName);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        throw new Exception("Username or email already exists");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO Users (userName, email, userPassword, phone, address, userRole, createdAt) 
                           VALUES (:userName, :email, :userPassword, :phone, :address, :userRole, NOW())");

    $stmt->bindParam(':userName', $userName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':userPassword', $hashedPassword);
    $stmt->bindParam(':phone', $phoneNum);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':userRole', $userRole);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully',
            'userId' => $conn->lastInsertId()
        ]);
    } else {
        throw new Exception("Failed to insert user data");
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    $conn = null;
}
?>