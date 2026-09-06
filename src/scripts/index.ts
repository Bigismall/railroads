import "./../styles/styles.css";
import { drawRailHelpers } from "./debug/helpers";
import { $ } from "./dom";
import { Locomotive } from "./locomotive";
import { Rail } from "./rail";
import { RailCar } from "./railCar";
import { Switcher } from "./switcher";
import { TrainOnRail } from "./trainOnRail";

const DEBUG = String(import.meta.env.VITE_DEBUG ?? "").toUpperCase() === "TRUE";
console.log("DEBUG", DEBUG);

// The simulation keeps the old speed scale by treating one game second as 60 old frames.
const NOMINAL_FRAME_RATE = 60;
// Caps tab-resume lag so physics does not jump through tracks after a long inactive frame.
const MAX_DELTA_TIME = 0.05;
// Power is divided by speed; this floor prevents an unrealistic burst from standstill.
const MIN_SPEED_FOR_POWER = 0.8;
// Maximum locomotive traction. Lower values make heavy consists harder to start.
const MAX_TRACTIVE_FORCE = 3;
// Constant rolling drag subtracted from acceleration while powering.
const ROLLING_RESISTANCE = 0.002;
// Maximum speed change while braking or reducing the target speed.
const BRAKE_ACCELERATION = 0.025;

const railRoads: Rail[] = [
	new Rail("#rail1"),
	new Rail("#rail2", true),
	new Rail("#rail4"),
	new Rail("#rail6"),
	new Rail("#rail7", true),
	new Rail("#rail9", true),
	new Rail("#rail11", true),
	new Rail("#rail12"),
	new Rail("#rail13"),
	new Rail("#rail14"),
];

const $trainSpeed: HTMLInputElement | null = $("#train-speed") ?? null;
const $targetSpeedValue: HTMLOutputElement | null =
	$("#target-speed-value") ?? null;
const $currentSpeedValue: HTMLOutputElement | null =
	$("#current-speed-value") ?? null;
const $currentSpeedMeter: HTMLElement | null =
	$("#current-speed-meter") ?? null;
const $playgroundTerrain: HTMLElement | null =
	$(".js-playground-terrain") ?? null;

if (!$trainSpeed) {
	throw new Error("Missing train-speed element");
}

if (!$targetSpeedValue) {
	throw new Error("Missing target-speed-value element");
}

if (!$currentSpeedValue) {
	throw new Error("Missing current-speed-value element");
}

if (!$currentSpeedMeter) {
	throw new Error("Missing current-speed-meter element");
}

if (!$playgroundTerrain) {
	throw new Error("Missing playground terrain element");
}

const TERRAIN_TILES: Record<string, string> = {
	G: "tile-grass-1",
	g: "tile-grass-2",
	S: "tile-sand-1",
	s: "tile-sand-2",
	H: "tile-grass-road-east",
	V: "tile-grass-road-north",
	C: "tile-grass-road-crossing",
	N: "tile-grass-road-split-n",
	E: "tile-grass-road-split-e",
	L: "tile-grass-road-corner-ll",
	R: "tile-grass-road-corner-lr",
	U: "tile-grass-road-corner-ul",
	Q: "tile-grass-road-corner-ur",
	D: "tile-grass-road-transition-s-dirt",
	T: "tile-grass-transition-e",
	B: "tile-tree-brown-large",
	Y: "tile-tree-green-large",
};

const TERRAIN_MAP = [
	"ggGGSSVSSGGgg",
	"GSSSUUNSSSGGG",
	"GHHHCCHHHHSGG",
	"ggGGLVRGGSSGG",
	"SSGGDVTGGggGY",
	"GHHHCCHHHHGGg",
	"GGssLVRSSGGGG",
	"ggGGSVSSGGGgg",
	"YGGGSVSSGSSGG",
	"GGHHNEHHQSSGG",
	"SSGGLVRGGGGGG",
	"GGGGSVSSGGGBG",
	"gSSSHCHHHGGGG",
	"ggGGSSVSSGGgg",
];

const drawTerrain = (): void => {
	const tiles = TERRAIN_MAP.flatMap((row) =>
		[...row].map((tileKey) => {
			const tileName = TERRAIN_TILES[tileKey] ?? TERRAIN_TILES.G;
			return `<span class="terrain-tile terrain-tile--${tileName}"></span>`;
		}),
	);

	$playgroundTerrain.innerHTML = tiles.join("");
};

drawTerrain();

Rail.connect(railRoads[0], railRoads[1]);
Rail.hit(railRoads[0], railRoads[9]); // opposite direction
Rail.connect(railRoads[1], railRoads[2]);
Rail.connect(railRoads[1], railRoads[4]);
Rail.connect(railRoads[2], railRoads[3]);
Rail.connect(railRoads[3], railRoads[0]);
Rail.connect(railRoads[4], railRoads[5]);
Rail.connect(railRoads[4], railRoads[7]);
Rail.connect(railRoads[5], railRoads[6]);
Rail.connect(railRoads[6], railRoads[0]);
Rail.connect(railRoads[7], railRoads[8]);
Rail.connect(railRoads[8], railRoads[9]);

new Switcher(railRoads[1], railRoads[9]);
new Switcher(railRoads[2], railRoads[4]);
new Switcher(railRoads[5], railRoads[7]);
new Switcher(railRoads[3], railRoads[6]);

const locomotive = new Locomotive($(".js-train-1"), 0, 0, {
	mass: 120,
	power: 12,
});

const locomotiveOnRail = new TrainOnRail(locomotive, railRoads[0]);

const railCars: RailCar[] = [
	new RailCar($(".js-car-1"), locomotiveOnRail, 1),
	new RailCar($(".js-car-2"), locomotiveOnRail, 2),
	new RailCar($(".js-car-3"), locomotiveOnRail, 3),
];

