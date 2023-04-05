<?php
// Konfigurationsdaten für die Datenbankverbindung
$host = "localhost";
$username = "meinBenutzername";
$password = "meinPasswort";
$dbname = "meineDatenbank";

// Verbindung zur Datenbank herstellen
$conn = mysqli_connect($host, $username, $password, $dbname);

// Fehlerbehandlung bei Verbindungsfehlern
if (!$conn) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . mysqli_connect_error());
}
?>