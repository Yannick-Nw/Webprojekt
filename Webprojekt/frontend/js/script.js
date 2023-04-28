$(document).ready(function () {  // Warten bis das Dokument geladen ist
	loaddata();	// Daten laden

	$("#cancelDetails").click(function () { // Klick-Event für "cancelDetails"-Button
		$("#appointmentDetails").hide(); // Verstecke "appointmentDetails"
		$("#detailsTable td").remove(); // Entferne alle td-Elemente aus "detailsTable"
		$("#particpantsPicks tr").remove(); // Entferne alle tr-Elemente aus "particpantsPicks"
		$("#allAppointments").show(); // Zeige "allAppointments"
	});
	$("#create").click(function () { // Klick-Event für "create"-Button
		$("#allAppointments").hide(); // Verstecke "allAppointments"
		createAppointmentSP(); 
		$("#createAppointment").show(); // Zeige "createAppointment"
	});
	$("#cancelCreate").click(function () { // Klick-Event für "cancelCreate"-Button
		$("#createAppointment").hide(); // Verstecke "createAppointment"
		$("#options-container").empty(); // Lösche den Inhalt des "options-container"
		$("#allAppointments").show(); // Zeige "allAppointments"
	});
});

function loaddata() {

	// AJAX-Aufruf zum Abrufen von Daten
	$.ajax({
		url: "../backend/serviceHandler.php", // URL des Service-Handlers
		data: { method: "queryAppointments" }, // Daten-Objekt, das an den Service-Handler gesendet wird
		dataType: "json", // Datentyp, der erwartet wird
		success: function (response) { // Funktion, die bei Erfolg ausgeführt wird und die Antwort des Service-Handlers empfängt
			for (var i = 0; i < response.length; i++) { // Schleife durch die empfangenen Daten
				var appointmentObjekt = response[i]; // Aktuelles Objekt aus der Antwort
				var id = appointmentObjekt.id; // ID des aktuellen Objekts
				var title = appointmentObjekt.title; // Titel des aktuellen Objekts
				var location = appointmentObjekt.location; // Ort des aktuellen Objekts
				var duration = appointmentObjekt.duration; // Dauer des aktuellen Objekts
				var end_time = new Date(appointmentObjekt.voting_end_date); // Endzeitpunkt des aktuellen Objekts
				var end_time = end_time.toString("dd.MM.yyyy"); // Formatierung des Datums
				var status = appointmentObjekt.vote_status; // Status des aktuellen Objekts

				// Erstellen einer neuen Zeile mit ID und Klassenattribut
				var tr = $("<tr></tr>").attr("id", id).addClass("h-12 hover:bg-amber-950/50"); 

				// Erstellen von Zellen und Hinzufügen zur Zeile
				var td1 = $("<td></td>").text(title); 
				tr.append(td1);

				var td2 = $("<td></td>").addClass("").text(location);
				tr.append(td2);

				var td3 = $("<td></td>").addClass("").text(duration);
				tr.append(td3);

				var td4 = $("<td></td>").addClass("").text(end_time);
				tr.append(td4);

				var td5 = $("<td></td>").text(status);
				tr.append(td5);

				var tbodyMain = $("#tableRows"); // Zugriff auf das tbody-Element
				tbodyMain.append(tr); // Hinzufügen der Zeile zur Tabelle
			}

			// Klick-Event für Tabellenzeilen
			$("#tableRows").children().click(function () {
				$("#allAppointments").hide(); // Verstecke "allAppointments"
				appointmentChoice($(this).attr("id")); // Funktion "appointmentChoice" aufrufen
				$("#appointmentDetails").show(); // Zeige "appointmentDetails"
			});
		},
		error: function (jqXHR, textStatus, errorThrown) { // Funktion, die bei Fehler ausgeführt wird
			console.log("Fehler: " + jqXHR.responseText);
		},
	});
}


