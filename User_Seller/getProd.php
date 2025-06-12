<?php
// get_product.php - Fetch product details before deletion

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3306;

try {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

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

    // Prepare and execute query to fetch product details
    $stmt = $conn->prepare("SELECT productId, productName, productDescription, price, category, stock, postedOn 
                       FROM products WHERE productId = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();

    $result = $stmt->get_result();
    $product = $result->fetch_assoc();

    if ($product) {
        // Product found
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
        // Product not found
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Close connection if it exists
    if (isset($conn)) {
        $conn->close();
    }

    // Log database error
    error_log("Database error in get_product.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
}
?>