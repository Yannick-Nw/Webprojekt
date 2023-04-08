<?php 
require_once ("db/dataHandler.php");
$result = new DataHandler();
if (!empty($_GET['param'])) {
    $appointmentDetails = $_GET['param'];
    if ($appointmentDetails == 'detail') {
        $users = $result->queryAppointmentUsers($appointmentDetails);
        echo json_encode($users);
        $details = $result->queryAvailableDates($appointmentDetails);
        echo json_encode($details);
    } elseif ($appointmentDetails == 'main') {
        $appointments = $result->queryAppointments();
        echo json_encode($appointments);
    }
}