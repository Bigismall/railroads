import "./../styles/styles.scss";
import { drawRailHelpers } from "./debug/helpers";
import { $ } from "./dom";
import { Locomotive } from "./locomotive";
import { Rail } from "./rail";
import { RailCar } from "./railCar";
import { Switcher } from "./switcher";
import { TrainOnRail } from "./trainOnRail";

const DEBUG = String(import.meta.env.VITE_DEBUG ?? "").toUpperCase() === "TRUE";
console.log("DEBUG", DEBUG);

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
const $trainDirection: HTMLButtonElement | null = $("#train-direction") ?? null;

if (!$trainSpeed || !$trainDirection) {
	throw new Error("Missing train-speed or train-direction element");
}

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

const locomotiveOnRail = new TrainOnRail(
	new Locomotive($(".js-train-1"), $trainSpeed.valueAsNumber, 0),
	railRoads[0],
);

const railCars: RailCar[] = [
	new RailCar($(".js-car-1"), locomotiveOnRail, 1),
	new RailCar($(".js-car-2"), locomotiveOnRail, 2),
	new RailCar($(".js-car-3"), locomotiveOnRail, 3),
];

$trainSpeed.addEventListener("change", (e) => {
	locomotiveOnRail.train.setSpeed((e.target as HTMLInputElement).valueAsNumber);
	// trainOnRail2.train.setSpeed((e.target as HTMLInputElement).valueAsNumber);
});

$trainDirection.addEventListener("click", () => {
	locomotiveOnRail.train.toggleDirection();
	for (const car of railCars) {
		car.train.toggleDirection();
	}
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

const gameLoop = (): void => {
	locomotiveOnRail.gameLoop();
	for (const car of railCars) {
		car.gameLoop();
	}

	requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
