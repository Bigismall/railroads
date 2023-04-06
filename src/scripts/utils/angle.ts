import { Point, RailRoadVehicleAngle } from "../types";
import { PI_DEG, RAD } from "../constants";

export const angle = (p1: Point, p2: Point): RailRoadVehicleAngle =>
  PI_DEG + RAD * Math.atan2(p2.y - p1.y, p2.x - p1.x);

export const debugAngle = (p1: Point, p2: Point): RailRoadVehicleAngle =>
  RAD * Math.atan2(p2.y - p1.y, p2.x - p1.x);
