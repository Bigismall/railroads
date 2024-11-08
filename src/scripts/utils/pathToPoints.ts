import type { Path, Point } from "../types";

export const getPathPointsAndLength = (path: SVGPathElement): Path => {
	const totalLength: number = path.getTotalLength();
	const points: Point[] = [];
	const start: Point = path.getPointAtLength(0);
	const end: Point = path.getPointAtLength(totalLength);

	for (let i = 0; i <= totalLength; i++) {
		const point = path.getPointAtLength(i);
		points.push({ x: point.x, y: point.y });
	}

	return { points, totalLength, start, end };
};
