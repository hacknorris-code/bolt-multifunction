// sreensaver config
const type = "binary" // type "normal" to get time as number lines or "binary" to get binary clock
const backgroundColor = ({ r: 255, g: 255, b: 0 }); // here change color of clock borders. only binary clock
const inactiveColor = ({ r: 0, g: 255, b: 255 }); // here change inactive dots of time. binary clock only
const activeColor = ({ r: 255, g: 0, b: 255 }); // here change text OR active time dots color
const timezone = 2 //here setup your timezone. 0 is UTC use normal number to set timezone after utc or inverted (like -5) to set below
// movement config
const movementSpeed = 100; // here set speed of rolling when its needed to roll
const movementLength = 10; // here set of time bot is rolling when its needed to roll


registerEvent(EventType.onCharging, onCharging);
registerEvent(EventType.onLanding, onLanding);
registerEvent(EventType.onGyroMax, onGyroMax);
registerEvent(EventType.onFreefall, onFreefall);
registerEvent(EventType.onNotCharging, onNotCharging);


async function onFreefall() {
	rotation = getOrientation().yaw // yes this is global, i know JS btw, not only sphero docs ;p
}

async function onLanding() {
	await Sound.EightBit.Hit.play(true);
	await spin(999999, 3);
	await roll(rotation, movementSpeed, movementLength);
}

async function onGyroMax() {
	await Sound.EightBit.Blaster.play(true);
	await delay(5);
	stopRoll();
	setStabilization(false);
	await roll(getRandomInt(0, 359), movementSpeed, movementLength);
	await Sound.play(true);
}

async function onNotCharging() {
	await Sound.EightBit.BubblePop.play(true);
}

async function onCharging() {
	await Sound.EightBit.Bubble.play(true);
	if (type == "normal") {
		normalClock();
	}
	if (type == "binary") {
		binaryClock();
	}
}

async function startProgram() {
}

async function binaryClock() {
	const hour = (Math.floor((getCurrentTime() % 86400) / 3600) + timezone);
	const minute = Math.floor((getCurrentTime() % 3600) / 60);
	const second = (Math.floor((getCurrentTime() % 3600) % 60));
	drawMatrixLine(backgroundColor, { x: 0, y: 0 }, { x: 7, y: 0 }); //
	drawMatrixLine(backgroundColor, { x: 0, y: 1 }, { x: 7, y: 1 }); //
	drawMatrixLine(backgroundColor, { x: 0, y: 6 }, { x: 7, y: 6 });
	drawMatrixLine(backgroundColor, { x: 0, y: 7 }, { x: 7, y: 7 });
	drawMatrixLine(backgroundColor, { x: 2, y: 0 }, { x: 2, y: 7 });
	drawMatrixLine(backgroundColor, { x: 5, y: 0 }, { x: 5, y: 7 });
	drawMatrixFill(inactiveColor, { x: 0, y: 2 }, { x: 1, y: 5 });
	drawMatrixFill(inactiveColor, { x: 3, y: 2 }, { x: 4, y: 5 });
	drawMatrixFill(inactiveColor, { x: 6, y: 2 }, { x: 7, y: 5 });
	const binH = hour.toString(2);
	const binM = minute.toString(2);
	const binS = second.toString(2);
	let time = buildString(binS, binM, binH);
	var matrix = [{ x: 6, y: 2 }, { x: 7, y: 2 }, { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }];

	for (let index in time.split('')) {
		if (time[index] == 0) {
			drawMatrixPixel(activeColor, matrix[index]);
		} else {
			drawMatrixPixel(inactiveColor, matrix[index]);
		}
	}
}

async function normalClock() {
	const hour = (Math.floor((getCurrentTime() % 86400) / 3600) + timezone);
	const minute = Math.floor((getCurrentTime() % 3600) / 60);
	const second = (Math.floor((getCurrentTime() % 3600) % 60));
	await scrollMatrixText(buildString(hour, ":", minute, ".", second), activeColor, 15, true);
}
