<?php

require_once ("../backend/models/appointment.php");
//require_once ("user.php");
require_once ("config.php");

class DataHandler {
    private $conn;

    public function __construct() {
        global $host, $username, $password, $dbname;
    
        $this->conn = new mysqli($host, $username, $password, $dbname);
    
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        } else {
            //echo "Connected successfully";
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

    // weitere Methoden ?

    public function insertAppointment($appointment) {
        $title = $appointment->getTitle();
        $location = $appointment->getLocation();
        $start_date = $appointment->getStartDate();
        $end_date = $appointment->getEndDate();
        $voting_end_date = $appointment->getVotingEndDate();

        $query = "INSERT INTO appointments (title, location, start_date, end_date, voting_end_date) VALUES ('$title', '$location', '$start_date', '$end_date', '$voting_end_date')";

        if ($this->conn->query($query) === TRUE) {
            $last_id = $this->conn->insert_id;
            return $last_id;
        } else {
            die("Error: " . $query . "<br>" . $this->conn->error);
        }
    }

    public function insertAppointmentUser($appointment_id, $user_id, $selected_date, $comment) {
        $query = "INSERT INTO appointments_users (appointment_id, user_id, selected_date, comment) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iiss", $appointment_id, $user_id, $selected_date, $comment);
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    public function insertAvailableDate($appointment_id, $date) {
        $query = "INSERT INTO available_dates (appointment_id, date) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $appointment_id, $date);
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            return true;
        } else {
            return false;
        }
    }
}