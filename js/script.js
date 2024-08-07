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

let ktkaValue = 0;
let backgroundLvl = 1;

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
	makeMap();
};


setInterval(function checkKtkaLevel () {
	let ktkaBarFill = document.getElementById("fill");
	let ktkaBarValue = ktkaValue * 6;
	if (ktkaBarFill.offsetHeight != ktkaBarValue) {
		ktkaBarFill.style.height = ktkaBarValue + "px";
	}

	// let bgImage = map.style.backgroundImage;
	backgroundLvl = Math.round(ktkaValue / 14) + 1;
	map.style.backgroundImage = `url('images/Matapoperebackgrounds${backgroundLvl}.jpg')`;
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
		for (let i2 = 0; i2 < (rest[i][1].length); i2+=2) {
			newElement.setAttribute(`${rest[i][1][i2]}`, `${rest[i][1][i2 + 1]}`);
		}
		styleElement.sheet.insertRule(`#map > div:nth-child(${cellIndex + 1}) ${rest[i][2]}`);
	}
}

function makeMap () {
	addToCell(1, 1, ["img", ["src", "images/building6.png", "id", "testImgId", "class", "building-image"],
		`img {
			height: 140px;
			width: 140px;
			margin: 5px;
		}`]
	);
}
