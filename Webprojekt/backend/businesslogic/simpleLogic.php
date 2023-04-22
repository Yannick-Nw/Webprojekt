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
            case "updateAppointment";
                $res = $this->dh->updateAppointment($id, $title, $location, $description, $duration, $voting_end_date, $actual_appointment);
                break;
            case "queryAppointments";
                $res = $this->dh->queryAppointments();
                break;
            case "queryAppointments";
                $res = $this->dh->queryAppointments();
                break;
            case "queryAppointments";
                $res = $this->dh->queryAppointments();
                break;
            case "queryAppointmentParticipants";
                $res = $this->dh->queryAppointmentParticipants($appointment_id);
                break;
            case "queryDates";
                $res = $this->dh->queryDates($appointment_id);
                break;
            case "queryParticipants";
                $res = $this->dh->queryParticipants($appointment_id);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}