// Diese Funktion ruft vier asynchrone AJAX-Anfragen auf, um Daten über Termine und Teilnehmer abzurufen
function appointmentChoice(choice) {
	// Die jQuery.when()-Methode erlaubt es, mehrere asynchrone Anfragen zusammenzuführen und erst dann fortzufahren, wenn alle Anfragen beendet sind
	$.when(
		// Erste AJAX-Anfrage: Abfrage der Termine für die ausgewählte Option
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryAppointments", param: choice },
			dataType: "json",
		}),
		// Zweite AJAX-Anfrage: Abfrage der verfügbaren Daten für die ausgewählte Option
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryDates", param: choice },
			dataType: "json",
		}),
		// Dritte AJAX-Anfrage: Abfrage der Teilnehmer für die ausgewählte Option
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryParticipants", param: choice },
			dataType: "json",
		}),
		// Vierte AJAX-Anfrage: Abfrage der Teilnehmer für jeden Termin der ausgewählten Option
		$.ajax({
			url: "../backend/serviceHandler.php",
			data: { method: "queryAppointmentParticipants", param: choice },
			dataType: "json",
		})
	)
	.done(function (response1, response2, response3, response4) {
		// Ausgabe der Antwort vom ersten AJAX-Aufruf (Termindetails)
		console.log(response1);
		// Iterieren über jedes Terminobjekt im Response-Array
		for (var i = 0; i < response1[0].length; i++) {
			let appointmentObjekt = response1[0][i];
			// Falls ein Termin einen Titel hat, die entsprechenden Informationen in die HTML-Elemente einfügen
			// (Name, Beschreibung, Ablaufdatum, Dauer, Ort)
			let name = appointmentObjekt.title;
			$("#appointmentDetailsName").text(name);
			let description = appointmentObjekt.description + "<br>Abblaufdatum: " + appointmentObjekt.voting_end_date;
			description = description + "<br>Dauer: " + appointmentObjekt.duration + " Minuten";
			description = description + "<br>Ort: " + appointmentObjekt.location;
			$("#appointmentDetailsDescription").html(description);
		}
	
		// Variableninitialisierung für die Erstellung der Tabelle mit den Terminvorschlägen
		var dateOld = "";
		for (var i = 0; i < response2[0].length; i++) {
			var appointmentObjekt = response2[0][i];
			// Falls ein Terminvorschlag ein Datum hat, dieses als String im Format "dd.MM.yyyy" formatieren
			var date = new Date(appointmentObjekt.date).toString("dd.MM.yyyy");
			var trDate = $("#appointmentDates"); // Zugriff auf das Zeile-Element
			console.log(date, dateOld);
			// Wenn das Datum des aktuellen Terminvorschlags nicht dem Datum des vorherigen Terminvorschlags entspricht,
			// eine neue Zelle (Spalte) mit diesem Datum erstellen und der Zeile (Tabellenreihe) hinzufügen
			if (dateOld !== date) {
				var tdDate = $("<td></td>").text(date).attr("id", i); // Erstellen und Hinzufügen von Zellen zur Zeile
				trDate.append(tdDate);
				dateOld = date;
				var multiCell = 1;
			} else {
				// Falls das Datum des aktuellen Terminvorschlags dem Datum des vorherigen Terminvorschlags entspricht,
				// die Anzahl der Zellen (Spalten) zählen, die demselben Datum entsprechen, und die vorherige Zelle
				// entsprechend erweitern (zusammenfassen)
				var cellCount = multiCell;
				$(i - cellCount).attr("colspan", multiCell);
				multiCell = multiCell + 1;
			}
		}
	
		for (var i = 0; i < response2[0].length; i++) {
			var appointmentObjekt = response2[0][i];
			//if ("time" in appointmentObjekt) {
			// Konvertiert die Uhrzeit in eine JavaScript Date-Objekt
			var time = Date.parse(appointmentObjekt.time);
			// Fügt die Dauer des Termins hinzu, um die Endzeit zu erhalten
			var timeAdd = time;
			// Zugriff auf das Zeilen-Element der Tabelle
			var trDate = $("#appointmentTimes");
			// Erstellt eine neue Zelle für die Tabelle mit der Start- und Endzeit des Termins
			var tdTime = $("<td></td>").text(time.toString("HH:mm") + "-" + timeAdd.addMinutes(response1[0][0].duration).toString("HH:mm"));
			// Hinzufügen der Zelle zur Zeile
			trDate.append(tdTime);
			//}
		}
		
		let participentOld = "0";
		// Schleife durchläuft alle Objekte in response3
		for (var i = 0; i < response3[0].length; i++) {
			let appointmentObjekt = response3[0][i];
			let participent = appointmentObjekt.username;
			var tbodyDetails = $("#particpantsPicks");
			var trParticpants = $("<tr></tr>").addClass("h-12"); // Erstellen einer neuen Zeile
		
			// Wenn der Teilnehmer nicht derselbe ist wie der vorherige Teilnehmer, 
			// fügen Sie eine neue Zeile mit dem Namen des Teilnehmers hinzu
			//if (participentOld !== participent) {
				var tdParticpants = $("<td></td>").text(participent); // Erstellen und Hinzufügen von Zellen zur Zeile
				trParticpants.append(tdParticpants);
				participentOld = participent;
			//}
		
			// Schleife durchläuft alle Objekte in response4
			for (let votes_person = 0; votes_person < response4[0].length; votes_person++) {
				let appointmentVotes = response4[0][votes_person];
				// Wenn die participant_id in response4 mit der id in response3 übereinstimmt
				if (appointmentVotes.participant_id == appointmentObjekt.id) {
					let selected = appointmentVotes.vote;
					// Wenn der Teilnehmer ja ausgewählt hat, fügen Sie ein grünes Häkchen hinzu
					if (selected == "1") {
						let tdParticpants = $("<td></td>").html("&#x2705;"); // Erstellen und Hinzufügen von Zellen zur Zeile
						trParticpants.append(tdParticpants);
						tbodyDetails.append(trParticpants);
					// Wenn der Teilnehmer nein ausgewählt hat, fügen Sie ein rotes Kreuz hinzu
					} else if (selected == "0") {
						var tdParticpants = $("<td></td>").html("&#x274C;"); // Erstellen und Hinzufügen von Zellen zur Zeile
						trParticpants.append(tdParticpants);
						tbodyDetails.append(trParticpants);
					}
				}
			}
			checkbox(choice); // Aufruf der checkbox-Funktion
		}
		
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			// Bei einem Fehler wird eine Meldung in der Konsole ausgegeben
			console.log("Fehler: " + jqXHR.responseText + " : " + errorThrown);
		});
		
		// Wenn der "deleteAppointment"-Button geklickt wird, wird die Funktion "deleteAppointment" aufgerufen und der Parameter "choice" übergeben
		$("#deleteAppointment").click(function () {
			deleteAppointment(choice);
		});
	}

