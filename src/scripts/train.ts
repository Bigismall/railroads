import {DIR_BACKWARD, DIR_FORWARD} from "./constants";
import {Rail} from "./rail";
import {OnCanvas, OnPath, Point, RailRoadVehicleSpeed} from "./types";
import {angle} from "./utils/angle";


export const RAILROAD_VEHICLE_LENGTH = 20;
export const RAILROAD_VEHICLE_SPACE = 5;

export class Train {
    public $element: HTMLElement;
    private speed: RailRoadVehicleSpeed;
    private onPath: OnPath;
    private onCanvas: OnCanvas;

    constructor(
        selector: HTMLElement | null,
        speed = 1,
        positionOnPath = 0,
    ) {
        if (!selector) {
            throw new Error("No selector provided");
        }

        this.$element = selector;
        this.speed = speed;
        this.onCanvas = {
            position: {x: 0, y: 0},
            angle: 0,
        };
        this.onPath = {
            position: positionOnPath,
            direction: DIR_BACKWARD,
        };
    }

    isMovingForward() {
        return this.onPath.direction === DIR_FORWARD;
    }

    isMovingBackward() {
        return !this.isMovingForward();
    }

    setOnPath(direction: OnPath["direction"], position: OnPath["position"]) {
        this.onPath = {
            direction,
            position,
        };
    }

    getOnPath() {
        return this.onPath;
    }

    setOnCanvas(position: OnCanvas["position"], angle: OnCanvas["angle"]) {
        this.onCanvas = {
            position,
            angle,
        };
    }

    getOnCanvas() {
        return this.onCanvas;
    }

    updatePosition(rail: Rail) {
        const currentPositionOnPath: Point = rail.$element.getPointAtLength(
            this.onPath.position
        );
        const previousPositionOnPath: Point = rail.$element.getPointAtLength(
            this.onPath.position - 1
        );

        this.setOnCanvas(
            currentPositionOnPath,
            angle(previousPositionOnPath, currentPositionOnPath)
        );
        this.setCanvasValues();
        this.move();
    }

    toggleDirection() {
        this.onPath.direction *= DIR_BACKWARD;
    }

    setSpeed(speed: RailRoadVehicleSpeed) {
        this.speed = speed;
    }

    getSpeed() {
        return this.speed;
    }

    private setCanvasValues() {
        this.$element.style.setProperty(
            "--train-translate-x",
            `${this.onCanvas.position.x}px`
        );
        this.$element.style.setProperty(
            "--train-translate-y",
            `${this.onCanvas.position.y}px`
        );
        this.$element.style.setProperty(
            "--train-rotate",
            `${this.onCanvas.angle}deg`
        );
    }

    private move() {
        this.onPath.position += this.onPath.direction * this.speed;
    }
}
