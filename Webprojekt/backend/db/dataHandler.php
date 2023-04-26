<?php

require_once("../backend/models/appointment.php");
//require_once ("user.php");
require_once("config.php");

class DataHandler
{
    private $conn;

    public function __construct()
    {
        global $host, $username, $password, $dbname;

        $this->conn = new mysqli($host, $username, $password, $dbname);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        } else {
            //echo "Connected successfully";
        }
    }

    /*public function queryAppointments($fields = [], $appointment_id = null)
    {
        $appointments = array();

        $fieldsStr = implode(",", $fields);
        $query = "SELECT $fieldsStr FROM appointments";
        if ($appointment_id !== null) {
            $query .= " WHERE id=?";
        }

        $stmt = mysqli_prepare($this->conn, $query);
        if ($appointment_id !== null) {
            mysqli_stmt_bind_param($stmt, "i", $appointment_id);
        }
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($appointments, $row);
            }
        }

        return $appointments;
    }*/

    public function queryAppointments($fields = [], $appointment_id = null)
    {
        $appointments = array();

        $fieldsStr = implode(",", $fields);
        $query = "SELECT $fieldsStr, CASE WHEN voting_end_date > NOW() THEN 'open' ELSE 'closed' END AS vote_status FROM appointments";

        if ($appointment_id !== null) {
            $query .= " WHERE id=?";
        }

        $stmt = $this->conn->prepare($query);
        if ($appointment_id !== null) {
            $stmt->bind_param("i", $appointment_id);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if ($row['vote_status'] === 'closed') {
                    // Set a flag to indicate that the appointment cannot be voted on
                    $row['can_vote'] = false;
                } else {
                    $row['can_vote'] = true;
                }
                unset($row['vote_status']);
                array_push($appointments, $row);
            }
        }
        return $appointments;
    }

    public function deleteAppointment($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM appointments WHERE id=?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function queryAppointmentParticipants($appointment_id)
    {
        $participants = array();

        $query = "SELECT * FROM appointment_participants WHERE appointment_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $participant = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date_id" => $row["date_id"],
                    "participant_id" => $row["participant_id"],
                    "vote" => $row["vote"]
                );
                array_push($participants, $participant);
            }
        }

        return $participants;
    }


    public function insertAppointmentParticipant(array $data)
    {
        $stmt = $this->conn->prepare("INSERT INTO appointment_participants (appointment_id, participant_id, date_id, vote) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $data['appointment_id'], $data['participant_id'], $data['date_id'], $data['vote']);
        $result = $stmt->execute();
        $stmt->close();
    }

    public function queryDates($appointment_id)
    {
        $dates = array();

        $stmt = $this->conn->prepare("SELECT * FROM dates WHERE appointment_id = ?");
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $date = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date" => $row["date"],
                    "time" => $row["time"]
                );
                array_push($dates, $date);
            }
        }

        return $dates;
    }

    public function insertDate(array $data)
    {
        $stmt = $this->conn->prepare("INSERT INTO dates (appointment_id, date, time) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $data['appointment_id'], $data['date'], $data['time']);
        $result = $stmt->execute();
        $stmt->close();
        return $result;
    }




    public function queryParticipants($appointment_id)
    {
        $participants = array();
        $stmt = $this->conn->prepare("SELECT id, appointment_id, username, comment FROM participants WHERE appointment_id = ?");
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $participant = array(
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "username" => $row["username"],
                    "comment" => $row["comment"]
                );
                array_push($participants, $participant);
            }
        }

        return $participants;
    }



    public function insertParticipant(array $data)
    {
        $query = "INSERT INTO participants (appointment_id, username, comment) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('iss', $data['appointment_id'], $data['username'], $data['comment']);
        $result = $stmt->execute();
        return $result;
    }


    function __destruct()
    {
        mysqli_close($this->conn);
    }
}
