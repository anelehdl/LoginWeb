<?php
// Session/sessionCheck.php

function startSession()
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

// Generic session check - works for all user types
function checkSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: ../Login/login.html");
        exit();
    }
}

// Specific check for sellers only
function checkSellerSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'seller') {
        header("Location: ../Login/login.html");
        exit();
    }
}

// Specific check for buyers only
function checkBuyerSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'buyer') {
        header("Location: ../Login/login.html");
        exit();
    }
}

// Specific check for admin only
function checkAdminSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'admin') {
        header("Location: ../Login/login.html");
        exit();
    }
}

// Get user information functions
function getUserId()
{
    startSession();
    return $_SESSION['user_id'] ?? null;
}

function getUserName()
{
    startSession();
    return $_SESSION['user_name'] ?? null;
}

function getUserRole()
{
    startSession();
    return $_SESSION['user_role'] ?? null;
}

// For sellers, the sellerId is the same as userId
function getSellerId()
{
    startSession();

    if ($_SESSION['user_role'] !== 'seller') {
        return null;
    }

    return $_SESSION['user_id'] ?? null;
}

function getSellerName()
{
    startSession();
    return ($_SESSION['user_role'] === 'seller') ? $_SESSION['user_name'] : null;
}

// Generic utility functions
function isLoggedIn()
{
    startSession();
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

function isSeller()
{
    startSession();
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'seller';
}

function isBuyer()
{
    startSession();
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'buyer';
}

function isAdmin()
{
    startSession();
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

// Logout function
function logout()
{
    startSession();
    session_unset();
    session_destroy();
    header("Location: ../Login/login.html");
    exit();
}
?>