// Funktion zum Erstellen der Checkbox für die Teilnehmerstimmen
function checkbox(appointment_id) {
	let count = 0;
	$("#detailsName")
	.off("input")
	.on("input", function () {
	let inputValue = $(this).val();
	if (count == 0) { // Wenn noch keine Zeile für den aktuellen Nutzer vorhanden ist
	count = count + 1;
	let tbodyDetails = $("#particpantsPicks"); // Zugriff auf die Tabelle für die Teilnehmerstimmen
	let numTd = tbodyDetails.find("tr:last-child td").length; // Anzahl der Spalten der letzten Zeile
	let trParticpants = $("<tr></tr>").addClass("h-12 bg-amber-950/25").attr("id", "currentUserVotes"); // Erstellen einer neuen Zeile mit Hintergrundfarbe
	let tdName = $("<td></td>").text(inputValue).attr("id", "currentUserName"); // Erstellen einer Zelle für den Nutzernamen
	trParticpants.append(tdName);

	for (let i = 0; i < numTd - 1; i++) { // Schleife zum Erstellen der Checkboxen
		let checkbox = $("<td></td>").html('<input id="checkbox' + i + '" type="checkbox" class="h-4 w-4">');
		trParticpants.append(checkbox);
	}

	tbodyDetails.append(trParticpants); // Hinzufügen der neuen Zeile zur Tabelle
} else { // Wenn bereits eine Zeile für den aktuellen Nutzer vorhanden ist
	$("#currentUserName").text(inputValue); // Aktualisieren des Nutzernamens
	$("#detailsName").on("keyup", function (event) { // Funktion zum Leeren des Namenseingabefeldes beim Drücken der Enter-Taste
		if (event.key === "Enter") {
			$(this).val("");
		}
	});
	if ($(this).val() === "") { // Wenn das Namenseingabefeld leer ist, wird die Zeile ausgeblendet
		$("#currentUserVotes").hide();
	} else { // Wenn das Namenseingabefeld nicht leer ist, wird die Zeile eingeblendet und die Teilnehmerstimmen werden gespeichert
		$("#currentUserVotes").show();
		insertVotes(appointment_id);
	}
}
});

}

