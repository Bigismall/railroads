import { type Point } from '../types'

export const distance = (p1: Point, p2: Point): number =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

// TODO - try to use this instead of the above
export const simpleDistance = (p1: Point, p2: Point): number => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
