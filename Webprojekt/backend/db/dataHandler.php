<?php

require_once "../backend/models/appointment.php";
require_once "config.php";

class DataHandler
{
    private $conn;

    public function __construct()
    {
        global $host, $username, $password, $dbname;

        // Verbindung zur Datenbank herstellen
        $this->conn = new mysqli($host, $username, $password, $dbname);

        // Überprüfen, ob die Verbindung erfolgreich war
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function queryAppointments($appointment_id = null)
    {
        $appointments = [];

        // SQL-Abfrage erstellen
        $query =
            "SELECT *, CASE WHEN voting_end_date > NOW() THEN 'open' ELSE 'closed' END AS vote_status FROM appointments";

        if ($appointment_id !== null) {
            $query .= " WHERE id=?";
        }

        // SQL-Abfrage ausführen
        $stmt = $this->conn->prepare($query);
        if ($appointment_id !== null) {
            $stmt->bind_param("i", $appointment_id);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        // Ergebnisse verarbeiten
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if ($row["vote_status"] === "closed") {
                    // Flag setzen, um anzuzeigen, dass die Abstimmung nicht möglich ist
                    $row["vote_status"] = "Geschlossen";

                    // vote_status in der Datenbank aktualisieren
                    $update_query =
                        "UPDATE appointments SET vote_status = 0 WHERE id = ?";
                    $update_stmt = $this->conn->prepare($update_query);
                    $update_stmt->bind_param("i", $row["id"]);
                    $update_stmt->execute();
                } else {
                    // Flag setzen, um anzuzeigen, dass die Abstimmung möglich ist
                    $row["vote_status"] = "Offen";
                }
                array_push($appointments, $row);
            }
        }
        return $appointments;
    }

    function createAppointment($appointmentData)
    {
        // Erstelle ein Array mit den Schlüsseln der Termin-Daten
        $keys = array_keys($appointmentData);
        // Erstelle ein Array mit den Werten der Termin-Daten
        $values = array_values($appointmentData);

        // Erstelle einen String mit den Schlüsseln, getrennt durch Kommas
        $keysStr = implode(",", $keys);
        // Erstelle einen String mit Platzhaltern für die Werte
        $placeholders = implode(",", array_fill(0, count($values), "?"));

        // Erstelle die SQL-Abfrage mit den Schlüsseln und Platzhaltern
        $query = "INSERT INTO appointments ($keysStr) VALUES ($placeholders)";

        // Bereite die Abfrage vor
        $stmt = $this->conn->prepare($query);

        // Erstelle den Typ-Parameter dynamisch basierend auf den Datentypen der Werte
        $types = "";
        foreach ($values as $value) {
            if (is_int($value)) {
                $types .= "i";
            } else {
                $types .= "s";
            }
        }

        // Binde die Werte an die Abfrage und führe sie aus
        $stmt->bind_param($types, ...$values);

        //return 
        $stmt->execute();
        $lastInsertId = $this->conn->insert_id;
        return $lastInsertId;
    }

    public function deleteAppointment($id)
    {
        // Bereite die Abfrage vor
        $stmt = $this->conn->prepare("DELETE FROM appointments WHERE id=?");
        // Binde den Wert an die Abfrage
        $stmt->bind_param("i", $id);
        // Führe die Abfrage aus
        $stmt->execute();
        return $stmt->execute();
    }

