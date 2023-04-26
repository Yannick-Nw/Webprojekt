<?php
require_once("db/dataHandler.php");
$result = new DataHandler();
if (!empty($_GET['param'])) {
    $requestTyp = $_GET['param'];
    header("Content-Type: application/json");
    if ($requestTyp == 'main') {
        $appointments = $result->queryAppointments(["id", "title", "location", "duration", "voting_end_date", "actual_appointment"]);
        //$participants = $result->queryParticipants();
        //$merged_array = array_merge($appointments, $participants);
        echo json_encode($appointments);
    } elseif ($requestTyp == 'details') {
        if (!empty($_GET['id'])) {
            $appointmentID = $_GET['id'];
            $appointments = $result->queryAppointments(["title", "description"], $appointmentID);
            $details = $result->queryDates($appointmentID);
            $vote = $result->queryAppointmentParticipants($appointmentID);
            $participants = $result->queryParticipants($appointmentID);
            $merged_array = array_merge($appointments, $details, $participants, $vote);
            echo json_encode($merged_array);
        }
    }
} else {
    // HTTP-Statuscode auf 400 (Bad Request) setzen
    http_response_code(400);

    // Fehlermeldung zurückgeben
    echo "Fehler: Falscher Parameter übergeben";
    exit;
}