function deleteAppointment(id) {
	$.ajax({
		url: "../backend/serviceHandler.php", // URL zum Backend-Service-Handler
		data: { method: "deleteAppointment", param: id }, // Daten-Objekt für den AJAX-Aufruf mit der zu löschenden Termin-ID
		method: "GET", // HTTP-Methode für den AJAX-Aufruf
		success: function (response) { // Callback-Funktion für den erfolgreichen AJAX-Aufruf
			console.log(response); // Ausgabe der Server-Antwort im Browser-Konsolenfenster
			$("#appointmentDetails").hide(); // Verstecken des Termin-Detailbereichs
			$("#tableRows").empty(); // Leeren der Termin-Tabelle
			loaddata(); // Aktualisieren der Termin-Daten
			$("#allAppointments").show(); // Anzeigen der Termin-Tabelle
			$("#detailsTable td").remove(); // Löschen der Detailansicht des gelöschten Termins
			$("#particpantsPicks tr").remove(); // Löschen der Teilnehmerliste des gelöschten Termins
		},
		error: function (jqXHR, textStatus, errorThrown) { // Callback-Funktion für einen fehlgeschlagenen AJAX-Aufruf
			console.log("Fehler: " + jqXHR.responseText); // Ausgabe des Fehlers im Browser-Konsolenfenster
		},
	});
}


function createAppointment(optionCount) {
	// Lese die Werte aus den Eingabefeldern aus
	let title = $("#titleNewAppointment").val();
	let location = $("#locationNewAppointment").val();
	let description = $("#descriptionNewAppointment").val();
	let duration = $("#durationNewAppointment").val();
	let voting_end_date = $("#voting-end-dateNewAppointment").val();
	const appointmentInfo = { // Speichere die Werte in einem Objekt

		title: title,
		location: location,
		description: description,
		duration: duration,
		voting_end_date: voting_end_date,
	};
	console.log(appointmentInfo); // Logge das Objekt in der Browserkonsole


	$.ajax({ // Sende ein AJAX-Request zum Backend, um einen neuen Termin anzulegen
		url: "../backend/serviceHandler.php",
		data: { method: "createAppointment", param: appointmentInfo },
		method: "GET",
		success: function (response) {
			console.log(response);
			for (let i = 0; i < optionCount; i++) { // Füge für jede Option (Terminvorschlag) einen neuen Eintrag hinzu
				//const element = array[index];
				let optionId = "#optionNewAppointment";
				let option = optionId + optionCount;
				var datetimeval = $(option).val();
				var date = datetimeval.split("T")[0];
				var time = datetimeval.split("T")[1] + ":00";
				const dateInfo = {
					appointment_id: response,
					date: date,
					time: time,
				};
				console.log(dateInfo);
				$.ajax({
					url: "../backend/serviceHandler.php",
					data: { method: "insertDate", param: dateInfo },
					method: "GET",
					success: function (response) {},
					error: function (xhr, status, error) {
						console.error("Fehler beim erstellen der Optionen");
					},
				});
			}
			$("#createAppointment").hide(); 
			$("#tableRows").empty();
			loaddata();
			$("#allAppointments").show();
			$("#options-container").empty();
			$("#titleNewAppointment").val("");
			$("#locationNewAppointment").val("");
			$("#descriptionNewAppointment").val("");
			$("#durationNewAppointment").val("");
			$("#voting-end-dateNewAppointment").val("");
		},
		error: function (xhr, status, error) {
			console.error("Fehler beim erstellen des Termins");
		},
	});
}

