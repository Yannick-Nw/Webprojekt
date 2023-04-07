$(document).ready(function () {
    $("#tableRows").children().click(function () {
        $("#allAppointments").hide();
        $("#appointmentDetails").show();
    });
    $("#cancelDetails").click(function () {
        $("#appointmentDetails").hide();
        $("#allAppointments").show();
    });
    $("#create").click(function () {
        $("#allAppointments").hide();
        $("#createAppointment").show();
    });
    $("#cancelCreate").click(function () {
        $("#createAppointment").hide();
        $("#allAppointments").show();
    });
});

  //$("p").children().on("click", function()