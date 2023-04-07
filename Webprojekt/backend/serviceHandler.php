<?php 
require_once ("db/dataHandler.php");
$result = new DataHandler();
$appointments = $result->queryAppointments();
$test = json_encode($appointments);
echo $test;
