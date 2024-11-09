import { $ } from "../dom";
import type { Rail } from "../rail";
import type { Point } from "../types";
import { debugAngle } from "../utils/angle";
import { simpleDistance } from "../utils/distance";

export const drawRailPoints = (rail: Rail): void => {
	// For given rail, use the path points and draw 10 points starting from the first point to end point.
	const $container = $(".playground__container");
	const points: Point[] = rail.path.points;
	const pointsCount = points.length;
	const step = Math.floor(pointsCount / 10);
	const pointsToDraw = points.filter((_, i) => i % step === 0);
	pointsToDraw.forEach((point, index) => {
		const pointElement = document.createElement("div");
		pointElement.classList.add("rail__point");
		pointElement.style.left = `${point.x}px`;
		pointElement.style.top = `${point.y}px`;
		pointElement.innerText = `${index}`;
		$container?.appendChild(pointElement);
	});
};

export const drawRailHelpers = (rail: Rail): void => {
	const $container = $(".playground__container");
	const railHelper = document.createElement("div");
	const label = rail.$element.id;
	railHelper.innerText = label;

	const dist = simpleDistance(rail.start, rail.end);
	const ang = debugAngle(rail.start, rail.end);
	const width = rail.end.x - rail.start.x;
	const height = rail.end.y - rail.start.y;

	console.log({
		label,
		start: { x: rail.start.x, y: rail.start.y },
		end: { x: rail.end.x, y: rail.end.y },
		width,
		height,
		dist,
		ang,
	});
	railHelper.classList.add("rail__helper");
	railHelper.style.left = width > 0 ? `${rail.start.x}px` : `${rail.end.x}px`;
	railHelper.style.top = height > 0 ? `${rail.start.y}px` : `${rail.end.y}px`;
	railHelper.style.width = `${Math.abs(width)}px`;
	railHelper.style.height = `${Math.abs(height)}px`;
	railHelper.style.transform = `rotate(${ang}deg)`;
	railHelper.style.transformOrigin = "center center";
	$container?.appendChild(railHelper);
};
