<?php
$servername = "localhost";
$username = "root";
$password = 'Ad1$QL';
$dbname = "marketplace";
$port = 3006;

$conn = new mysqli( $servername, $username, $password, $dbname, $port );

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully!";

$conn->set_charset("utf8");
?>