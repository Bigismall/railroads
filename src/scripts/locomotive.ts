import { Train, type TrainOptions } from "./train";

export interface LocomotiveOptions extends TrainOptions {
	power?: number;
}

const DEFAULT_LOCOMOTIVE_MASS = 120;
const DEFAULT_LOCOMOTIVE_POWER = 12;

export class Locomotive extends Train {
	private power: number;

	constructor(
		selector: HTMLElement | null,
		speed = 1,
		positionOnPath = 0,
		options: LocomotiveOptions = {},
	) {
		super(selector, speed, positionOnPath, {
			mass: options.mass ?? DEFAULT_LOCOMOTIVE_MASS,
		});
		this.power = options.power ?? DEFAULT_LOCOMOTIVE_POWER;
	}

	getPower() {
		return this.power;
	}
}
