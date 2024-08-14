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

let ktkaValue = 6;
let backgroundLvl = 1;

let money = 100;
let moneyInterval = 1000;
let moneyIncrement = 5;

let menuState = "";

let upSymOn = false;
let symbolHovered = false;

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
	addUpgradeables();
	addHoverListeners();
};

setInterval(function checkLoop () {
	if (ktkaValue > 100) {
		ktkaValue = 100;
	}

	let ktkaBarFill = document.getElementById("fill");
	let ktkaBarValue = ktkaValue * 6;
	let maxBarValue = gameHeight - 100;
	if (ktkaBarValue < 5) {
		ktkaBarValue = 5;
	}
	if (ktkaBarValue > maxBarValue) {
		ktkaBarValue = maxBarValue;
	}

	if (ktkaBarFill.offsetHeight != ktkaBarValue) {
		ktkaBarFill.style.height = ktkaBarValue + "px";
	}

	backgroundLvl = Math.round(ktkaValue / 14);
	if (backgroundLvl < 1) {
		backgroundLvl = 1;
	}
	if (backgroundLvl > 7) {
		backgroundLvl = 7;
	}
	map.style.backgroundImage = `url('images/background${backgroundLvl}.jpg')`;

	ktkaValueElement = document.querySelector("#ktka-value p:last-child").innerHTML = ktkaValue;
	moneyElement.innerHTML = `$${money}`;
	moneyElement.parentElement.parentElement.querySelector("#money-increment").innerHTML = `+$${moneyIncrement}/s`
}, 100)

setInterval(function giveMoney () {
	money += moneyIncrement;
}, moneyInterval)

