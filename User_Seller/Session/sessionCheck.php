<?php
function startSession()
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

function checkSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header("Location: ../Login/login.html");
        exit();
    }
}

function checkSellerSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'seller') {
        header("Location: ../Login/login.html");
        exit();
    }
}

function checkBuyerSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'buyer') {
        header("Location: ../Login/login.html");
        exit();
    }
}

function checkAdminSession()
{
    startSession();

    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_role'] !== 'admin') {
        header("Location: ../Login/login.html");
        exit();
    }
}

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
?>