    public function queryAppointmentParticipants($appointment_id)
    {
        // Erstelle ein leeres Array für die Teilnehmer
        $participants = [];

        // Erstelle die SQL-Abfrage
        $query =
            "SELECT * FROM appointment_participants WHERE appointment_id = ?";
        // Bereite die Abfrage vor
        $stmt = $this->conn->prepare($query);
        // Binde den Wert an die Abfrage
        $stmt->bind_param("i", $appointment_id);
        // Führe die Abfrage aus
        $stmt->execute();
        // Hole das Ergebnis der Abfrage
        $result = $stmt->get_result();

        // Wenn es Ergebnisse gibt, füge sie dem Array hinzu
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $participant = [
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date_id" => $row["date_id"],
                    "participant_id" => $row["participant_id"],
                    "vote" => $row["vote"],
                ];
                array_push($participants, $participant);
            }
        }

        // Gib das Array zurück
        return $participants;
    }

    public function insertAppointmentParticipant(array $data)
    {
        // Bereite die Abfrage vor
        $stmt = $this->conn->prepare(
            "INSERT INTO appointment_participants (appointment_id, participant_id, date_id, vote) VALUES (?, ?, ?, ?)"
        );
        // Binde die Werte an die Abfrage
        $stmt->bind_param(
            "iiii",
            $data["appointment_id"],
            $data["participant_id"],
            $data["date_id"],
            $data["vote"]
        );
        // Führe die Abfrage aus
        $result = $stmt->execute();
        // Schließe die Abfrage
        $stmt->close();
        return $result;
    }

    public function queryDates($appointment_id)
    {
        // Erstelle ein leeres Array für die Daten
        $dates = [];

        // Bereite die Abfrage vor
        $stmt = $this->conn->prepare(
            "SELECT * FROM dates WHERE appointment_id = ?"
        );
        // Binde den Wert an die Abfrage
        $stmt->bind_param("i", $appointment_id);
        // Führe die Abfrage aus
        $stmt->execute();
        // Hole das Ergebnis der Abfrage
        $result = $stmt->get_result();

        // Wenn es Ergebnisse gibt, füge sie dem Array hinzu
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $date = [
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "date" => $row["date"],
                    "time" => $row["time"],
                ];
                array_push($dates, $date);
            }
        }

        // Gib das Array zurück
        return $dates;
    }

    public function insertDate($data)
    {
        error_log("Data: " . print_r($data, true));
        var_dump($data);

        // SQL-Anweisung vorbereiten
        $stmt = $this->conn->prepare(
            "INSERT INTO dates (appointment_id, date, time) VALUES (?, ?, ?)"
        );
        // Parameter an die Anweisung binden
        $stmt->bind_param(
            "iss",
            $data["appointment_id"],
            $data["date"],
            $data["time"]
        );
        // Anweisung ausführen
        $result = $stmt->execute();
        error_log("Result: " . print_r($result, true));
        var_dump($result);

        // Anweisung schließen
        $stmt->close();
        return $result;
    }

    public function queryParticipants($appointment_id)
    {
        // Array für Teilnehmer
        $participants = [];
        // SQL-Abfrage zum Abrufen von Teilnehmern aus der Tabelle "participants"
        $stmt = $this->conn->prepare(
            "SELECT id, appointment_id, username, comment FROM participants WHERE appointment_id = ?"
        );
        // Binden des Parameters an die SQL-Abfrage
        $stmt->bind_param("i", $appointment_id);
        // Ausführen der SQL-Abfrage
        $stmt->execute();
        // Abrufen des Ergebnisses der SQL-Abfrage
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Erstellen eines Teilnehmer-Arrays
                $participant = [
                    "id" => $row["id"],
                    "appointment_id" => $row["appointment_id"],
                    "username" => $row["username"],
                    "comment" => $row["comment"],
                ];
                // Hinzufügen des Teilnehmer-Arrays zum Array der Teilnehmer
                array_push($participants, $participant);
            }
        }

        return $participants;
    }

    public function insertParticipant($data)
    {
        // SQL-Abfrage zum Einfügen eines Teilnehmers in die Tabelle "participants"
        $query =
            "INSERT INTO participants (appointment_id, username, comment) VALUES (?, ?, ?)";
        // Vorbereiten der SQL-Abfrage
        $stmt = $this->conn->prepare($query);
        // Binden der Parameter an die SQL-Abfrage
        $stmt->bind_param(
            "iss",
            $data["appointment_id"],
            $data["username"],
            $data["comment"]
        );
        // Ausführen der SQL-Abfrage

        $stmt->execute();
        $lastInsertId = $this->conn->insert_id;
        return $lastInsertId;
    }

    // Schließen der Datenbankverbindung am Ende des Skripts
    function __destruct()
    {
        mysqli_close($this->conn);
    }
}
