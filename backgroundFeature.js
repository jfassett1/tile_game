// Array of background images to choose from.
const backgrounds = [
	"url('background1.jpg')",
	"url('background2.jpg')",
	"url('background3.jpg')",
	"url('background4.jpg')"
];

// Function to change the background image of the tiles.
function changeTileBackgrounds(backgroundImage) {
	const tiles = document.getElementsByClassName("tile");
	for (const tile of tiles) {
		tile.style.backgroundImage = backgroundImage;
	}
}

// Function to change the background image.
function changeBackground() {
	// Get the selected index from the select box.
	const selectBox = document.getElementById("backgroundSelect");
	const selectedBackgroundIndex = selectBox.selectedIndex;
	const selectedBackground = backgrounds[selectedBackgroundIndex];
	
	// Set the background image of the tiles.
	changeTileBackgrounds(selectedBackground);
}

// Function to initialize the background options.
function initializeBackgroundOptions() {
	// Create the select box element.
	const selectBox = document.createElement("select");
	selectBox.id = "backgroundSelect";
	
	// Add options to the select box for each background image.
	for (let i = 0; i < backgrounds.length; i++) {
		const option = document.createElement("option");
		option.text = `Background ${i + 1}`;
		selectBox.add(option);
	}
	
	// Add an event listener to the select box to change the background image.
	selectBox.addEventListener("change", changeBackground);
	
	// Add the select box to the buttons div.
	const buttonsDiv = document.getElementById("buttons");
	buttonsDiv.appendChild(selectBox);
}

// Initialize the background options when the page loads.
initializeBackgroundOptions();

// Choose a random background on startup.
const randomBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
changeTileBackgrounds(backgrounds[randomBackgroundIndex]);
document.getElementById("backgroundSelect").value = "Background " + (randomBackgroundIndex + 1);
