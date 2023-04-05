<?php
$host = "localhost";
$username = "meinBenutzername";
$password = "meinPasswort";
$dbname = "meineDatenbank";
$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . mysqli_connect_error());
}
?>