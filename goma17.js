var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
    shipsSunk: 0,
    numbSubmarine: 1,
    subLength: 1,
    subSunk:0,
    doubleShut:false,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
    ],
    
    submarine: [ 
        {location: 0, hits: [""]},
    ],
	fire: function(guess) {
            //Guess ye chi too mayehaie A5 ya injoori
            var shuts = 0;
            console.log("guess = " + guess   );
            if(this.submarine[0].location == guess){
                view.displaySubmarineHit(guess);
                view.displayMessage("You sank my Submarine!");
                shuts++;
          
                alert('dadashi submarinam zadi damet garm');

            }
		for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            //injza age guess ma too array bood ke ye add mide.. age nabood mige nist ya dar haghighat 'index' mishe null
			// here's an improvement! Check to see if the ship
            // has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
                return true;
                
			} else if (index >= 0 ) {
                ship.hits[index] = "hit";
				view.displayHit(guess);
                view.displayMessage("HIT!");
                shuts++;
                if(shuts ==2){
                    doubleShut = true;
                }
                if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                 
				}
               return true;

            }
         
            // if (this.isSunk(ship)) {
            //     view.displayMessage("You sank my battleship!");
            //     this.shipsSunk++;
            // }
            // return true;
        }
		//AGE DOUBLESHOT TRUE BOOD, PAS AXE DOUBLE SHOT RO NESHUN BEDE 
		view.displayMiss(guess);
		view.displayMessage("You missed.");
        return false;
    },
	

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

    //it creats a ship arrays in the model with the number of ships in the models numbShips property 
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));//check to see if locations overlap with any existing ships, if they do it keeps generating until there is no overlap
			this.ships[i].locations = locations;
        }
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2); //we generate a number between 0 and 1 and multiply it by 2
		var row, col;

		if (direction === 1) { // if its a 1 then make it horizontal
			row = Math.floor(Math.random() * this.boardSize);//a number between 0-7 
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));// anumber between 0 to 7 - 3 +1  gggddddv   h n gv hn
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
    },
    generateSubmarineLocation: function(){
      var letter = Math.floor(Math.random() * 7);
      var number = Math.floor(Math.random() * 7);
      var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
      return alphabet[letter] + number;
      
    },

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
    },
    
    displaySubmarineHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "submarine");
    },

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

};

var controller = {
    guesses: 0,
    

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
            var hit = model.fire(location);
            /*if (hit){
                this.shoot++;
            }*/
           // view.displayMessage("You have shot" + this.gueees + "and" + this.shoot + "of them were a hit!");
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
}


// helper function to parse a guess from the user

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}


// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
    model.generateShipLocations();
    model.submarine[0].location =  parseGuess(model.generateSubmarineLocation());
    alert('init karamaa taze submarinam shod ' +  model.submarine[0].location );
}
