<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryAppointments"; // Abfrage von Terminen
                $res = $this->dh->queryAppointments($param);
                break;
            case "createAppointment"; // Abfrage von Terminen
                $res = $this->dh->createAppointment($param);
                break;
            case "deleteAppointment"; // Löschen von Terminen
                $res = $this->dh->deleteAppointment($param);
                break;
            case "queryAppointmentParticipants"; // Abfrage von Teilnehmern eines Termins
                $res = $this->dh->queryAppointmentParticipants($param);
                break;
            case "insertAppointmentParticipant"; // Einfügen eines Teilnehmers in einen Termin
                $res = $this->dh->insertAppointmentParticipant($param);
                break;
            case "queryDates"; // Abfrage von Daten
                $res = $this->dh->queryDates($param);
                break;
            case "insertDate"; // Einfügen von Daten
                $res = $this->dh->insertDate($param);
                break;
            case "queryParticipants"; // Abfrage von Teilnehmern
                $res = $this->dh->queryParticipants($param);
                break;
            case "insertParticipant"; // Einfügen eines Teilnehmers
                $res = $this->dh->insertParticipant($param);
                break;
            default:
                $res = null; // Standardfall
                break;
        }
        return $res; // Rückgabe des Ergebnisses
    }
}