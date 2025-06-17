<?php
session_start();

if (!isset($_SESSION['userID']) || $_SESSION['userRole'] !== 'seller') {
    header("Location: ../Login/login.html");
    exit();
}

$servername = "sql211.infinityfree.com";
$username = "if0_39214006";
$password = 'Aneleh001';
$dbname = "if0_39214006_marketplace";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $prodName = trim($_POST['prodName']);
    $prodDesc = trim($_POST['prodDesc']);
    $category = $_POST['category'];
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $userID = $_SESSION['userID'];

    if (empty($prodName) || empty($prodDesc) || empty($category) || $price <= 0 || $stock < 0) {
        echo "Please fill in all required fields with valid values.";
    } else {
        try {
            $sql = "INSERT INTO Products (userID, productName, productDescription, price, category, stock, postedOn) 
                    VALUES (?, ?, ?, ?, ?, ?, NOW())";

            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }

            $stmt->bind_param("sssdsi", $userID, $prodName, $prodDesc, $price, $category, $stock);

            if ($stmt->execute()) {
                header("Location: sellerDashboard.html?message=Product+added+successfully");
                exit();
            } else {
                echo "Error executing query: " . $stmt->error;
            }

            $stmt->close();
        } catch (Exception $e) {
            echo "Database error: " . $e->getMessage();
        }
    }
}
?>