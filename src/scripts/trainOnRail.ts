import {Rail} from "./rail";
import {DIR_FORWARD} from "./constants";
import {Train} from "./train";

export class TrainOnRail {
    public train: Train;
    public rail: Rail;

    constructor(train: Train, rail: Rail) {
        this.train = train;
        this.rail = rail;
    }

    gameLoop() {
        if (this.train.isMovingForward()) {
            if (this.passedRail()) {
                const nextRail = this.rail.getNextRail();

                if (!nextRail) {
                    // TODO: stop train, or change its direction
                    return;
                }

                const nextDirection = this.rail.getNextDirection(this.train, nextRail);
                const positionOnPath =
                    nextDirection === DIR_FORWARD ? 0 : nextRail.length;

                this.train.setOnPath(nextDirection, positionOnPath);
                this.rail = nextRail;
            }
        } else {
            if (this.backOffRail()) {
                const prevRail = this.rail.getPrevRail();
                if (!prevRail) {
                    // TODO: stop train, or change its direction
                    return;
                }

                const prevDirection = this.rail.getNextDirection(this.train, prevRail);
                const positionOnPath =
                    prevDirection === DIR_FORWARD ? 0 : prevRail.length;

                this.train.setOnPath(prevDirection, positionOnPath);
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
