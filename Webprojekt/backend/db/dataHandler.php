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
                $appointment = array(
                    "id" => $row["id"],
                    "title" => $row["title"],
                    "location" => $row["location"],
                    "description" => $row["description"],
                    "date" => $row["date"],
                    "time" => $row["time"],
                    "duration" => $row["duration"],
                    "voting_end_date" => $row["voting_end_date"]
                );
                array_push($appointments, $appointment);
            }
        }
    
        return $appointments;
    }
    
    

    public function updateAppointment($id, $title, $location, $description, $date_id, $duration, $voting_end_date) {
        $query = "UPDATE appointments SET title='$title', location='$location', description='$description', date_id='$date_id', duration='$duration', voting_end_date='$voting_end_date' WHERE id='$id'";
        return mysqli_query($this->conn, $query);
    }
    
    
    public function deleteAppointment($id) {
        $query = "DELETE FROM appointments WHERE id='$id'";
        return mysqli_query($this->conn, $query);
    }
    
    

    public function queryDates($appointment_id) {
        $dates = array();
    
        $query = "SELECT id, date, time FROM dates WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);
    
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $date = array(
                    "id" => $row["id"],
                    "date" => $row["date"],
                    "time" => $row["time"]
                );
                array_push($dates, $date);
            }
        }
    
        return $dates;
    }    

    public function insertDate($appointment_id, $date, $time) {
        $query = "INSERT INTO dates (appointment_id, date, time) VALUES ($appointment_id, '$date', '$time')";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function deleteDate($date_id) {
        $query = "DELETE FROM dates WHERE id = $date_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }


    public function queryAppointmentParticipants($appointment_id) {
        $participants = array();
    
        $query = "SELECT id, appointment_id, username FROM participants WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);
    
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $participant = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "username" => $row["username"]
                );
                array_push($participants, $participant);
            }
        }
    
        return $participants;
    }    

    public function insertParticipant($appointment_id, $username) {
        $query = "INSERT INTO participants (appointment_id, username) VALUES ($appointment_id, '$username')";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function updateParticipant($participant_id, $selected_date, $comment) {
        $query = "UPDATE participants SET selected_date='$selected_date', comment='$comment' WHERE id = $participant_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function deleteParticipant($participant_id) {
        $query = "DELETE FROM participants WHERE id = $participant_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    function __destruct() {
        mysqli_close($this->conn);
    }


    public function queryVotes($appointment_id) {
        $votes = array();
        $query = "SELECT * FROM votes WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);
    
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $vote = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date_id" => $row["date_id"],
                    "voter_name" => $row["voter_name"]
                );
                array_push($votes, $vote);
            }
        }
    
        return $votes;
    }
    
    public function insertVote($appointment_id, $date_id, $voter_name) {
        $query = "INSERT INTO votes (appointment_id, date_id, voter_name) VALUES ('$appointment_id', '$date_id', '$voter_name')";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }
    
    public function updateVote($appointment_id, $date_id, $voter_name) {
        $query = "UPDATE votes SET voter_name='$voter_name' WHERE appointment_id='$appointment_id' AND date_id='$date_id'";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }
    
    public function deleteVote($appointment_id, $date_id, $voter_name) {
        $query = "DELETE FROM votes WHERE appointment_id='$appointment_id' AND date_id='$date_id' AND voter_name='$voter_name'";
        $result = mysqli_query($this->conn, $query);
        return $result;
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
}