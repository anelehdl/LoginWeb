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

    $stmt = $conn->prepare("SELECT productId, productName, productDescription, price, category, stock, postedOn 
                       FROM Products WHERE productId = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();

    $result = $stmt->get_result();
    $product = $result->fetch_assoc();

    if ($product) {
        echo json_encode([
            'success' => true,
            'product' => [
                'id' => $product['productId'],
                'name' => $product['productName'],
                'price' => number_format($product['price'], 2),
                'category' => $product['category'],
                'description' => $product['productDescription'],
                'stock' => $product['stock'],
                'posted_on' => $product['postedOn']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    error_log("Database error in get_product.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
}
?>