<?php
class Appointment
{
    // Öffentliche Variablen der Appointment-Klasse
    public $id;
    public $title;
    public $location;
    public $start_time;
    public $end_time;

    public function __construct($id, $title, $location, $start, $end)
    {
        // konstruktor setzt die Werte der Variablen auf die übergebenen Parameter 
        $this->id = $id;
        $this->title = $title;
        $this->location = $location;
        $this->start_time = $start;
        $this->end_time = $end;
    }
}