function insertVotes(appointment_id) {
	$("#insertVotesButton")
		.off("click")
		.on("click", function () {
			// Code, der ausgeführt wird, wenn der Button geklickt wird
			var user_id = 0;
			var methodeTyp = "insertParticipant";
			var comment = $("#kommentar").val();
			var participentName = $("#currentUserName").text();
			var data = {
				appointment_id: appointment_id,
				username: participentName,
				comment: comment,
			};
			//console.log(data);
			$.ajax({
				url: "../backend/serviceHandler.php",
				data: { method: methodeTyp, param: data },
				method: "GET",
				success: function (response) {
					//console.log(response);
					user_id = response;
					var methodeTyp = "queryDates";
					var data = appointment_id;
					//console.log(user_id);
					$.ajax({
						url: "../backend/serviceHandler.php",
						data: { method: methodeTyp, param: data },
						method: "GET",
						success: function (response) {
							console.log(response);
							for (let date = 0; date < response.length; date++) {
								var date_id = response[date].id;
								let checkboxName = "#checkbox" + date;
								let isChecked = $(checkboxName).prop("checked");
								var checkboxValue = isChecked ? 1 : 0;
								//console.log(checkboxValue);
								var data = {
									appointment_id: appointment_id,
									participant_id: user_id,
									date_id: date_id,
									vote: checkboxValue,
								};
								console.log(data);
								$.ajax({
									url: "../backend/serviceHandler.php",
									data: { method: "insertAppointmentParticipant", param: data },
									method: "GET",
									success: function (response) {
										console.log(response);
										/*for (let date = 0; date < response[0].length; date++) {
											var dates = response[0][date];
										}*/
									},
									error: function (jqXHR, textStatus, errorThrown) {
										console.log("Fehler: " + jqXHR.responseText);
									},
								});
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.log("Fehler: " + jqXHR.responseText);
						},
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("Fehler: " + jqXHR.responseText);
				},
			});
		});
}

function createAppointmentSP() {
	// Counter for the number of options
	let optionCount = 0;

	// Handle button click
	$("#add-option-button").off("click").on("click", function () {
		// Increment the option count
		optionCount++;
		// Create a new option element
		var newOption = $("<div>" + '<label class="block font-bold mb-1">Terminvorschlag ' + optionCount + ":</label>" + '<label for="option' + optionCount + '-date-and-time" class="block font-bold mb-1">Date and Time:</label>' + '<input type="datetime-local" id="optionNewAppointment' + optionCount + '" class="w-full border rounded p-2" id="option' + optionCount + '-date-and-time" name="option' + optionCount + '-date-and-time">' + "</div>");
		// Add the new option element to the options container
		$("#options-container").append(newOption);
	});
	$("#createNewAppointment").click(function () {
		createAppointment(optionCount);
	});

	// Load existing appointments when the page loads
	/*
	$(document).ready(function () {
		loadAppointments();
	});
	*/

	// Handle form submission
	/*
	$("#create-appointment-form").submit(function (event) {
		event.preventDefault();
		createAppointment();
	});
	*/

	// Load existing appointments from the server
	/*
	function loadAppointments() {
		$.ajax({
			url: "backend/serviceHandler.php",
			data: { method: "getAppointments" },
			method: "GET",
			success: function (response) {
				// Clear the appointment list
				$("#appointment-list").empty();
				// Add each appointment to the list
				response.forEach(function (appointment) {
					$("#appointment-list").append('<li class="bg-white p-4 rounded shadow">' + '<h3 class="text-lg font-bold">' + appointment.title + "</h3>" + "<p>" + appointment.location + "</p>" + "<p>" + appointment.description + "</p>" + "</li>");
				});
			},
			error: function (xhr, status, error) {
				console.error("Fehler beim Laden der Termine");
			},
		});
	}
	*/

	// Create a new appointment on the server
	/*
	function createAppointment() {
		// Get the form data
		var formData = $("#create-appointment-form")
			.serializeArray()
			.reduce(function (obj, item) {
				obj[item.name] = item.value;
				return obj;
			}, {});
		// Send the data to the server
		$.ajax({
			url: "backend/serviceHandler.php",
			data: { method: "createAppointment", param: formData },
			method: "POST",
			success: function (response) {
				console.log("Termin erstellt");
				// Reload the appointments
				//loadAppointments();
			},
			error: function (xhr, status, error) {
				console.error("Fehler beim Erstellen des Termins");
			},
		});
	}
	*/
}
