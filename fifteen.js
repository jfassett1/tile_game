// Get the document elements.
const puzzle = document.getElementById("puzzle");
const song = document.getElementById("song");
const timer = document.getElementById("timer");
const movetracker = document.getElementById("movetracker");
const endscreen = document.getElementById("end");

// Configure the "Shuffle" button.
const shuffle = document.getElementById("shuffle");
shuffle.addEventListener("click", function() {start()});

// Configure the "Reset" button.
const reset = document.getElementById("reset");
reset.addEventListener("click", function() {location.reload()});

// Configure the "Cheat" button.
const cheat_button = document.getElementById("cheat");

// Track the blank space with x and y positions.
let blank_x, blank_y;
// Track whether the puzzle can be clicked using a boolean value.
let clickable;
// Track whether the puzzle is being shuffled using a boolean value.
let shuffling;
// Track the adjacent tiles as an array of ids.
let adjacent_tiles;
// Flag for whether game is in progress or not
let in_progress = 0;
let elapsed = null;
// Interval for timer
let interval = null;
// Track the number of moves and the tiles that were moved.
let moves = 0;
let cheatstack = [];
// Track whether the puzzle is being auto-solved.
let cheating = 0;

// Display the solved puzzle.
reset_puzzle();

// Start the game.
function start() {
	cheating = 0;
	cheatstack = []
	if (in_progress) return;
	// Delays start of game by three seconds
	setTimeout(function() {
		shuffle_puzzle();
		countdown(1);
		song.play();
		totalmoves("start");
	}, 2);
	in_progress = 1;
}

// Auto-solve the puzzle by doing the reverse of every move.
function cheat() {
	cheat_button.disabled = true;
	cheating = 1;
	// Delete some redundant tile movements from the stack.
	for (let i = 1; i <= 5; i++) {
		let j = 0;
		while (j < cheatstack.length - 1) {
			const curr_tile = cheatstack[j];
			const next_tile = cheatstack[j + 1];
			if  (curr_tile == next_tile) {
				cheatstack.splice(j, 2);
			} else j++;
		}
	}
	// Implement the tile movements in the stack.
	for (let i = 0; i < cheatstack.length; i++) {
		setTimeout(function() {
			move_tile(cheatstack.pop());
		},
		130 * i);
	}
}

// Display the number of tiles moved.
function totalmoves(parameter) {
	if (parameter == "start") movetracker.innerHTML = "Moves Made: " + String(moves);
	else {
		moves += parameter;
		movetracker.innerHTML = "Moves Made: " + String(moves);
	}
}

// Display the end screen when the puzzle is solved.
let displayed = 0;
function results() {
	if(displayed == 1){
		return;
	}
	displayed = 1;
	clickable = false;
	// Stops song
	song.pause();
	song.currentTime = 0;
	// Adds the 'final' css class
	endscreen.classList.add("final");
	clearInterval(interval);
	let winimage = document.createElement("img");
	let stats = document.createElement("h3");
	stats.innerHTML = "You solved the puzzle in " + elapsed + " seconds with " + moves + " moves!";
	winimage.src = "win.jpg";
	endscreen.appendChild(winimage);
	endscreen.appendChild(stats);
	return;
}

// Display a timer.
function countdown(length){
	if (length === "quit"){
	 	clearInterval(interval);
		 return length;
	}
	let unit = " second";
	interval = setInterval(function() {
		timer.innerHTML = "Time Elapsed: " + String(length) + unit;
		length += 1;
		// Updates global variable
		elapsed = length;
		unit = " seconds";
	}, 1000);
	return;
}

// Show the tiles in the initial (solved) state.
function reset_puzzle() {
	// Clear any existing tiles.
	puzzle.innerHTML = "";
	let n = 1;
	// Use a nested loop to create 4 rows and 4 columns.
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			// Skip the 16th position.
			if (n > 15) continue;
			// Create a new div with the "tile" class.
			const tile = document.createElement("div");
			tile.classList = "tile";
			// The tile's id is its position "x-y".
			tile.id = j + "-" + i;
			// The tile's name is its number.
			tile.name = n;
			// Make the tile clickable.
			tile.onclick = function() {move_tile(tile)}
			// Position the tile.
			tile.style.left = (j * 100) + "px";
			tile.style.top = (i * 100) + "px";
			// Position the background image within the tile.
			tile.style.backgroundPositionX = (j * -100) + "px";
			tile.style.backgroundPositionY = (i * -100) + "px";
			// Display the tile number.
			tile.innerHTML = n++;
			// Set the tile's background image to the selected option.
			set_background(tile);
			// Add the tile to the puzzle.
			puzzle.append(tile);
			// Make the "Cheat" button inactive until the puzzle is shuffled.
			cheat_button.disabled = true;
		}
	}
	// Set the initial position of the blank space to the bottom right corner.
	blank_x = 3;
	blank_y = 3;
	// Make the puzzle not clickable (until the player shuffles).
	clickable = false;
}

