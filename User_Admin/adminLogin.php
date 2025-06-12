<?php
session_start();

$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
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
            
            // Verify password (assuming passwords are hashed with password_hash())
            if ($userPassword === $user['userPassword']) {
                // Login successful
                $_SESSION['user_id'] = $user['userId'];
                $_SESSION['user_name'] = $user['userName'];
                $_SESSION['user_role'] = $user['userRole'];
                $_SESSION['logged_in'] = true;
                
                // Redirect based on user role
                switch ($user['userRole']) {
                    case 'admin':
                        header("Location: /LoginWeb/User_Admin/adminDashboard.html");
                        break;
                    case 'seller':
                        header("Location: /LoginWeb/User_Seller/sellerDashboard.html");
                        break;
                    case 'buyer':
                        header("Location: /LoginWeb/Homepage/homepage.html");
                        break;
                    default:
                        header("Location: /LoginWeb/Homepage/homepage.html");
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