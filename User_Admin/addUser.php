<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
$servername = "sql211.infinityfree.com";
$username = "if0_39214006";
$password = 'Aneleh001';
$dbname = "if0_39214006_marketplace";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userName = isset($_POST["userName"]) ? trim($_POST["userName"]) : '';
    $email = isset($_POST["email"]) ? trim($_POST["email"]) : '';
    $phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : '';
    $address = isset($_POST["address"]) ? trim($_POST["address"]) : '';
    $password = isset($_POST["pswd"]) ? trim($_POST["pswd"]) : '';
    $userRole = isset($_POST["userRole"]) ? trim($_POST["userRole"]) : '';

    $errors = array();

    if (empty($userName)) {
        $errors[] = "Username is required!";
    }
    if (empty($email)) {
        $errors[] = "Email is required!";
    }
    if (empty($password)) {
        $errors[] = "Password is required!";
    }
    if (empty($userRole)) {
        $errors[] = "User role is required!";
    }

    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format!";
    }

    if (empty($errors)) {
        $checkSql = "SELECT userId FROM Users WHERE userName = ? OR email = ?";
        $checkStmt = $conn->prepare($checkSql);

        if (!$checkStmt) {
            die("Prepare failed: " . $conn->error);
        }

        $checkStmt->bind_param("ss", $userName, $email);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows > 0) {
            $errors[] = "Username or email already exists";
        }
        $checkStmt->close();
    }

    if (empty($errors)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO Users (userName, email, userPassword, phone, address, userRole, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("ssssss", $userName, $email, $hashedPassword, $phone, $address, $userRole);

            if ($stmt->execute()) {
                echo "<script>
                    alert('User added successfully!');
                    window.location.href = 'userManage.html';
                </script>";
                exit();
            } else {
                $errors[] = "Error adding user: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $errors[] = "Error preparing statement: " . $conn->error;
        }
    }

    if (!empty($errors)) {
        echo "<script>";
        foreach ($errors as $error) {
            echo "alert('" . addslashes($error) . "');";
        }
        echo "window.history.back();";
        echo "</script>";
    }
}

$conn->close();
?>