function showMenu(menu) {
	console.log("shown menu")
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

function addHoverListeners () {
	let moneyBox = document.getElementById("money-box");
	let ktkaWrapper = document.getElementById("ktka-bar-wrapper");
	let MBToggle = false;
	let KWToggle = false;

	moneyBox.addEventListener("click", function () {
		if (!MBToggle) {
			moneyBox.classList.add("active");
			MBToggle = true;
		} else {
			moneyBox.classList.remove("active");
			MBToggle = false;
		}
	})
	ktkaWrapper.addEventListener("click", function () {
		if (!KWToggle) {
			ktkaWrapper.classList.add("active");
			KWToggle = true;
		} else {
			ktkaWrapper.classList.remove("active");
			KWToggle = false;
		}
	})
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

function addUpgradeables () {
	let upgradeables = document.getElementsByClassName("building");
	for (let i = 0; i < upgradeables.length; i++) {
		upgradeables[i].addEventListener("click", function(){upgrade(upgradeables[i])});
	}
}

function upgrade (building) {
	if (building.classList.contains("house")) {
		if (money >= 50) {
			money -= 50;
			console.log("Upgraded house!")
			ktkaValue += 1;
			moneyIncrement += 1;
		}
	}
	if (building.classList.contains("wastewater") ) {
		if (money > 3000) {
			money -= 3000;
			console.log("Upgraded treatment plant!")
			ktkaValue += 1;
			moneyIncrement += 1;
		}
	}

	if (building.classList.contains("school") ) {
		if (money > 2000) {
			money -= 2000;
			console.log("Upgraded school!")
			ktkaValue += 2;
			moneyIncrement += 10;
		}
	}
}

function showUpgradeSymbol (element) {
	let newSymbol = document.createElement("img");
	element.parentElement.appendChild(newSymbol);

	newSymbol.setAttribute("src", "images/upgradeSymbol.svg");
	newSymbol.setAttribute("class", "upgrade-symbol");

	let elmntTop = element.offsetTop;
	let elmntLeft = element.offsetLeft;
	let elmntHeight = element.offsetHeight;
	let elmntWidth = element.offsetWidth;
	newSymbol.style.top = `${elmntTop + elmntHeight / 2 - 50 / 2}px`;
	newSymbol.style.left = `${elmntLeft + elmntWidth / 2 - 50 / 2}px`;
	}

function hideUpgradeSymbol (element, event) {
	let newSymbol = element.parentElement.querySelector(".upgrade-symbol");
	newSymbol.remove();
}

function addToCell (x, y, ...rest) {
	let cellIndex = x + y * 10;
	let cell = document.querySelector(`#map > div:nth-child(${cellIndex + 1})`);
	for (let i = 0; i < rest.length; i++) {
		let newElement = document.createElement(rest[i][0]);
		cell.appendChild(newElement);
		for (let i2 = 0; i2 < rest[i][1].length; i2 += 2) {
			newElement.setAttribute(`${rest[i][1][i2]}`, `${rest[i][1][i2 + 1]}`);
		}
		if (rest[i][2]) {
			styleElement.sheet.insertRule(`#map > div:nth-child(${cellIndex + 1}) ${rest[i][2]}`);
		}
		newElement.addEventListener("mouseover", function(){showUpgradeSymbol(newElement);});
		newElement.addEventListener("mouseout", function(){hideUpgradeSymbol(newElement);})
    }
}

function toggleColor() {
	document.getElementsByClassName("bg-cover").style.backgroundColor = "black";
  }

function makeMap () {

	addToCell(1, 1, ["img", ["src", "images/school.png", "class", "building school"],
		`img.building {
			height: 250px;
			width: 250px;
		}`]
	);

	addToCell(1, 6, ["img", ["src", "images/building6.png", "class", "building wastewater"],
		`img.building {
			height: 175px;
			width: 175px;
			margin-top: -200px;
		}`]
	);

	addToCell(3, 6, ["img", ["src", "images/building6.png", "class", "building wastewater"],
		`img.building {
			height: 175px;
			width: 175px;
			margin-top: -200px;
		}`]
	);

	addToCell(7, 6, ["img", ["src", "images/bridge.png"],
		`img {
			height: 300px;
			width: 150px;
			margin-top: 30px;
		}`]
	);

	addToCell(1, 8, ["img", ["src", "images/pinkPineapple.png"],
		`img {
			height: 170px;
			width: 170px;
			margin-top: 20px;
		}`]
	);

	addToCell(8, 8, ["img", ["src", "images/school.png", "class", "building school"],
		`img.building {
			height: 200px;
			width: 200px;
		}`]
	);

	addToCell(6, 2, ["img", ["src", "images/house1.png", "class", "building house"],
		`img.building {
			height: 200px;
			width: 200px;
		}`]
	);

	addToCell(1, 3, ["div", ["id", "grasslees"],
		`#grasslees {
			height: 200px;
			width: 200px;
			background-color: green;
		}`]
	);

	addToCell(8, 4, ["img", ["src", "images/tawaSign.png"],
		`img {
			height: 130px;
			width: 220px;
			margin: 5px;
		}`]
	);

	addToCell(7, 4, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(7, 0, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(5, 1, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(0, 1, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left: 70px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin-left: 75px;
		}`]
	);

	addToCell(2, 0, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 5px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(3) {
			margin: 15px;
			margin-left: -200px;
			margin-bottom: 50px;
		}`]
	);

	addToCell(4, 3, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 30px;
		}`]
	);

	addToCell(4, 8, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(5, 5, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(6, 9, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(1, 4, ["img", ["src", "images/house1.png", "class", "building house"]],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(2, 3, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(8, 2, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(2, 4, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left: 155px;
		}`]
	);

	
	addToCell(3, 1, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(7, 5, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(3, 9, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(2, 8, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(0, 9, ["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(0, 7, ["img", ["src", "images/house1.png", "class", "building house"],
		`img {
			margin-left:68px;
			margin-top:68px;
		}`],
	);

	addToCell(5, 7, ["img", ["src", "images/church.png"],
		`img {
			height: 175px;
			width: 175px;
			left: 175px;
			top: 175px;
		}`],
	);

}

