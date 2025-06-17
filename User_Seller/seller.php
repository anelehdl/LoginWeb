<?php
session_start();

if (!isset($_SESSION['userID']) || $_SESSION['userRole'] !== 'seller') {
    header("Location: ../Login/login.html");
    exit();
}

$successMessage = '';
if (isset($_SESSION['success_message'])) {
    $successMessage = $_SESSION['success_message'];
    unset($_SESSION['success_message']);
}

if (!empty($successMessage)) {
    $_SESSION['temp_success_message'] = $successMessage;
}

header("Location: sellerDashboard.html");
exit();
?>