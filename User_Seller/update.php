<?php
session_start();

require_once 'Session/sessionCheck.php';

$servername = "sql211.infinityfree.com";
$username = "if0_39214006";
$password = 'Aneleh001';
$dbname = "if0_39214006_marketplace";
$port = 3306;


ini_set('display_errors', 0);
error_reporting(E_ALL);


header('Content-Type: application/json');

try {
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $conn->set_charset("utf8");
} catch (Exception $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}


if (!isset($_SESSION['userID'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}


$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetRequest($conn);
            break;
        case 'POST':
            handlePostRequest($conn);
            break;
        case 'PUT':
            handlePutRequest($conn);
            break;
        default:
            throw new Exception('Method not allowed');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGetRequest($conn)
{
    $userID = $_SESSION['userID'];

    if (isset($_GET['search'])) {
        $searchTerm = '%' . $_GET['search'] . '%';
        $stmt = $conn->prepare("
            SELECT productID, productName, productDescription, price, category, stock 
            FROM Products 
            WHERE userID = ? AND (
                productName LIKE ? OR 
                category LIKE ? OR 
                productID LIKE ?
            )
            ORDER BY productName
        ");
        $stmt->bind_param("isss", $userID, $searchTerm, $searchTerm, $searchTerm);
    } else {
        $stmt = $conn->prepare("
            SELECT productID, productName, productDescription, price, category, stock 
            FROM Products 
            WHERE userID = ? 
            ORDER BY productName
        ");
        $stmt->bind_param("i", $userID);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode(['Products' => $products]);
}

function handlePostRequest($conn)
{
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        $input = $_POST;
    }

    $requiredFields = ['productID', 'productName', 'price', 'category', 'stock'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $userID = $_SESSION['userID'];
    $productID = $input['productID'];
    $productName = $input['productName'];
    $productDescription = $input['productDescription'] ?? '';
    $price = floatval($input['price']);
    $category = $input['category'];
    $stock = intval($input['stock']);

    $checkStmt = $conn->prepare("SELECT userID FROM Products WHERE productID = ?");
    $checkStmt->bind_param("i", $productID);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {
        throw new Exception("Product not found");
    }

    $productOwner = $checkResult->fetch_assoc()['userID'];
    if ($productOwner != $userID) {
        throw new Exception("Unauthorized access to product");
    }

    $updateStmt = $conn->prepare("
        UPDATE Products 
        SET productName = ?, productDescription = ?, price = ?, category = ?, stock = ?
        WHERE productID = ? AND userID = ?
    ");
    $updateStmt->bind_param("ssdsiii", $productName, $productDescription, $price, $category, $stock, $productID, $userID);

    if ($updateStmt->execute()) {
        if ($updateStmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No changes were made']);
        }
    } else {
        throw new Exception("Failed to update product");
    }
}

function handlePutRequest($conn)
{
    handlePostRequest($conn);
}
?>