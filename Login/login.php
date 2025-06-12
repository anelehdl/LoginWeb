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

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize
    $userName = trim($_POST['userName']);
    $userPassword = $_POST['pswd'];

    // Validate input
    if (empty($userName) || empty($userPassword)) {
        $error = "Please fill in all fields.";
    } else {
        // Prepare SQL statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT userId, userName, userPassword, userRole FROM Users WHERE userName = ?");
        $stmt->bind_param("s", $userName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            // Verify password using password_verify() for hashed passwords
            if (password_verify($userPassword, $user['userPassword'])) {
                // Login successful - UPDATED SESSION VARIABLE NAMES
                $_SESSION['userID'] = $user['userId'];        // Changed from 'user_id' to 'userID'
                $_SESSION['userName'] = $user['userName'];     // Changed from 'user_name' to 'userName'  
                $_SESSION['userRole'] = $user['userRole'];     // Changed from 'user_role' to 'userRole'
                $_SESSION['logged_in'] = true;

                // Regenerate session ID for security
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