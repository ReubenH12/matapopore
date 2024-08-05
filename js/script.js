let gameContainer,
	map,
	gameHeight,
	gameWidth,
	mapHeight,
	mapWidth;

let pos1 = 0,
	pos2 = 0,
	cursorX = 0,
	cursorY = 0;

let ktkaValue = 50;

let menuState = "";

const cellSize = 150;

const styleElement = document.createElement("style");

window.onload = function () {
	document.head.appendChild(styleElement);
	gameContainer = document.getElementById("game-container");
	map = document.getElementById("map");
	gameHeight = gameContainer.offsetHeight;
	gameWidth = gameContainer.offsetWidth;
	mapHeight = map.offsetHeight;
	mapWidth = map.offsetWidth;
	dragElement(map);
	makeGrid();
};

setInterval(function checkKtkaBar () {
	let ktkaBarFill = document.getElementById("fill");
	if (ktkaBarFill.offsetHeight != ktkaValue) {
		ktkaBarFill.style.height = ktkaValue + "px";
	}
}, 100)

function showMenu(menu) {
	let menuToShow = document.getElementById(menu);
	let currentMenu = document.getElementById(menuState);
	let uiElements = document.querySelectorAll(".ui-element");
	let shadowBox = document.getElementById("shadow-box");
	if (!menuState) {
		menuToShow.style.visibility = "visible";
		map.classList.add("blurred");
		uiElements.forEach((x) => x.classList.add("blurred"));
		shadowBox.style.pointerEvents = "initial";
		menuState = menu;
	} else if (menuState) {
		currentMenu.style.visibility = "hidden";
		map.classList.remove("blurred");
		uiElements.forEach((x) => x.classList.remove("blurred"));
		shadowBox.style.pointerEvents = "none";
		menuState = "";
	}
}

function dragElement(elmnt) {
	let maxXpos = 0 - mapWidth + gameWidth;
	let maxYpos = 0 - mapHeight + gameHeight;
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e.preventDefault();
		// Get the mouse cursor position at startup:
		cursorX = e.clientX;
		cursorY = e.clientY;
		document.onmouseup = closeDragElement;
		// Call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e.preventDefault();
		// Calculate the new cursor position:
		pos1 = cursorX - e.clientX;
		pos2 = cursorY - e.clientY;
		cursorX = e.clientX;
		cursorY = e.clientY;
		// console.log(`MapX = ${elmnt.offsetLeft}, MapY = ${elmnt.offsetTop} ${pos1} ${pos2} ${cursorX} ${cursorY}`); // MAP POSITION DEBUG LINE
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

function makeGrid () {
	const cellColumns = mapWidth / cellSize;
	const cellRows = mapHeight / cellSize;
	const totalCells = cellColumns * cellRows;

	for (let i = 0; i < cellColumns; i++) {
		map.style.gridTemplateColumns = map.style.gridTemplateColumns + ` ${cellSize}px`;
	}

	for (let i = 0; i < cellRows; i++) {
		map.style.gridTemplateRows = map.style.gridTemplateRows + ` ${cellSize}px`;
	}

	for (let i = 0; i < totalCells; i++) {
		let newDiv = document.createElement("div");
		map.appendChild(newDiv);
	}
}

function addToCell (x, y, ...rest) {
	let cellIndex = x + y * 10;
	let cell = document.querySelector(`#map > div:nth-child(${cellIndex + 1})`);
	for (let i = 0; i < rest.length; i++) {
		let newElement = document.createElement(rest[i][0]);
		cell.appendChild(newElement);
		newElement.setAttribute(`${rest[i][1]}`, `${rest[i][2]}`);
		styleElement.sheet.insertRule(`#map > div:nth-child(${cellIndex + 1}) ${rest[i][3]}`);
	}
}

function makeMap () {
	addToCell(1, 1, ["img", "src", "images/building1.png",
		`img {
			height: 20px;
			width: 20px;
		}`]
	);
}