$(document).ready(function () {
    loaddata('main');

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
//data: {param: }

function loaddata(requestTyp) {
    $.ajax({
        url: "../backend/serviceHandler.php",
        data: { param: requestTyp },
        dataType: "json",
        success: function (response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                var appointmentObjekt = response[i];
                var id = appointmentObjekt.id;
                var title = appointmentObjekt.title;
                var location = appointmentObjekt.location;
                var start_time = appointmentObjekt.start_time;
                var end_time = appointmentObjekt.end_time;
                console.log(appointmentObjekt);
                var tbodyMain = $('#tableRows');    // Zugriff auf das tbody-Element

                var tr = $('<tr></tr>').attr('id', id).addClass('h-12 hover:bg-amber-950/50');   // Erstellen einer neuen Zeile

                var td1 = $('<td></td>').text(title); // Erstellen und Hinzufügen von Zellen zur Zeile
                tr.append(td1);

                var td2 = $('<td></td>').addClass('max-md:hidden').text('Meine Personen');
                tr.append(td2);

                var td3 = $('<td></td>').addClass('max-md:hidden').text(start_time);
                tr.append(td3);

                var td4 = $('<td></td>').addClass('max-md:hidden').text(end_time);
                tr.append(td4);

                var td5 = $('<td></td>').text('Mein Status');
                tr.append(td5);

                tbodyMain.append(tr);   // Hinzufügen der Zeile zur Tabelle

            }

            $("#tableRows").children().click(function () {
                $("#allAppointments").hide();
                //appointmentChoice($(this).attr('id'));
                console.log($(this).attr('id'))
                $("#appointmentDetails").show();
            });

        },
        error: function () {
            console.log('Ein Fehler ist aufgetreten: ')
        }

    });
}

function appointmentChoice(choice) {
    $.ajax({
        url: "../backend/serviceHandler.php",
        data: { param: 'details', id: choice },
        dataType: "json",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var appointmentObjekt = response[i];
                var id = appointmentObjekt.id;
                var date = appointmentObjekt.appointment_dates;
                var time = appointmentObjekt.appointment_times;

                var participent = appointmentObjekt.participents;
                var selected = appointmentObjekt.selected_dates;

                var trDate = $('#appointmentDates');    // Zugriff auf das Zeile-Element
                var dateOld = '';
                if (dateOld !== date) {
                    var tdDate = $('<td></td>').text(date).attr('id', i); // Erstellen und Hinzufügen von Zellen zur Zeile
                    trDate.append(tdDate);
                    dateOld = date;
                    var multiCell = 2;
                } else {
                    $(i - 1).attr('colspan', multiCell);
                    multiCell = multiCell + 1;
                }

                var trDate = $('#appointmentTimes');    // Zugriff auf das Zeile-Element

                var tdTime = $('<td></td>').text(time); // Erstellen und Hinzufügen von Zellen zur Zeile
                trDate.append(tdTime);

                var tbodyDetails = $('#particpantsPicks');

                var trParticpants = $('<tr></tr>').addClass('h-12');    // Erstellen einer neuen Zeile
                if (selected === '1') {
                    var tdParticpants = $('<td></td>').text('&#x2705;'); // Erstellen und Hinzufügen von Zellen zur Zeile                    
                } else {
                    var tdParticpants = $('<td></td>').text('&#x274C;'); // Erstellen und Hinzufügen von Zellen zur Zeile
                }
                trParticpants.append(tdParticpants);

                tbodyDetails.append(trParticpants);

            }

        },
        error: function () {
            console.log('Ein Fehler ist aufgetreten: ')
        }

    });
}