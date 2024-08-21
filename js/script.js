const buildings = {
    house: {
		name: "house",
		cost: 50, 
		ktkaValIncrease: 15, 
		monIncIncrease: 1, 
	},
    school: {
		name: "school",
		cost: 750, 
		ktkaValIncrease: 10, 
		monIncIncrease: 30, 
	},
    wastewater: {
		name: "wastewater",
		cost: 10000, 
		ktkaValIncrease: 90, 
		monIncIncrease: 5, 
	},
    shop: {
		name: "shop", 
		cost: 750, 
		ktkaValIncrease: 5, 
		monIncIncrease: 50,
	},
};

let gameContainer,
	map,
	gameHeight,
	gameWidth,
	mapHeight,
	mapWidth,
	moneyValueElmnt,
	moneyIncrementElmnt,
	ktkaValueElmnt;

let pos1 = 0,
	pos2 = 0,
	cursorX = 0,
	cursorY = 0;

let ktkaValue = 60;
let backgroundLvl = 1;

let money = 100000;
let moneyInterval = 1000;
let moneyIncrement = 2;

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
	moneyValueElmnt = document.getElementById("money-value");
	moneyIncrementElmnt = document.getElementById("money-increment");
	ktkaValueElmnt = document.querySelector("#ktka-value p:last-child");

	dragElement(map);
	makeGrid();
	makeMap();
	addUpgradeables();
	addHoverListeners();
};

