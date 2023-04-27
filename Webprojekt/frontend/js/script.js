$(document).ready(function () {
	loaddata();

	$("#cancelDetails").click(function () {
		$("#appointmentDetails").hide();
		$("#detailsTable td").remove();
		$("#particpantsPicks tr").remove();
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

function loaddata() {
	$.ajax({
		url: "../backend/serviceHandler.php",
		data: { method: "queryAppointments" },
		dataType: "json",
		success: function (response) {
			console.log(response);
			for (var i = 0; i < response.length; i++) {
				var appointmentObjekt = response[i];
				var id = appointmentObjekt.id;
				var title = appointmentObjekt.title;
				var location = appointmentObjekt.location;
				var duration = appointmentObjekt.duration;
				var end_time = new Date(appointmentObjekt.voting_end_date);
				var end_time = end_time.toString("dd.MM.yyyy");
				var status = appointmentObjekt.vote_status;

				console.log(appointmentObjekt);
				var tbodyMain = $("#tableRows"); // Zugriff auf das tbody-Element

				var tr = $("<tr></tr>")
					.attr("id", id)
					.addClass("h-12 hover:bg-amber-950/50"); // Erstellen einer neuen Zeile

				var td1 = $("<td></td>").text(title); // Erstellen und Hinzufügen von Zellen zur Zeile
				tr.append(td1);

				var td2 = $("<td></td>").addClass("max-md:hidden").text(location);
				tr.append(td2);

				var td3 = $("<td></td>").addClass("max-md:hidden").text(duration);
				tr.append(td3);

				var td4 = $("<td></td>").addClass("max-md:hidden").text(end_time);
				tr.append(td4);

				var td5 = $("<td></td>").text(status);
				tr.append(td5);

				tbodyMain.append(tr); // Hinzufügen der Zeile zur Tabelle
			}

			$("#tableRows")
				.children()
				.click(function () {
					$("#allAppointments").hide();
					appointmentChoice($(this).attr("id"));
					console.log($(this).attr("id"));
					$("#appointmentDetails").show();
				});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("Fehler: " + jqXHR.responseText);
		},
	});
}

function appointmentChoice(choice) {
	$.when(
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryAppointments", param: choice },
			dataType: "json",
		}),
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryDates", param: choice },
			dataType: "json",
		}),
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryParticipants", param: choice },
			dataType: "json",
		}),
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryAppointmentParticipants", param: choice },
			dataType: "json",
		})
	)
		.done(function (response1, response2, response3, response4) {
			console.log(response1);
			for (var i = 0; i < response1[0].length; i++) {
				let appointmentObjekt = response1[0][i];
				//console.log(appointmentObjekt);
				//if ("title" in appointmentObjekt) {
				let name = appointmentObjekt.title;
				$("#appointmentDetailsName").text(name);
				let description =
					appointmentObjekt.description +
					"<br>Abblaufdatum: " +
					appointmentObjekt.voting_end_date;
				description =
					description + "<br>Dauer: " + appointmentObjekt.duration + " Minuten";
				description = description + "<br>Ort: " + appointmentObjekt.location;
				$("#appointmentDetailsDescription").html(description);
				//}
			}
			var dateOld = "";
			for (var i = 0; i < response2[0].length; i++) {
				var appointmentObjekt = response2[0][i];
				//if ("date" in appointmentObjekt) {
				var date = new Date(appointmentObjekt.date).toString("dd.MM.yyyy");
				var trDate = $("#appointmentDates"); // Zugriff auf das Zeile-Element
				console.log(date, dateOld);
				if (dateOld !== date) {
					var tdDate = $("<td></td>").text(date).attr("id", i); // Erstellen und Hinzufügen von Zellen zur Zeile
					trDate.append(tdDate);
					dateOld = date;
					var multiCell = 1;
				} else {
					var cellCount = multiCell;
					$(i - cellCount).attr("colspan", multiCell);
					multiCell = multiCell + 1;
				}
				//}
			}
			for (var i = 0; i < response2[0].length; i++) {
				var appointmentObjekt = response2[0][i];
				//console.log(appointmentObjekt);
				//if ("time" in appointmentObjekt) {
				var time = Date.parse(appointmentObjekt.time);
				var timeAdd = time;
				var trDate = $("#appointmentTimes"); // Zugriff auf das Zeile-Element
				var tdTime = $("<td></td>").text(
					time.toString("HH:mm") +
						"-" +
						timeAdd.addMinutes(response1[0][0].duration).toString("HH:mm")
				); // Erstellen und Hinzufügen von Zellen zur Zeile
				trDate.append(tdTime);
				//}
			}
			let participentOld = "0";
			//console.log(response3[0]);
			for (var i = 0; i < response3[0].length; i++) {
				let appointmentObjekt = response3[0][i];
				//console.log(appointmentObjekt.username);
				//if ("username" in appointmentObjekt) {
				let participent = appointmentObjekt.username;
				var tbodyDetails = $("#particpantsPicks");
				var trParticpants = $("<tr></tr>").addClass("h-12"); // Erstellen einer neuen Zeile
				//if (participentOld === participent) {
				var tdParticpants = $("<td></td>").text(participent); // Erstellen und Hinzufügen von Zellen zur Zeile
				trParticpants.append(tdParticpants);
				participentOld = participent;
				//}
				//console.log(response4[0]);
				for (
					let votes_person = 0;
					votes_person < response4[0].length;
					votes_person++
				) {
					let appointmentVotes = response4[0][votes_person];
					if (appointmentVotes.participant_id == appointmentObjekt.id) {
						let selected = appointmentVotes.vote;
						if (selected == "1") {
							let tdParticpants = $("<td></td>").html("&#x2705;"); // Erstellen und Hinzufügen von Zellen zur Zeile
							trParticpants.append(tdParticpants);
							tbodyDetails.append(trParticpants);
						} else if (selected == "0") {
							var tdParticpants = $("<td></td>").html("&#x274C;"); // Erstellen und Hinzufügen von Zellen zur Zeile
							trParticpants.append(tdParticpants);
							tbodyDetails.append(trParticpants);
						}
					}
				}
				checkbox(choice);
				//}
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			console.log("Fehler: " + jqXHR.responseText + " : " + errorThrown);
		});
}

