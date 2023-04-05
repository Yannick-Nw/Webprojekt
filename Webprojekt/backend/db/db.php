<?php
$servername = "localhost";
$username = "";
$dbname = "Webprojekt";
$conn = new mysqli($servername, $username, $dbname);
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>