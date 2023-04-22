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

    /*  public function queryAppointments() {
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
                    "duration" => $row["duration"],
                    "voting_end_date" => $row["voting_end_date"],
                    "actual_appointment" => $row["actual_appointment"]
                );
                array_push($appointments, $appointment);
            }
        }
    
        return $appointments;
    }
*/

    public function queryAppointments($fields = [], $appointment_id = null)
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
    }



    /*public function updateAppointment($id, $title, $location, $description, $duration, $voting_end_date, $actual_appointment)
    {
        $query = "UPDATE appointments SET title='$title', location='$location', description='$description', duration='$duration', voting_end_date='$voting_end_date' actual_appointment='$actual_appointment' WHERE id='$id'";
        return mysqli_query($this->conn, $query);
    }

    public function deleteAppointment($id)
    {
        $query = "DELETE FROM appointments WHERE id='$id'";
        return mysqli_query($this->conn, $query);
    }*/

    public function updateAppointment($id, $title, $location, $description, $duration, $voting_end_date, $actual_appointment)
{
    $stmt = $this->conn->prepare("UPDATE appointments SET title=?, location=?, description=?, duration=?, voting_end_date=?, actual_appointment=? WHERE id=?");
    $stmt->bind_param("ssssssi", $title, $location, $description, $duration, $voting_end_date, $actual_appointment, $id);
    return $stmt->execute();
}

public function deleteAppointment($id)
{
    $stmt = $this->conn->prepare("DELETE FROM appointments WHERE id=?");
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}


    /*public function queryAppointmentParticipants($appointment_id)
    {
        $participants = array();

        $query = "SELECT * FROM appointment_participants WHERE appointment_id=$appointment_id";

        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
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
    }*/


    public function queryAppointmentParticipants($appointment_id)
{
    $participants = array();

    $query = "SELECT * FROM appointment_participants WHERE appointment_id = ?";
    $stmt = mysqli_prepare($this->conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $appointment_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
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


    /*public function insertAppointmentParticipant($appointment_id, $participant_id, $vote)
    {
        $query = "INSERT INTO appointment_participants (appointment_id, participant_id, vote) VALUES ('" . $appointment_id . "', '" . $participant_id . "', '" . $vote . "')";

        $result = mysqli_query($this->conn, $query);

        if ($result) {
            return true;
        } else {
            return false;
        }
    }*/



    public function insertAppointmentParticipant($appointment_id, $participant_id, $vote)
{
    $stmt = $this->conn->prepare("INSERT INTO appointment_participants (appointment_id, participant_id, vote) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $appointment_id, $participant_id, $vote);
    $result = $stmt->execute();
    $stmt->close();

    if ($result) {
        return true;
    } else {
        return false;
    }
}


    /*public function queryDates($appointment_id)
    {
        $dates = array();

        $query = "SELECT * FROM dates WHERE appointment_id = " . $appointment_id;
        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
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
    }*/

    
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

    
    
    /*public function insertDate($appointment_id, $date, $time)
    {
        $query = "INSERT INTO dates (appointment_id, date, time) VALUES ($appointment_id, '$date', '$time')";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function updateDate($date_id, $appointment_id, $date, $time)
    {
        $query = "UPDATE dates SET appointment_id = $appointment_id, date = '$date', time = '$time' WHERE id = $date_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function deleteDate($date_id)
    {
        $query = "DELETE FROM dates WHERE id = $date_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }*/



    public function insertDate($appointment_id, $date, $time)
{
    $stmt = $this->conn->prepare("INSERT INTO dates (appointment_id, date, time) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $appointment_id, $date, $time);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

public function updateDate($date_id, $appointment_id, $date, $time)
{
    $stmt = $this->conn->prepare("UPDATE dates SET appointment_id = ?, date = ?, time = ? WHERE id = ?");
    $stmt->bind_param("isss", $appointment_id, $date, $time, $date_id);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}

public function deleteDate($date_id)
{
    $stmt = $this->conn->prepare("DELETE FROM dates WHERE id = ?");
    $stmt->bind_param("i", $date_id);
    $result = $stmt->execute();
    $stmt->close();
    return $result;
}


    /*public function queryParticipants($appointment_id)
    {
        $participants = array();

        $query = "SELECT id, appointment_id, username, comment FROM participants WHERE appointment_id = $appointment_id";

        $result = mysqli_query($this->conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
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
    }*/


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


    /*public function insertParticipant($appointment_id, $username)
    {
        $query = "INSERT INTO participants (appointment_id, username, vote_response, comment) VALUES ($appointment_id, '$username', NULL, NULL)";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function updateParticipant($participant_id, $selected_date, $comment, $vote_response)
    {
        $query = "UPDATE participants SET selected_date='$selected_date', comment='$comment', vote_response='$vote_response' WHERE id = $participant_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    public function deleteParticipant($participant_id)
    {
        $query = "DELETE FROM participants WHERE id = $participant_id";
        $result = mysqli_query($this->conn, $query);
        return $result;
    }

    function __destruct()
    {
        mysqli_close($this->conn);
    }*/



    public function insertParticipant($appointment_id, $username)
{
    $query = "INSERT INTO participants (appointment_id, username, comment) VALUES (?, ?, NULL)";
    $stmt = mysqli_prepare($this->conn, $query);
    mysqli_stmt_bind_param($stmt, 'is', $appointment_id, $username);
    $result = mysqli_stmt_execute($stmt);
    return $result;
}

public function updateParticipant($participant_id, $selected_date, $comment)
{
    $query = "UPDATE participants SET selected_date=?, comment=? WHERE id = ?";
    $stmt = mysqli_prepare($this->conn, $query);
    mysqli_stmt_bind_param($stmt, 'ssi', $selected_date, $comment, $participant_id);
    $result = mysqli_stmt_execute($stmt);
    return $result;
}

public function deleteParticipant($participant_id)
{
    $query = "DELETE FROM participants WHERE id = ?";
    $stmt = mysqli_prepare($this->conn, $query);
    mysqli_stmt_bind_param($stmt, 'i', $participant_id);
    $result = mysqli_stmt_execute($stmt);
    return $result;
}

function __destruct()
{
    mysqli_close($this->conn);
}


}
