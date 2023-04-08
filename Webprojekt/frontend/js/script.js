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
        data: {param: requestTyp},
        dataType: "json",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var appointmentObjekt = response[i];
                var id = appointmentObjekt.id;
                var title = appointmentObjekt.title;
                var location = appointmentObjekt.location;
                var start_time = appointmentObjekt.start_time;
                var end_time = appointmentObjekt.end_time;
                
                var tbody = $('#tableRows');    // Zugriff auf das tbody-Element
                
                var tr = $('<tr></tr>').attr('id',id).addClass('h-12 hover:bg-amber-950/50');   // Erstellen einer neuen Zeile
                
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
                
                tbody.append(tr);   // Hinzufügen der Zeile zur Tabelle
                
            }
            
            $("#tableRows").children().click(function () {
                $("#allAppointments").hide();
                appointmentChoice(this);
                $("#appointmentDetails").show();
            });
            
        },
        error: function() {
            console.log('Ein Fehler ist aufgetreten: ')
        }
        
    });
}

function appointmentChoice(choice){
    $.ajax({
        url: "../backend/serviceHandler.php",
        data: {param: requestTyp},
        dataType: "json",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                var appointmentObjekt = response[i];
                var id = appointmentObjekt.id;
                var appointment_id = appointmentObjekt.appointment_id;
                var user_id = appointmentObjekt.user_id;
                var selected_date = appointmentObjekt.selected_date;
                var comment = appointmentObjekt.comment;
                
                var tr = $('#appointmentDates');    // Zugriff auf das tbody-Element
                
                var tr = $('<tr></tr>').attr('id',id).addClass('h-12 hover:bg-amber-950/50');   // Erstellen einer neuen Zeile
                
                var td1 = $('<td></td>').text(title); // Erstellen und Hinzufügen von Zellen zur Zeile
                tr.append(td1);
                
                var td2 = $('<td></td>').text('Meine Personen');
                tr.append(td2);
                
                var td3 = $('<td></td>').text(start_time);
                tr.append(td3);
                
                var td4 = $('<td></td>').text(end_time);
                tr.append(td4);
                
                var td5 = $('<td></td>').text('Mein Status');
                tr.append(td5);
                
                tr.append(tr);   // Hinzufügen der Zeile zur Tabelle
                
            }
            
            $("#tableRows").children().click(function () {
                $("#allAppointments").hide();
                appointmentChoice(this);
                $("#appointmentDetails").show();
            });
            
        },
        error: function() {
            console.log('Ein Fehler ist aufgetreten: ')
        }
        
    });
}