setInterval(function checkLoop () {
	if (ktkaValue > 1000) {
		ktkaValue = 1000;
	}

	let ktkaBarFill = document.getElementById("fill");
	let ktkaBarValue = ktkaValue * 0.6;
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

	backgroundLvl = Math.round(ktkaValue / 140);
	if (backgroundLvl < 1) {
		backgroundLvl = 1;
	}
	if (backgroundLvl > 7) {
		backgroundLvl = 7;
	}
	if (map) {
		map.style.backgroundImage = `url('images/background${backgroundLvl}.jpg')`;
	}
	ktkaValueElmnt.innerHTML = ktkaValue;
	moneyValueElmnt.innerHTML = `$${money}`;
	moneyIncrementElmnt.innerHTML = `+$${moneyIncrement}/s`
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

function addHoverListeners () {
	let moneyWrapper = document.getElementById("money-wrapper");
	let ktkaWrapper = document.getElementById("ktka-bar-wrapper");
	let MBToggle = false;
	let KWToggle = false;

	moneyWrapper.addEventListener("click", function () {
		if (!MBToggle) {
			moneyWrapper.classList.add("active");
			MBToggle = true;
		} else {
			moneyWrapper.classList.remove("active");
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
		// console.log(`MapX = ${elmnt.offsetLeft}, MapY = ${elmnt.offsetTop} ${pos1} ${pos2} ${cursorX} ${cursorY}`);
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
		upgradeables[i].addEventListener("click", upgrade);
	}
}

function upgrade (event) {
	let buildingElmnt = event.currentTarget;
    let buildingType = buildings[buildingElmnt.classList[1]];
	let buildingName = buildingElmnt.getAttribute("src").replace(/.*\/(.*)\d\.png$/, "$1");

	if (buildingType.cost < money) {
		money -= buildingType.cost;
		ktkaValue += buildingType.ktkaValIncrease;
		moneyIncrement += buildingType.monIncIncrease;
		buildingElmnt.setAttribute("src", `images/${buildingName}2.png`);
		buildingElmnt.removeEventListener("click", upgrade);
		buildingElmnt.removeEventListener("mouseover", showUpgradeSymbol);
		buildingElmnt.classList.remove("upgradeable");
		hideUpgradeSymbol(null, buildingElmnt);
	}
}

function showUpgradeSymbol (event) {
	buildingElmnt = event.currentTarget;
	let buildingName = buildingElmnt.getAttribute("src").replace(/.*\/(.*)\d\.png$/, "$1");
	console.log(buildingName)
	let newSymbol = document.createElement("img");
	buildingElmnt.parentElement.appendChild(newSymbol);

	newSymbol.setAttribute("src", `images/${buildingName}UpgradePopup.png`);
	newSymbol.setAttribute("class", "upgrade-symbol");

	let elmntTop = buildingElmnt.offsetTop;
	let elmntLeft = buildingElmnt.offsetLeft;
	let elmntHeight = buildingElmnt.offsetHeight;
	let elmntWidth = buildingElmnt.offsetWidth;
	newSymbol.style.top = `${elmntTop + elmntHeight / 2 - 120 / 2}px`;
	newSymbol.style.left = `${elmntLeft + elmntWidth / 2 - 35}px`;
}

function hideUpgradeSymbol (event, element) {
	if (event) {
		element = event.currentTarget;
	}
	newSymbol = element.parentElement.querySelector(".upgrade-symbol");
	if (newSymbol) {
		newSymbol.remove();
	}
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
		newElement.addEventListener("mouseover", showUpgradeSymbol);
		newElement.addEventListener("mouseout", hideUpgradeSymbol);
    }
}

function toggleColor() {
	let bgCovers = document.getElementsByClassName("bg-cover");
	if (!bgCovers[0].classList.contains("black")) {
		for (let i = 0; i < bgCovers.length; i++) {
			bgCovers[i].classList.add("black");
			document.body.classList.add("black");
		}
	} else {
		for (let i = 0; i < bgCovers.length; i++) {
			bgCovers[i].classList.remove("black");
			document.body.classList.remove("black");
		}
	}
}

function makeMap () {

	addToCell(1, 1, ["img", ["src", "images/school1.png", "class", "building school upgradeable"],
		`img.building {
			height: 250px;
			width: 250px;
		}`]
	);

	addToCell(1, 6, ["img", ["src", "images/wastewater1.png", "class", "building wastewater upgradeable"],
		`img.building {
			height: 175px;
			width: 175px;
			margin-top: 30px;
		}`]
	);

	addToCell(3, 6, ["img", ["src", "images/wastewater1.png", "class", "building wastewater upgradeable"],
		`img.building {
			margin-top: 14px;
			height: 175px;
			width: 175px;
		}`]
	);

	addToCell(7, 6, ["img", ["src", "images/bridge.png"],
		`img {
			height: 300px;
			width: 150px;
			margin-top: 30px;
		}`]
	);

	addToCell(1, 8, ["img", ["src", "images/pinkPineapple1.png", "class", "building shop upgradeable"],
		`img.building {
			height: 170px;
			width: 170px;
			margin-top: 20px;
		}`]
	);

	addToCell(8, 8, ["img", ["src", "images/school1.png", "class", "building school upgradeable"],
		`img.building {
			height: 200px;
			width: 200px;
		}`]
	);

	addToCell(6, 2, ["img", ["src", "images/nw1.png", "class", "building shop upgradeable"],
		`img.building {
			height: 200px;
			width: 220px;
			margin-top: 20px;
			margin-left: 20px;
		}`]
	);

	addToCell(5, 2, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			
			margin-top:68px;
			margin-left:68px;
		}`],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;

			
		}`]
	);

	addToCell(6, 4, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-top: 20px;
		}`]
	);

	addToCell(5, 4, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-top: 20px;
		}`]
	);


	addToCell(8, 4, ["img", ["src", "images/tawa1.png", "class", "building house upgradeable"],
		`img.building {
			height: 100px;
			width: 200px;
			margin: 5px;
		}`],

	);


	addToCell(7, 4, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(7, 0, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(5, 1, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 5px;
		}`]
	);

	addToCell(0, 1, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img.building {
			margin-left: 70px;
		}`],

	);

	addToCell(2, 0, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 5px;
		}`],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(3) {
			margin: 15px;
			margin-left: -200px;
			margin-bottom: 50px;
		}`]
	);

	addToCell(4, 3, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 30px;
		}`]
	);

	addToCell(4, 8, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(5, 5, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(6, 9, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(1, 4, ["img", ["src", "images/house1.png", "class", "building house upgradeable"]],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
		}`]
	);

	addToCell(2, 3, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(8, 2, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(2, 4, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left: 155px;
		}`]
	);

	
	addToCell(3, 1, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(7, 5, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(3, 9, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin: 15px;
			margin-left:155px;
		}`]
	);

	addToCell(2, 8, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin-left: 50px;
		}`]
	);

	addToCell(5, 8, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
			margin-top:68px;
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin-left: 50px;
		}`]
	);

	addToCell(7, 9, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
			
		}`],

		["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img:nth-child(2) {
			margin-left: 50px;
		}`]
	);


	addToCell(0, 9, ["img", ["src", "images/modernHouse1.png", "class", "building house upgradeable"],
		`img:nth-child(1) {
			margin-left:68px;
		}`]

	);

	addToCell(0, 7, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img.building {
			margin-left:68px;
			margin-top:68px;
		}`],
	);

	addToCell(0, 0, ["img", ["src", "images/house1.png", "class", "building house upgradeable"],
		`img.building {
			margin-left:68px;
			margin-top:68px;
		}`],
	);

	addToCell(5, 7, ["img", ["src", "images/church1.png", "class", "building school upgradeable"],
		`img.building {
			height: 200px;
			width: 200px;
			left: 75px;
			top: 75px;
		}`],
	);
}
