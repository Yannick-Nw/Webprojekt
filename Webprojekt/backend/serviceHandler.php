<?php
require_once("db/dataHandler.php");
$result = new DataHandler();
if (!empty($_GET['param'])) {
    $requestTyp = $_GET['param'];
    if ($requestTyp == 'main') {
        $appointments = $result->queryAppointments();
        //$merged_array = array_merge($appointments, $appointments);
        echo json_encode($appointments);
    } elseif ($requestTyp == 'details') {
        if (!empty($_GET['id'])) {
            $appointmentID = $_GET['id'];
            $details = $result->queryDates($appointmentID);
            $participants = $result->queryAppointmentParticipants($appointmentID);
            $merged_array = array_merge($details, $participants);
            echo json_encode($merged_array);
        }
    }
}
