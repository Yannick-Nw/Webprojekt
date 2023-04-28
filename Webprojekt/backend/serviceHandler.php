<?php
include("businesslogic/simpleLogic.php"); // Einbinden der SimpleLogic-Klasse

$param = null; // Initialisieren des Parameters
$method = ""; // Initialisieren der Methode

isset($_GET["method"]) ? $method = $_GET["method"] : false; // Überprüfen, ob die Methode gesetzt ist
isset($_GET["param"]) ? $param = $_GET["param"] : false; // Überprüfen, ob der Parameter gesetzt ist
isset($_POST["param"]) ? $param = $_POST["param"] : false; // Überprüfen, ob der Parameter gesetzt ist

$logic = new SimpleLogic(); // Erstellen einer Instanz der SimpleLogic-Klasse
$result = $logic->handleRequest($method, $param); // Aufrufen der handleRequest-Methode

if ($result == null) { // Überprüfen, ob das Ergebnis null ist
    response("GET", 500, null); // Rückgabe eines HTTP-Fehlers mit dem Statuscode 500
} else {
    response("GET", 200, $result); // Rückgabe des Ergebnisses mit dem Statuscode 200
}

function response($method, $httpStatus, $data) // Definition der response-Funktion
{
    header('Content-Type: application/json'); // Setzen des Content-Types auf JSON
    switch ($method) { // Überprüfen der Methode
        case "GET": // Wenn die Methode GET ist
            http_response_code($httpStatus); // Setzen des HTTP-Statuscodes auf den übergebenen Wert
            echo (json_encode($data)); // Ausgabe des Ergebnisses als JSON
            break;
        default: // Wenn die Methode nicht GET ist
            http_response_code(405); // Setzen des HTTP-Statuscodes auf 405 (Method Not Allowed)
            echo ("Method not supported yet!"); // Ausgabe einer Fehlermeldung
    }
}