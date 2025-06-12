<?php
session_start();

$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $userID = $_POST['userID'];

    $userName = trim($_POST['userName']);
    $email = trim($_POST['email']);

    
    if (empty($userID) && (!empty($userName) || !empty($email))) {
        $searchSql = "SELECT userID FROM users WHERE userName = ? OR email = ?";
        $searchStmt = $conn->prepare($searchSql);
        $searchStmt->bind_param("ss", $userName, $email);
        $searchStmt->execute();
        $searchResult = $searchStmt->get_result();

        if ($searchResult->num_rows > 0) {
            $searchUser = $searchResult->fetch_assoc();
            $userID = $searchUser["userID"];
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

    $checkSql = "SELECT userID, userName FROM users WHERE userID = ?";
    $checkStmt = $conn->prepare($checkSql);
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
        $deleteSql = "DELETE FROM users WHERE userID = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->bind_param("i", $userID);

        if ($deleteStmt->execute()) {
            if ($deleteStmt->affected_rows > 0) {
                $conn->commit();

                echo "<script>
                    alert('User has been removed');
                    window.location.href = 'userManage.html';
                    </script>";
            } else {
                throw new Exception("No user was deleted");
            }
        } else {
            throw new Exception("Error executing delete query");
        }

        $deleteStmt->close();
    } catch (Exception $e) {
        $conn->rollback();

        echo "<script>
            alert('Error removing user');
            window.history.back();
            </script>";
    }
}

$conn->close();
