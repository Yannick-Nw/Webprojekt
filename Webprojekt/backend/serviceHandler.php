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
            $users = $result->queryAppointmentUsers($appointmentID);
            echo json_encode($users);
            $details = $result->queryAvailableDates($appointmentID);
            echo json_encode($details);
        }
    }
}
