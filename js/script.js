let gameContainer,
	map,
	gameHeight,
	gameWidth,
	mapHeight,
	mapWidth;

let pos1 = 0,
	pos2 = 0,
	pos3 = 0,
	pos4 = 0;

let ktkaValue = 50;

window.onload = function () {
	gameContainer = document.getElementById("game-container");
	map = document.getElementById("map");
	gameHeight = gameContainer.offsetHeight;
	gameWidth = gameContainer.offsetWidth;
	mapHeight = map.style.height;
	mapWidth = map.style.width;
	// document.getElementById("start-game").addEventListener("click", menuState("off"))
	dragElement(map);
};

setInterval(function checkKtkaBar () {
	let ktkaBarFill = document.getElementById("fill");
	if (ktkaBarFill.offsetHeight != ktkaValue) {
		ktkaBarFill.style.height = ktkaValue + "px";
	}
}, 100)

function menuState(state) {
	let homeMenu = document.getElementById("home");
	let menuBtn = document.getElementById("menu-btn")
	if (state == "on") {
		homeMenu.style.visibility = "visible";
		menuBtn.style.cursor = "initial"
	} else if (state == "off") {
		homeMenu.style.visibility = "hidden";
		menuBtn.style.cursor = "pointer";
	}
}

function dragElement(elmnt) {
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e.preventDefault();
		// Get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// Call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e.preventDefault();
		// Calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		let maxXpos = mapWidth - gameWidth;
		let maxYpos = mapHeight - gameHeight;
		if (elmnt.offsetLeft - pos1 <= 0 && elmnt.offsetLeft - pos1 >= maxXpos) {
			elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
		}
		if (elmnt.offsetTop - pos2 <= 0 && elmnt.offsetTop - pos2 >= maxYpos) {
			elmnt.style.top = elmnt.offsetTop - pos2 + "px";
		}
	}

	function closeDragElement() {
		// Stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
