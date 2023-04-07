<?php 
require_once ("dataHandler.php");
$result = new DataHandler();
$test = json_encode($result);
echo $test;