let targetSpeed = $trainSpeed.valueAsNumber;

const formatSpeed = (speed: number): string => speed.toFixed(2);

const getSpeedRange = (): { min: number; max: number } => {
	return {
		min: $trainSpeed.min === "" ? -5 : Number($trainSpeed.min),
		max: $trainSpeed.max === "" ? 5 : Number($trainSpeed.max),
	};
};

const speedToPercent = (speed: number): number => {
	const { min, max } = getSpeedRange();
	const clampedSpeed = Math.min(max, Math.max(min, speed));
	return ((clampedSpeed - min) / (max - min)) * 100;
};

const setCurrentSpeedMeter = (speed: number): void => {
	const { min, max } = getSpeedRange();
	const zeroPercent = speedToPercent(0);
	const speedPercent = speedToPercent(speed);
	const fillStart = Math.min(zeroPercent, speedPercent);
	const fillWidth = Math.abs(speedPercent - zeroPercent);

	$currentSpeedValue.value = formatSpeed(speed);
	$currentSpeedMeter.style.setProperty("--speed-fill-left", `${fillStart}%`);
	$currentSpeedMeter.style.setProperty("--speed-fill-width", `${fillWidth}%`);
	$currentSpeedMeter.setAttribute("aria-valuemin", String(min));
	$currentSpeedMeter.setAttribute("aria-valuemax", String(max));
	$currentSpeedMeter.setAttribute("aria-valuenow", formatSpeed(speed));
	$currentSpeedMeter.setAttribute("aria-valuetext", formatSpeed(speed));
};

const setTrainSpeed = (speed: number): void => {
	if (!Number.isFinite(speed)) {
		return;
	}

	const min =
		$trainSpeed.min === "" ? Number.NEGATIVE_INFINITY : Number($trainSpeed.min);
	const max =
		$trainSpeed.max === "" ? Number.POSITIVE_INFINITY : Number($trainSpeed.max);
	const clampedSpeed = Math.min(max, Math.max(min, speed));

	$trainSpeed.valueAsNumber = clampedSpeed;
	targetSpeed = clampedSpeed;
	$targetSpeedValue.value = formatSpeed(clampedSpeed);
};

const moveTowards = (
	current: number,
	target: number,
	maxDelta: number,
): number => {
	if (current < target) {
		return Math.min(target, current + maxDelta);
	}

	return Math.max(target, current - maxDelta);
};

const getConsistMass = (): number => {
	return railCars.reduce(
		(totalMass, railCar) => totalMass + railCar.train.getMass(),
		locomotive.getMass(),
	);
};

const applyConsistPhysics = (deltaTime: number): void => {
	const simulationTime = deltaTime * NOMINAL_FRAME_RATE;
	const currentSpeed = locomotive.getSpeed();
	const speedDelta = targetSpeed - currentSpeed;

	if (Math.abs(speedDelta) < 0.001) {
		locomotive.setSpeed(targetSpeed);
		return;
	}

	const isSpeedingUp =
		Math.abs(targetSpeed) > Math.abs(currentSpeed) &&
		Math.sign(targetSpeed) === Math.sign(currentSpeed || targetSpeed);

	if (!isSpeedingUp) {
		locomotive.setSpeed(
			moveTowards(
				currentSpeed,
				targetSpeed,
				(BRAKE_ACCELERATION + ROLLING_RESISTANCE) * simulationTime,
			),
		);
		return;
	}

	const totalMass = getConsistMass();
	const speedForPower = Math.max(Math.abs(currentSpeed), MIN_SPEED_FOR_POWER);
	const force = Math.min(
		MAX_TRACTIVE_FORCE,
		locomotive.getPower() / speedForPower,
	);
	const acceleration = Math.max(force / totalMass - ROLLING_RESISTANCE, 0.001);

	locomotive.setSpeed(
		moveTowards(currentSpeed, targetSpeed, acceleration * simulationTime),
	);
};

$trainSpeed.addEventListener("input", () => {
	setTrainSpeed($trainSpeed.valueAsNumber);
});

window.addEventListener("keydown", (event) => {
	if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
		return;
	}

	event.preventDefault();
	const step = $trainSpeed.step === "any" ? 1 : Number($trainSpeed.step || 1);
	const speedDelta = event.key === "ArrowUp" ? step : -step;
	setTrainSpeed($trainSpeed.valueAsNumber + speedDelta);
});

if (DEBUG) {
	drawRailHelpers(railRoads[0]);
	drawRailHelpers(railRoads[1]);
	drawRailHelpers(railRoads[2]);
	drawRailHelpers(railRoads[3]);
	// drawRailHelpers(railRoads[4]);
	// drawRailHelpers(railRoads[5]);
	drawRailHelpers(railRoads[6]);
	// drawRailHelpers(railRoads[7]);
	// drawRailHelpers(railRoads[8]);
	drawRailHelpers(railRoads[9]);
}

let previousFrameTime: number | null = null;

const gameLoop = (frameTime: number): void => {
	const deltaTime =
		previousFrameTime === null
			? 0
			: Math.min((frameTime - previousFrameTime) / 1000, MAX_DELTA_TIME);
	previousFrameTime = frameTime;

	applyConsistPhysics(deltaTime);
	setCurrentSpeedMeter(locomotive.getSpeed());
	locomotiveOnRail.gameLoop(deltaTime * NOMINAL_FRAME_RATE);
	for (const car of railCars) {
		car.gameLoop(deltaTime * NOMINAL_FRAME_RATE);
	}

	requestAnimationFrame(gameLoop);
};

setTrainSpeed(targetSpeed);
setCurrentSpeedMeter(locomotive.getSpeed());
requestAnimationFrame(gameLoop);
