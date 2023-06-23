import {Rail} from "../rail";
import {distance} from "../utils/distance";
import {debugAngle} from "../utils/angle";
import {$} from "../dom";

export const drawRailHelpers = (rail: Rail) => {
    const $container = $(".playground__container");
    const railHelper = document.createElement("div");
    const label = rail.$element.id;
    railHelper.innerText = label;

    const dist = distance(rail.start, rail.end);
    const ang = debugAngle(rail.start, rail.end);
    const width = rail.end.x - rail.start.x;
    const height = rail.end.y - rail.start.y;

    console.log({
        label,
        start: {x: rail.start.x, y: rail.start.y},
        end: {x: rail.end.x, y: rail.end.y},
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
