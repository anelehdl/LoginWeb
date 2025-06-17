<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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

    $sql = "SELECT productId, productName, productDescription, price, category, stock FROM Products ORDER BY productName";
    $result = $conn->query($sql);

    $products = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = array(
                'id' => $row['productId'],
                'name' => $row['productName'],
                'description' => $row['productDescription'],
                'price' => number_format((float) $row['price'], 2),
                'category' => $row['category'],
                'stock' => (int) $row['stock']
            );
        }
    }

    echo json_encode(array(
        'success' => true,
        'products' => $products,
        'count' => count($products)
    ));

} catch (Exception $e) {
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage()
    ));
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?>