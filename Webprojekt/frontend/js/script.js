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
				checkbox();
				//}
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			console.log("Fehler: " + jqXHR.responseText + " : " + errorThrown);
		});
}

function checkbox(){
	let count = 0;
	$('#detailsName').off('input').on('input', function(){
		let inputValue = $(this).val();
		if (count == 0) {
			count = count + 1;
			let tbodyDetails = $("#particpantsPicks");
			let numTd = tbodyDetails.find('tr:last-child td').length;
			let trParticpants = $("<tr></tr>").addClass("h-12").attr("id", "currentUserVotes");
			let tdName = $("<td></td>").text(inputValue).attr("id", "currentUserName");
			trParticpants.append(tdName);

			for (let i = 0; i < numTd - 1; i++) {
				let checkbox = $("<td></td>").html('<input type="checkbox" name="example">');
				trParticpants.append(checkbox);
			}

			tbodyDetails.append(trParticpants);
		} else {
			$('#currentUserName').text(inputValue);
		}
	});
}

function createAppointment(title, location, description, duration, voting_end_date) {
	const appointmentInfo = {
		title: title,
		location: location,
		description: description,
		duration: duration,
		voting_end_date: voting_end_date
	};
	$.ajax({
	  url: "backend/serviceHandler.php",
	  data: { method: "createAppointment", param: appointmentInfo},
	  method: "POST",
	  success: function(response) {
		console.log('Termin erstellt');
	  },
	  error: function(xhr, status, error) {
		console.error('Fehler beim erstellen des Termins');
	  }
	});
}
