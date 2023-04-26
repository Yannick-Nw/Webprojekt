$(document).ready(function () {
	loaddata("main");

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
				var duration = appointmentObjekt.duration;
				var end_time = new Date(appointmentObjekt.voting_end_date);
				var end_time = end_time.toString("dd.MM.yyyy");
				var status = appointmentObjekt.duration;

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

				var td5 = $("<td></td>").text("Status fehlt");
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
		error: function () {
			console.log("Ein Fehler ist aufgetreten: Bei Main");
		},
	});
}

function appointmentChoice(choice) {
	$.ajax({
		url: "../backend/serviceHandler.php",
		data: { param: "details", id: choice },
		dataType: "json",
		success: function (response) {
			console.log(response);
			var participentOld = "0";
			var dateOld = "";
			for (var i = 0; i < response.length; i++) {
				var appointmentObjekt = response[i];
				if ("title" in appointmentObjekt) {
					var name = appointmentObjekt.title;
					$("#appointmentDetailsName").text(name);
					var description = appointmentObjekt.description;
					$("#appointmentDetailsDescription").text(description);
				}

				if ("date" in appointmentObjekt) {
					var date = appointmentObjekt.date;
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
				}

				if ("time" in appointmentObjekt) {
					var time = appointmentObjekt.time;
					var trDate = $("#appointmentTimes"); // Zugriff auf das Zeile-Element
					var tdTime = $("<td></td>").text(time); // Erstellen und Hinzufügen von Zellen zur Zeile
					trDate.append(tdTime);
				}

				if ("username" in appointmentObjekt) {
					var participent = appointmentObjekt.username;
					var selected = appointmentObjekt.vote;
					var tbodyDetails = $("#particpantsPicks");
					var trParticpants = $("<tr></tr>").addClass("h-12"); // Erstellen einer neuen Zeile
					if (participentOld === participent) {
						var tdParticpants = $("<td></td>").text(participent); // Erstellen und Hinzufügen von Zellen zur Zeile
						trParticpants.append(tdParticpants);
						participentOld = participent;
					}
					if (selected === "1") {
						tdParticpants = $("<td></td>").text("&#x2705;"); // Erstellen und Hinzufügen von Zellen zur Zeile
						trParticpants.append(tdParticpants);
						tbodyDetails.append(trParticpants);
					} else if (selected === "0") {
						var tdParticpants = $("<td></td>").text("&#x274C;"); // Erstellen und Hinzufügen von Zellen zur Zeile
						trParticpants.append(tdParticpants);
						tbodyDetails.append(trParticpants);
					}
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("Fehler: " + jqXHR.responseText);
		},
	});
}
