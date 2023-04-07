<?php

require_once ("models/appointment.php");
//require_once ("user.php");
require_once ("config.php");

class DataHandler {
    private $conn;

    public function __construct() {
        global $config;

        $this->conn = new mysqli($config['host'], $config['username'], $config['password'], $config['dbname']);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function queryAppointments() {
        $appointments = array();

        $query = "SELECT * FROM appointments";
        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $appointment = new Appointment(
                    $row["id"],
                    $row["title"],
                    $row["location"],
                    $row["start_date"],
                    $row["end_date"],
                    $row["voting_end_date"]
                );
                array_push($appointments, $appointment);
            }
        }

        return $appointments;
    }

    public function queryAppointmentUsers($appointment_id) {
        $appointment_users = array();

        $query = "SELECT * FROM appointments_users WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $appointment_user = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "user_id" => $row["user_id"],
                    "selected_date" => $row["selected_date"],
                    "comment" => $row["comment"]
                );
                array_push($appointment_users, $appointment_user);
            }
        }

        return $appointment_users;
    }

    public function queryAvailableDates($appointment_id) {
        $available_dates = array();

        $query = "SELECT * FROM available_dates WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $available_date = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date" => $row["date"]
                );
                array_push($available_dates, $available_date);
            }
        }

        return $available_dates;
    }

    /*public function queryUsers() {
        $users = array();

        $query = "SELECT * FROM users";
        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $user = new user(
                    $row["id"],
                    $row["username"]
                );
                array_push($users, $user);
            }
        }

        return $users;
    }*/

    // Restliche Methoden ...
}

?>
