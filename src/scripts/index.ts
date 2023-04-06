import "./../styles/styles.scss";
import { Train } from "./train";
import { Rail } from "./rail";
import { Switcher } from "./switcher";
import { TrainOnRail } from "./trainOnRail";
import { $ } from "./dom";
import { drawRailHelpers } from "./debug/helpers";
import {RailCar} from "./railCar";

// @ts-ignore
const DEBUG = String(import.meta.env.VITE_DEBUG ?? "").toUpperCase() === "TRUE";
console.log("DEBUG", DEBUG);

const railRoad1 = new Rail("#rail1");
const railRoad2 = new Rail("#rail2", true);
const railRoad4 = new Rail("#rail4");
const railRoad6 = new Rail("#rail6");
const railRoad7 = new Rail("#rail7", true);
const railRoad9 = new Rail("#rail9", true);
const railRoad11 = new Rail("#rail11", true);
const railRoad12 = new Rail("#rail12");
const railRoad13 = new Rail("#rail13");
const railRoad14 = new Rail("#rail14");

const $trainSpeed = $("#train-speed")! as HTMLInputElement;
const $trainDirection = $("#train-direction")! as HTMLButtonElement;
const $switcher214 = $("#switcher214")!;
const $switcher47 = $("#switcher47")!;
const $switcher912 = $("#switcher912")!;
const $switcher611 = $("#switcher611")!;

Rail.connect(railRoad1, railRoad2);
Rail.hit(railRoad1, railRoad14); //opposite direction

Rail.connect(railRoad2, railRoad4);
Rail.connect(railRoad2, railRoad7);

Rail.connect(railRoad4, railRoad6);

Rail.connect(railRoad6, railRoad1);

Rail.connect(railRoad7, railRoad9);
Rail.connect(railRoad7, railRoad12);

Rail.connect(railRoad9, railRoad11);

Rail.connect(railRoad11, railRoad1);

Rail.connect(railRoad12, railRoad13);

Rail.connect(railRoad13, railRoad14);

const switcher214 = new Switcher(railRoad2, railRoad14);
const switcher47 = new Switcher(railRoad4, railRoad7);
const switcher912 = new Switcher(railRoad9, railRoad12);
const switcher611 = new Switcher(railRoad6, railRoad11);

const trainOnRail1 = new TrainOnRail(
  new Train($(".js-train-1") , $trainSpeed.valueAsNumber, 0),
  railRoad1
);

const wagonTrain1  = new RailCar($(".js-car-1"),trainOnRail1)

// const trainOnRail2 = new TrainOnRail(
//   new Train($(".js-train-2") , $trainSpeed.valueAsNumber, RAILROAD_VEHICLE_LENGTH + RAILROAD_VEHICLE_LENGTH),
//   railRoad1
// );

$trainSpeed.addEventListener("change", (e) => {
  trainOnRail1.train.setSpeed((e.target as HTMLInputElement).valueAsNumber);
  // trainOnRail2.train.setSpeed((e.target as HTMLInputElement).valueAsNumber);
});
$trainDirection.addEventListener("click", () => {
  trainOnRail1.train.toggleDirection();
  // trainOnRail2.train.toggleDirection();
});

$switcher214.addEventListener("click", () => {
  switcher214.toggle();
});
$switcher47.addEventListener("click", () => {
  switcher47.toggle();
});
$switcher912.addEventListener("click", () => {
  switcher912.toggle();
});
$switcher611.addEventListener("click", () => {
  switcher611.toggle();
});

/*
 const trainOnRail2 = new TrainOnRail(
 new Train('.js-train-2', 0, 0, 1, 3, 0),
 rail,
 );
 */

if (DEBUG) {
  drawRailHelpers(railRoad1);
  drawRailHelpers(railRoad2);
  drawRailHelpers(railRoad4);
  drawRailHelpers(railRoad6);
  // drawRailHelpers(railRoad7);
  // drawRailHelpers(railRoad9);
  drawRailHelpers(railRoad11);
  //drawRailHelpers(railRoad12);
  // drawRailHelpers(railRoad13);
  drawRailHelpers(railRoad14);
}

function gameLoop() {
  trainOnRail1.gameLoop();
  wagonTrain1.gameLoop();
  // trainOnRail2.gameLoop();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
