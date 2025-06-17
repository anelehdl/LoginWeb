<?php
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
    $userName = trim($_POST['userName']);
    $userPassword = $_POST['pswd'];

    if (empty($userName) || empty($userPassword)) {
        $error = "Please fill in all fields.";
    } else {
        $stmt = $conn->prepare("SELECT userId, userName, userPassword, userRole FROM Users WHERE userName = ?");
        $stmt->bind_param("s", $userName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            if (password_verify($userPassword, $user['userPassword'])) {
                $_SESSION['userID'] = $user['userId'];
                $_SESSION['userName'] = $user['userName'];
                $_SESSION['userRole'] = $user['userRole'];
                $_SESSION['logged_in'] = true;

                session_regenerate_id(true);

                switch ($user['userRole']) {
                    case 'admin':
                        header("Location: ../User_Admin/adminDashboard.html");
                        break;
                    case 'seller':
                        header("Location: ../User_Seller/sellerDashboard.html");
                        break;
                    case 'buyer':
                        header("Location: ../Homepage/homepage.html");
                        break;
                    default:
                        header("Location: ../Homepage/homepage.html");
                }
                exit();
            } else {
                $error = "Invalid username or password.";
            }
        } else {
            $error = "Invalid username or password.";
        }

        $stmt->close();
    }
}

$conn->close();
?>