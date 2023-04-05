<?php
class Appointment {
    public $id;
    public $title;
    public $location;
    public $start_time;
    public $end_time;

    public function __construct($id, $title, $location, $start, $end) {
        $this->id = $id;
        $this->title = $title;
        $this->location = $location;
        $this->start_time = $start;
        $this->end_time = $end;
    }
}