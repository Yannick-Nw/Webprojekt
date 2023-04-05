<?php
include("./models/appointment.php");

class DataHandler
{
    private $appointments;

    public function __construct()
    {
        $this->appointments = $this->getDemoData();
    }

    public function queryAppointments()
    {
        return $this->appointments;
    }

    public function queryAppointmentById($id)
    {
        $result = array();
        foreach ($this->appointments as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function createAppointment($title, $location, $start, $end)
    {
        $id = count($this->appointments) + 1;
        $appointment = new Appointment($id, $title, $location, $start, $end);
        array_push($this->appointments, array($appointment));
        return $appointment;
    }

    public function updateAppointment($id, $title, $location, $start, $end)
    {
        foreach ($this->appointments as $val) {
            if ($val[0]->id == $id) {
                $val[0]->title = $title;
                $val[0]->location = $location;
                $val[0]->start_time = $start;
                $val[0]->end_time = $end;
                return $val[0];
            }
        }
        return null;
    }

    public function deleteAppointment($id)
    {
        foreach ($this->appointments as $key => $val) {
            if ($val[0]->id == $id) {
                unset($this->appointments[$key]);
                return true;
            }
        }
        return false;
    }

    private function getDemoData()
    {
        $demodata = [
            [new Appointment(1, "Team meeting", "Conference room", "2023-04-12 10:00:00", "2023-04-12 11:00:00")],
            [new Appointment(2, "Project review", "Online", "2023-04-15 14:00:00", "2023-04-15 16:00:00")],
            [new Appointment(3, "Client presentation", "Client office", "2023-04-20 09:00:00", "2023-04-20 11:00:00")],
            [new Appointment(4, "Training session", "Training room", "2023-04-25 13:00:00", "2023-04-25 15:00:00")],
        ];
        return $demodata;
    }
}
?>