let gameContainer,
	map,
	gameHeight,
	gameWidth,
	mapHeight,
	mapWidth;
	let moneyElement;


let pos1 = 0,
	pos2 = 0,
	cursorX = 0,
	cursorY = 0;

let ktkaValue = 50;
let backgroundLvl = 1;

let money = 100;
let moneyInterval = 1000;
let moneyIncrement = 1;

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
	moneyElement = document.getElementById("money-value");
	
	dragElement(map);
	makeGrid();
	makeMap();
};

setInterval(function checkLoop () {
	let ktkaBarFill = document.getElementById("fill");
	let ktkaBarValue = ktkaValue * 6;
	if (ktkaBarFill.offsetHeight != ktkaBarValue) {
		ktkaBarFill.style.height = ktkaBarValue + "px";
	}

	// let bgImage = map.style.backgroundImage;
	backgroundLvl = Math.round(ktkaValue / 14) + 1;
	map.style.backgroundImage = `url('images/Matapoperebackgrounds${backgroundLvl}.jpg')`;

	moneyElement.innerHTML = `$${money}`
}, 100)

setInterval(function giveMoney () {
	money += moneyIncrement;
}, moneyInterval)

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
//Building placements
function makeMap () {

	addToCell(3, 1, ["img", ["src", "images/upgradeSymbol.png", "class", "upgrade-symbol"],
		`img {
		height: 150px;
		width: 150px;
	}`]
	);

	for (let i = 0; i < document.querySelectorAll(".upgrade-symbol:hover").length; i++) {
		document.querySelectorAll(".upgrade-symbol:hover")[i].style.transform = "translateY(10px)";
	}

	addToCell(1, 1, ["img", ["src", "images/building1.png"],
		`img {
			height: 250px;
			width: 250px;
		}`]
	);

	addToCell(1, 6, ["img", ["src", "images/building6.png"],
		`img {
			height: 175px;
			width: 175px;
			margin-top: -200px;
		}`]
	);

	addToCell(3, 6, ["img", ["src", "images/building6.png"],
		`img {
			height: 175px;
			width: 175px;
			margin-top: -200px;
		}`]
	);

	addToCell(7, 6, ["img", ["src", "images/orangeTEMP.jpg"],
		`img {
			height: 300px;
			width: 90px;
			margin-top: 30px;
		}`]
	);

	addToCell(1, 9, ["img", ["src", "images/building3.png"],
		`img {
			height: 140px;
			width: 140px;
			margin-top: -75px;
		}`]
	);

	addToCell(8, 8, ["img", ["src", "images/building1.png"],
		`img {
			height: 200px;
			width: 200px;
			
		}`]
	);

	addToCell(6, 2, ["img", ["src", "images/building2.png"],
		`img {
			height: 200px;
			width: 20s0px;
		}`]
	);

	addToCell(1, 3, ["div", ["id", "grassless"],
		`#grassless{
			height: 200px;
			width: 200px;
			background-color: green;
		}`]
	);

	addToCell(8, 4, ["div", ["id", "tawasin"],
		`#tawasin{
			height: 140px;
			width: 220px;
			margin: 5px;
			background-color: red;
		}`]
	);

	addToCell(7, 4, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 5px;

		}`]
	);

	addToCell(7, 0, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 5px;

		}`]
	);

	addToCell(5, 1, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 5px;

		}`]
	);

	addToCell(0, 1, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 5px;

		}`]
	);

	addToCell(2, 0, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png", ],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 5px;

		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(3) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left: -200px;
			margin-bottom: 50px;
		}`]

	);

	addToCell(4, 3, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 30px;


		}`]
	);

	addToCell(4, 8, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;

		}`]

	
	);

	addToCell(5, 5, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;

		}`]

	);

	addToCell(6, 9, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;

		}`]

	);

	addToCell(1, 4, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
		}`]

	);

	addToCell(2, 3, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	addToCell(8, 2, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	addToCell(2, 4, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	
	addToCell(3, 1, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	addToCell(7, 5, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	addToCell(3, 9, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;
			margin-left:155px;

		}`]

	);

	addToCell(2, 8, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;


		}`]

	);

	addToCell(0, 9, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img:nth-child(1){
			height: 75px;
			width: 75px;
			margin-left:68px;
		}`],

		["img", ["src", "images/building2.png"],
		`img:nth-child(2) {
			height: 75px;
			width: 75px;
			margin: 15px;


		}`]

	);

	addToCell(0, 7, ["img", ["src", "images/building2.png", "id", "2buildings"],
		`img{
			height: 75px;
			width: 75px;
			margin-left:68px;
			margin-top:68px;
		}`],
		

	);

}