// Move the tile to the blank space.
function move_tile(tile) {
	const tile_id = tile.id.split("-");
	if (!shuffling) {
		// Do not move the tile if the puzzle is not clickable.
		if (!clickable) return;
		// Do not move the tile if it is not movable.
		if (!tile.classList.contains("movable")) return;
		// Store the "to" and "from" positions.
		const from_x = parseInt(tile_id[0]);
		const from_y = parseInt(tile_id[1]);
		const to_x = blank_x;
		const to_y = blank_y;
		// Make the puzzle not clickable during the animation.
		clickable = false;
		totalmoves(1);
		// Checks if cheating is active, to reduce redundancy.
		if(!cheating) cheatstack.push(tile);
		// Move the tile with animation.
		let pos = 0;
		const id = setInterval(function() {
			// Stop the animation after moving the tile 100 pixels.
			if (pos == 100) {
				clickable = true;
				clearInterval(id);
			} else {
				// Move the tile 10 pixels per frame.
				pos += 10; 
				tile.style.left = ((100 - pos) * from_x) + (pos * to_x) + "px";
				tile.style.top = ((100 - pos) * from_y) + (pos * to_y) + "px";
			}
		// Each frame lasts for 5 milliseconds.
		}, 5);
	} else {
		// Move the tile without animation.
		tile.style.left = (100 * blank_x) + "px";
		tile.style.top = (100 * blank_y) + "px";
	}
	// Swap the positions of the tile and blank space.
	tile.id = blank_x + "-" + blank_y;
	blank_x = parseInt(tile_id[0]);
	blank_y = parseInt(tile_id[1]);
	if (!shuffling) {
		// If the blank space is in the bottom right corner, check whether the puzzle is solved.
		if (blank_x == 3 && blank_y == 3) check_puzzle();
		// Make the tiles adjacent to the blank space movable.
		set_movable_tiles();
	}
}

// Make the tiles adjacent to the blank space movable.
function set_movable_tiles() {
	// Make the previous adjacent tiles not movable.
	for (const tile_id of adjacent_tiles) {
		// Skip the blank space.
		if (tile_id == blank_x + "-" + blank_y) continue;
		const tile = document.getElementById(tile_id);
		tile.classList = "tile";
	}
	// Get the ids of the current adjacent tiles.
	get_adjacent_tiles();
	// Make the current adjacent tiles movable.
	for (const tile_id of adjacent_tiles) {
		const tile = document.getElementById(tile_id);
		tile.classList = "movable tile";
	}
}

// Return an array containing the ids of all tiles adjacent to the blank space.
function get_adjacent_tiles() {
	adjacent_tiles = [];
	// If the adjacent position is in bounds, add it to the array.
	if (blank_x > 0) adjacent_tiles.push((blank_x - 1) + "-" + blank_y);
	if (blank_x < 3) adjacent_tiles.push((blank_x + 1) + "-" + blank_y);
	if (blank_y > 0) adjacent_tiles.push(blank_x + "-" + (blank_y - 1));
	if (blank_y < 3) adjacent_tiles.push(blank_x + "-" + (blank_y + 1));
}

// Shuffle the puzzle in a way that is solvable.
function shuffle_puzzle() {
	reset_puzzle();
	shuffling = true;
	// Move a random tile N times.
	const N = 300;
	for (let i = 0; i < N; i++) {
		// Get the ids of all adjacent tiles.
		get_adjacent_tiles();
		// Move a random adjacent tile.
		const random_index = Math.floor(Math.random() * adjacent_tiles.length);
		const tile_id = adjacent_tiles[random_index];
		const tile = document.getElementById(tile_id);
		cheatstack.push(tile);
		move_tile(tile);
	}
	shuffling = false;
	// Make the puzzle clickable.
	set_movable_tiles();
	clickable = true;
	cheat_button.disabled = false;
	shuffle.disabled = true;
}

// Check whether the puzzle is solved.
function check_puzzle() {
	// Use a nested loop to check each position.
	let n = 1
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			// Skip the 16th position.
			if (n > 15) continue;
			const tile = document.getElementById(j + "-" + i);
			// If the tile does not have the correct number, stop checking.
			if (tile.name != n++) return;
		}
	}
	// If the check passed, the puzzle is solved.
	results("W");
}

// Helper function to integrate with backgroundFeature.js.
function set_background(tile) {
	const select_box = document.getElementById("backgroundSelect");
	if (select_box != null) {
		const index = select_box.selectedIndex;
		tile.style.backgroundImage = "url('background" + (index + 1) + ".jpg')";
	}
}
