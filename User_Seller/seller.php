<?php
session_start();

// Check if user is logged in and is a seller
if (!isset($_SESSION['userID']) || $_SESSION['userRole'] !== 'seller') {
    header("Location: ../Login/login.html");
    exit();
}

// Check for success message
$successMessage = '';
if (isset($_SESSION['success_message'])) {
    $successMessage = $_SESSION['success_message'];
    unset($_SESSION['success_message']); // Clear the message after displaying
}

// Redirect to the HTML dashboard with success message if needed
if (!empty($successMessage)) {
    // Store the message in a way that can be accessed by the HTML page
    $_SESSION['temp_success_message'] = $successMessage;
}

// Redirect to the HTML dashboard
header("Location: sellerDashboard.html");
exit();
?>