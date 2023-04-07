<?php 
require_once ("db/dataHandler.php");
$result = new DataHandler();
$appointments = $result->queryAppointments();
echo json_encode($appointments);
echo $test;
