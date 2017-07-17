function getHolidays(callback) {
	// Get the list of holidays via XMLHttpRequest
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function() {
		if(request.readyState === 4) {
			if(request.status === 200 || request.status === 0) {
				// Run callback function supplying the text if the file is retrieved
				if(typeof callback === "function") {
					callback(request.responseText);
				}
			}
		}
	}

	request.open("GET", "01-holidays.txt", true);
	request.send();
}

function getNumberOfHolidays(budget) {
	//Check if the budget amount supplied is currency via regex, probably not bulletproof
	if(/^\d{1,3}?([,]\d{3}|\d)*?([.]\d{1,2})?$/.test(budget)) {
		getHolidays(function(holidayText) { 
			var numberOfHolidays = 0;
			// Create an array from text file elements, use space or newline as delimiter via regex
			var elements = holidayText.split(/ |\n/);

			// Iterate over the elements, checking if the cost is <= the budget
			for(var i = 1; i < elements.length; i = i + 4) {
				if(Number(elements[i]) <= Number(budget)) {
					numberOfHolidays++;
				}
			}
		
			// Notify the user of how many holidays there are at the supplied location
			if(numberOfHolidays) {
				alert("There are " + numberOfHolidays + " holidays available at your budget of £" + budget + " .");
			} else {
				alert("There are no holidays available at your budget.");
			}
		});
	} else {
		alert("Please enter a currency amount!");
	}	
}

function getBestHoliday(budget) {
	//Check if the budget amount supplied is currency via regex, probably not bulletproof
	if(/^\d{1,3}?([,]\d{3}|\d)*?([.]\d{1,2})?$/.test(budget)) {
		getHolidays(function(holidayText) {
			// Split the text file into an array consisting of a line per element
			var lines = holidayText.split("\n");
			var lineElements = [];
			var bestHoliday = ["", 0];
			var nightsPerPound;

			// Associative array of weightings
			var weightings = {
				"Almaty" : 2.0,
				"Brorfelde" : 0.9,
				"Estacada" : 0.4,
				"Jayuya" : 0.6,
				"Karlukovo" : 2.2,
				"Morgantown" : 2.9,
				"Nordkapp" : 1.5,
				"Nullarbor" : 2.2,
				"Puente-Laguna-Garzonkuala-Penyu" : 0.4,
				"Uzupis" : 0.9
			}

			// Iterate over the lines array.
			for(var i = 0; i < lines.length; i++) {
				lineElements = lines[i].split(" ");
				
				//Check the current holiday is within budget
				if(Number(lineElements[1]) <= Number(budget)) {
					nightsPerPound = Number(lineElements[3] / Number(lineElements[1]));
					
					//Check if the current holiday has a weighting and adjust accordingly
					if(lineElements[2] in weightings) {
						nightsPerPound = nightsPerPound * weightings[lineElements[2]];
					}

					if(nightsPerPound > bestHoliday[1]) {
						bestHoliday[0] = lineElements[0];
						bestHoliday[1] = nightsPerPound;
					}

				}
			}
			
			// Notify the user of the best holiday
			alert("The best holiday has deal ID " + bestHoliday[0] + " and provides " 
				+ bestHoliday[1] + " nights per pound of value." );
		});
	} else {
		alert("Please enter a valid currency amount!");
	}	
}


//Event listeners, fire the functions when buttons are pressed
document.getElementById("submitbudget").addEventListener("click", function() {getNumberOfHolidays(document.getElementById("budget").value)});
document.getElementById("calculatebest").addEventListener("click", function() {getBestHoliday(document.getElementById("budget").value)});
