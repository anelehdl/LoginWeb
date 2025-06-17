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
    $userID = isset($_POST['userID']) ? $_POST['userID'] : '';
    $userName = isset($_POST['userName']) ? trim($_POST['userName']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';

    if (empty($userID) && (!empty($userName) || !empty($email))) {
        $searchSql = "SELECT userId FROM Users WHERE userName = ? OR email = ?";
        $searchStmt = $conn->prepare($searchSql);

        if (!$searchStmt) {
            die("Prepare failed: " . $conn->error);
        }

        $searchStmt->bind_param("ss", $userName, $email);
        $searchStmt->execute();
        $searchResult = $searchStmt->get_result();

        if ($searchResult->num_rows > 0) {
            $searchUser = $searchResult->fetch_assoc();
            $userID = $searchUser["userId"];
        } else {
            echo "<script>
                alert('User not found');
                window.history.back();
            </script>";
            $searchStmt->close();
            $conn->close();
            exit();
        }
        $searchStmt->close();
    }

    if (empty($userID) || !is_numeric($userID)) {
        echo "<script>
            alert('Invalid user ID');
            window.history.back();
        </script>";
        exit();
    }

    $checkSql = "SELECT userId, userName FROM Users WHERE userId = ?";
    $checkStmt = $conn->prepare($checkSql);

    if (!$checkStmt) {
        die("Prepare failed: " . $conn->error);
    }

    $checkStmt->bind_param("i", $userID);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows == 0) {
        echo "<script>
            alert('User not found');
            window.history.back();
        </script>";
        $checkStmt->close();
        $conn->close();
        exit();
    }

    $user = $result->fetch_assoc();
    $userName = $user["userName"];
    $checkStmt->close();

    $conn->begin_transaction();

    try {
        $deleteSql = "DELETE FROM Users WHERE userId = ?";
        $deleteStmt = $conn->prepare($deleteSql);

        if (!$deleteStmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $deleteStmt->bind_param("i", $userID);

        if ($deleteStmt->execute()) {
            if ($deleteStmt->affected_rows > 0) {
                $conn->commit();
                echo "<script>
                    alert('User \"" . htmlspecialchars($userName) . "\" has been removed');
                    window.location.href = 'userManage.html';
                </script>";
            } else {
                throw new Exception("No user was deleted");
            }
        } else {
            throw new Exception("Error executing delete query: " . $deleteStmt->error);
        }
        $deleteStmt->close();

    } catch (Exception $e) {
        $conn->rollback();
        echo "<script>
            alert('Error removing user: " . addslashes($e->getMessage()) . "');
            window.history.back();
        </script>";
    }
}

$conn->close();
?>