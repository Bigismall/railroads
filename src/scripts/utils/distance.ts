import { Point } from "../types";

export const distance = (p1: Point, p2: Point): number =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