function checkbox(appointment_id) {
	let count = 0;
	$("#detailsName")
		.off("input")
		.on("input", function () {
			let inputValue = $(this).val();
			if (count == 0) {
				count = count + 1;
				let tbodyDetails = $("#particpantsPicks");
				let numTd = tbodyDetails.find("tr:last-child td").length;
				let trParticpants = $("<tr></tr>")
					.addClass("h-12 bg-amber-950/25")
					.attr("id", "currentUserVotes");
				let tdName = $("<td></td>")
					.text(inputValue)
					.attr("id", "currentUserName");
				trParticpants.append(tdName);

				for (let i = 0; i < numTd - 1; i++) {
					let checkbox = $("<td></td>").html(
						'<input id="checkbox' + i + '" type="checkbox" class="h-4 w-4">'
					);
					trParticpants.append(checkbox);
				}

				tbodyDetails.append(trParticpants);
			} else {
				$("#currentUserName").text(inputValue);
				$("#detailsName").on("keyup", function (event) {
					if (event.key === "Enter") {
						$(this).val("");
					}
				});
				if ($(this).val() === "") {
					$("#currentUserVotes").hide();
				} else {
					$("#currentUserVotes").show();
					insertVotes(appointment_id);
				}
			}
		});
}

function createAppointment(
	title,
	location,
	description,
	duration,
	voting_end_date
) {
	const appointmentInfo = {
		title: title,
		location: location,
		description: description,
		duration: duration,
		voting_end_date: voting_end_date,
	};
	$.ajax({
		url: "backend/serviceHandler.php",
		data: { method: "createAppointment", param: appointmentInfo },
		method: "POST",
		success: function (response) {
			console.log("Termin erstellt");
		},
		error: function (xhr, status, error) {
			console.error("Fehler beim erstellen des Termins");
		},
	});
}

function insertVotes(id) {
	$("#insertVotesButton")
		.off("click")
		.on("click", function () {
			// Code, der ausgeführt wird, wenn der Button geklickt wird
			for (let count = 0; count <= 1; count++) {
				switch (count) {
					case 0:
						var methodeTyp = "insertParticipant";
						var comment = $("#kommentar").val();
						var participentName = $("#currentUserName").text();
						var data = {
							appointment_id: id,
							username: participentName,
							comment: comment,
						};
						console.log(data);
						break;
					case 1:
						var methodeTyp = "insertAppointmentParticipant";
						break;
					default:
						break;
				}
				$.ajax({
					url: "../backend/serviceHandler.php",
					data: { method: methodeTyp, param: data },
					method: "POST",
					success: function (response) {},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log("Fehler: " + jqXHR.responseText);
					},
				});
			}
		});
}


<script>
        // Counter for the number of options
        var optionCount = 0;

        // Handle button click
        $('#add-option-button').click(function() {
            // Increment the option count
            optionCount++;
            // Create a new option element
            var newOption = $(
                '<div>' +
                    '<label class="block font-bold mb-1">Terminvorschlag ' + optionCount + ':</label>' +
                    '<input type="checkbox" name="options" value="option' + optionCount + '">' +
                    '<label for="option' + optionCount + '-date-and-time" class="block font-bold mb-1">Date and Time:</label>' +
                    '<input type="datetime-local" class="w-full border rounded p-2" id="option' + optionCount + '-date-and-time" name="option' + optionCount + '-date-and-time">' +
                '</div>'
            );
            // Add the new option element to the options container
            $('#options-container').append(newOption);
        });

        // Load existing appointments when the page loads
        $(document).ready(function() {
            loadAppointments();
        });

        // Handle form submission
        $('#create-appointment-form').submit(function(event) {
            event.preventDefault();
            createAppointment();
        });

        // Load existing appointments from the server
        function loadAppointments() {
            $.ajax({
                url: "backend/serviceHandler.php",
                data: { method: "getAppointments" },
                method: "GET",
                success: function(response) {
                    // Clear the appointment list
                    $('#appointment-list').empty();
                    // Add each appointment to the list
                    response.forEach(function(appointment) {
                        $('#appointment-list').append(
                            '<li class="bg-white p-4 rounded shadow">' +
                                '<h3 class="text-lg font-bold">' + appointment.title + '</h3>' +
                                '<p>' + appointment.location + '</p>' +
                                '<p>' + appointment.description + '</p>' +
                            '</li>'
                        );
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Fehler beim Laden der Termine');
                }
            });
        }

        // Create a new appointment on the server
        function createAppointment() {
            // Get the form data
            var formData = $('#create-appointment-form').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            // Send the data to the server
            $.ajax({
                url: "backend/serviceHandler.php",
                data: { method: "createAppointment", param: formData },
                method: "POST",
                success: function(response) {
                    console.log('Termin erstellt');
                    // Reload the appointments
                    loadAppointments();
                },
                error: function(xhr, status, error) {
                    console.error('Fehler beim Erstellen des Termins');
                }
            });
        }
    </script>