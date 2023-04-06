import { DIR_BACKWARD, DIR_FORWARD } from "./constants";

export type Point = {
  x: number;
  y: number;
};
export type TrainDirection = typeof DIR_FORWARD | typeof DIR_BACKWARD;
export type TrainSpeed = number;
export type TrainAngle = number;
export type RailLength = number;
export type RailActive = boolean;
export type OnPathPosition = number;

export type OnPath = {
  position: OnPathPosition;
  direction: TrainDirection;
};

export type OnCanvas = {
  position: Point;
  angle: TrainAngle;
};

export type SwitcherIndex = 0 | 1; // 0 = left, 1 = right
