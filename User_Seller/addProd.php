<?php
session_start();

// Check if user is logged in and is a seller
if (!isset($_SESSION['userID']) || $_SESSION['userRole'] !== 'seller') {
    header("Location: ../Login/login.html");
    exit();
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form data
    $prodName = trim($_POST['prodName']);
    $prodDesc = trim($_POST['prodDesc']);
    $category = $_POST['category'];
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $userID = $_SESSION['userID'];

    // Validate required fields
    if (empty($prodName) || empty($prodDesc) || empty($category) || $price <= 0 || $stock < 0) {
        $error = "Please fill in all required fields with valid values.";
    } else {
        // Handle image upload (optional - storing for future use)
        $imagePath = null;
        if (isset($_FILES['prodImg']) && $_FILES['prodImg']['error'] == 0) {
            $uploadDir = '../Pictures/products/';

            // Create directory if it doesn't exist
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $imageFileType = strtolower(pathinfo($_FILES['prodImg']['name'], PATHINFO_EXTENSION));

            // Check if image file is valid
            $check = getimagesize($_FILES['prodImg']['tmp_name']);
            if ($check === false) {
                $error = "File is not an image.";
            } else {
                // Check file size (limit to 5MB)
                if ($_FILES['prodImg']['size'] > 5000000) {
                    $error = "Sorry, your file is too large. Maximum size is 5MB.";
                } else {
                    // Allow certain file formats
                    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
                        $error = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                    } else {
                        // Generate unique filename
                        $fileName = uniqid() . '_' . time() . '.' . $imageFileType;
                        $targetFile = $uploadDir . $fileName;

                        if (move_uploaded_file($_FILES['prodImg']['tmp_name'], $targetFile)) {
                            $imagePath = 'Pictures/products/' . $fileName;
                            // Note: Image path stored in variable but not in database 
                            // Add image column to database if you want to store image paths
                        } else {
                            $error = "Sorry, there was an error uploading your file.";
                        }
                    }
                }
            }
        }

        // Insert product into database if no errors
        if (!isset($error)) {
            try {
                $sql = "INSERT INTO products (userID, productName, productDescription, price, category, stock, postedOn) 
                        VALUES (?, ?, ?, ?, ?, ?, NOW())";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("issdsi", $userID, $prodName, $prodDesc, $price, $category, $stock);

                if ($stmt->execute()) {
                    $success = "Product added successfully!";
                    // Clear form data
                    $_POST = array();
                } else {
                    $error = "Error adding product: " . $conn->error;
                }

                $stmt->close();
            } catch (Exception $e) {
                $error = "Database error: " . $e->getMessage();
            }
        }

        header("Location: sellerDashboard.html?message=Product+added+successfully");
        exit();
    }
}
?>