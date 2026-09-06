import { DIR_BACKWARD, DIR_FORWARD } from "./constants";
import type { Rail } from "./rail";
import type { Train } from "./train";

export class TrainOnRail {
	public train: Train;
	public rail: Rail;

	constructor(train: Train, rail: Rail) {
		this.train = train;
		this.rail = rail;
	}

	gameLoop() {
		if (this.train.getSpeed() === 0) {
			this.train.updatePosition(this.rail);
			return;
		}

		if (this.train.isMovingForward()) {
			if (this.passedRail()) {
				const nextRail = this.rail.getNextRail();

				if (nextRail === null) {
					// TODO: stop train, or change its direction
					return;
				}

				const nextDirection = this.rail.getNextDirection(this.train, nextRail);
				const positionOnPath =
					nextDirection === DIR_FORWARD ? 0 : nextRail.length;
				const trainDirection =
					this.train.getSpeed() > 0
						? nextDirection
						: nextDirection === DIR_FORWARD
							? DIR_BACKWARD
							: DIR_FORWARD;

				this.train.setOnPath(trainDirection, positionOnPath);
				this.rail = nextRail;
			}
		} else {
			if (this.backOffRail()) {
				const prevRail = this.rail.getPrevRail();
				if (prevRail === null) {
					// TODO: stop train, or change its direction
					return;
				}

				const prevDirection = this.rail.getNextDirection(this.train, prevRail);
				const positionOnPath =
					prevDirection === DIR_FORWARD ? 0 : prevRail.length;
				const trainDirection =
					this.train.getSpeed() > 0
						? prevDirection
						: prevDirection === DIR_FORWARD
							? DIR_BACKWARD
							: DIR_FORWARD;

				this.train.setOnPath(trainDirection, positionOnPath);
				this.rail = prevRail;
			}
		}

		this.train.updatePosition(this.rail);
	}

	private passedRail() {
		return this.train.getOnPath().position >= this.rail.length;
	}

	private backOffRail() {
		return this.train.getOnPath().position <= 0;
	}
}
