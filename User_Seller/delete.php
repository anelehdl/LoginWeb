<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "sql211.infinityfree.com";
$username = "if0_39214006";
$password = 'Aneleh001';
$dbname = "if0_39214006_marketplace";
$port = 3306;

try {
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $conn->autocommit(FALSE);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $productId = isset($_POST['productId']) ? trim($_POST['productId']) : '';

    if (empty($productId)) {
        throw new Exception('Product ID is required');
    }

    if (!is_numeric($productId)) {
        throw new Exception('Invalid product ID format');
    }

    $checkStmt = $conn->prepare("SELECT productId, productName FROM Products WHERE productId = ?");
    $checkStmt->bind_param("i", $productId);
    $checkStmt->execute();

    $result = $checkStmt->get_result();
    $product = $result->fetch_assoc();

    if (!$product) {
        throw new Exception('Product not found');
    }

    $checkStmt->close();

    $deleteStmt = $conn->prepare("DELETE FROM Products WHERE productId = ?");
    $deleteStmt->bind_param("i", $productId);
    $deleteResult = $deleteStmt->execute();

    if ($deleteResult && $conn->affected_rows > 0) {
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully',
            'product_name' => $product['productName']
        ]);

        error_log("Product deleted: ID {$productId}, Name: {$product['productName']}");
    } else {
        throw new Exception('Failed to delete product');
    }

    $deleteStmt->close();
    $conn->close();
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollback();
        $conn->close();
    }

    error_log("Database error in delete_product.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>