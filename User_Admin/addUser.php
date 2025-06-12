<?php
session_start();

$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3006;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $userName = trim($_POST["userName"]);
    $email = trim($_POST["email"]);
    $firstName = trim($_POST["firstName"]);
    $lastName = trim($_POST["lastName"]);
    $password = trim($_POST["pswd"]);
    $userRole = trim($_POST["userRole"]);

    $errors = array();

    if(empty($userName)) {
        $errors[] = "Username is required!";
    }

    if(empty($email)) {
        $errors[] = "Email is required!";
    }

    if(empty($firstName)) {
        $errors[] = "First name is required!";
    }

    if(empty($lastName)) {
        $errors[] = "Last name is required!";
    }

    if(empty($password)) {
        $errors[] = "Password is required!";
    }

    if(empty($userRole)) {
        $errors[] = "User role is required!";
    }


    if(empty($errors)) {
        $checkSql = "SELECT userID FROM users WHERE userName = ? OR email = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ss", $userName, $email);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if($result->num_rows > 0) {
            $errors[] = "Username or email already exists";
        }

        $checkStmt->close();

    }

    if(empty($errors)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (userName, email, userPassword, userRole, createdAt) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);

        if($stmt) {
            $stmt->bind_param("ssss", $userName, $email, $hashedPassword, $userRole);

            if($stmt->execute()) {
                echo "<script>
                    alert('User added successfully!');
                    window.location.href = 'userManage.html';
                    </script>";
                exit();
            } else {
                $errors[] = "Error adding user";
            }
            $stmt->close();
        } else {
            $errors[] = "Error with statement";
        }
    }

    $conn->close();
}

?>