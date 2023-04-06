import {DIR_BACKWARD, DIR_FORWARD} from "./constants";

export type Point = {
    x: number;
    y: number;
};
export type RailRoadVehicle = typeof DIR_FORWARD | typeof DIR_BACKWARD;
export type RailRoadVehicleSpeed = number;
export type RailRoadVehicleAngle = number;
export type RailRoadVehicleLength = number;
export type RailLength = number;
export type RailActive = boolean;
export type OnPathPosition = number;

export type OnPath = {
    position: OnPathPosition;
    direction: RailRoadVehicle;
};

export type OnCanvas = {
    position: Point;
    angle: RailRoadVehicleAngle;
};

export type SwitcherIndex = 0 | 1; // 0 = left, 1 = right
