<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRquest($method, $param)
    {
        switch ($method) {
            case "queryAppointments";
                $res = $this->dh->queryAppointments();
                break;
            case "deleteAppointment";
                $res = $this->dh->deleteAppointment($param);
                break;
            case "queryAppointmentParticipants";
                $res = $this->dh->queryAppointmentParticipants($param);
                break;
            case "insertAppointmentParticipant";
                $res = $this->dh->insertAppointmentParticipant($param, $param, $param);
                break;
            case "queryDates";
                $res = $this->dh->queryDates($param);
                break;
            case "insertDate";
                $res = $this->dh->insertDate($param, $param, $param);
                break;
            case "queryParticipants";
                $res = $this->dh->queryParticipants($param);
                break;
            case "insertParticipant";
                $res = $this->dh->insertParticipant($param, $param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}