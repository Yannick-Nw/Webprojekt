<?php
$host = "localhost";
$username = "bif2webscriptinguser";
$password = "bif2021";
$dbname = "webprojekt";
$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . mysqli_connect_error());
} else {
    //echo "Connected successfully";
}

?>