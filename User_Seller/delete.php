<?php
// delete_product.php - Handle product deletion

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3006;

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Start transaction
    $conn->autocommit(FALSE);

    // Check if request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Get product ID from POST data
    $productId = isset($_POST['productId']) ? trim($_POST['productId']) : '';

    if (empty($productId)) {
        throw new Exception('Product ID is required');
    }

    // Validate product ID is numeric (adjust if your IDs are different format)
    if (!is_numeric($productId)) {
        throw new Exception('Invalid product ID format');
    }

    // First, check if product exists and get its details
    $checkStmt = $conn->prepare("SELECT productId, productName FROM products WHERE productId = ?");
    $checkStmt->bind_param("i", $productId);
    $checkStmt->execute();

    $result = $checkStmt->get_result();
    $product = $result->fetch_assoc();

    if (!$product) {
        throw new Exception('Product not found');
    }

    $checkStmt->close();

    // Hard delete - permanently remove the product
    $deleteStmt = $conn->prepare("DELETE FROM products WHERE productId = ?");
    $deleteStmt->bind_param("i", $productId);
    $deleteResult = $deleteStmt->execute();

    if ($deleteResult && $conn->affected_rows > 0) {

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully',
            'product_name' => $product['productName']
        ]);

        // Log the deletion (optional)
        error_log("Product deleted: ID {$productId}, Name: {$product['productName']}");
    } else {
        throw new Exception('Failed to delete product');
    }

    $deleteStmt->close();
    $conn->close();
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($conn)) {
        $conn->rollback();
        $conn->close();
    }

    // Log database error
    error_log("Database error in delete_product.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>