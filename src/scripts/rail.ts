import {$} from "./dom";
import {CSS_CLASS_RAIL_ACTIVE, DIR_BACKWARD, DIR_FORWARD} from "./constants";
import {Point, RailActive, RailLength, RailRoadVehicle} from "./types";
import {distance} from "./utils/distance";
import {Train} from "./train";

export class Rail {
    public $element: SVGGeometryElement;
    public active: RailActive;
    public length: RailLength;
    public start: Point;
    public end: Point;
    private readonly _next: Rail[] = [];
    private readonly _prev: Rail[] = [];

    constructor(selector = "", isActive = false) {
        this.$element = $(selector)!;
        this.active = isActive;
        this.length = this.$element ? this.$element.getTotalLength() : 0;

        const pathStart = this.$element.getPointAtLength(0);
        const pathEnd = this.$element.getPointAtLength(this.length);

        this.start = {x: pathStart.x, y: pathStart.y};
        this.end = {x: pathEnd.x, y: pathEnd.y};

        this._next = [];
        this._prev = [];

        if (this.active) {
            this.$element.classList.add(CSS_CLASS_RAIL_ACTIVE);
        }
    }

    get nextActive() {
        return this._next.find((r) => r.active);
    }

    get prevActive() {
        return this._prev.find((r) => r.active);
    }

    /**
     * Connect 2 rails in the same direction
     */
    static connect(rail1: Rail, rail2: Rail) {
        rail1.addNext(rail2);
        rail2.addPrev(rail1);
    }

    /**
     * Connect 2 rails with the opposite direction (ex beginning and the end of the circle path)
     */
    static hit(rail1: Rail, rail2: Rail) {
        rail1.addNext(rail2);
        rail2.addNext(rail1);
    }

    getPrevRail() {
        return this._prev.length === 1 ? this._prev[0] : this.prevActive || null;
    }

    getNextRail() {
        return this._next.length === 1 ? this._next[0] : this.nextActive || null;
    }

    getNextDirection(train: Train, nextRail: Rail): RailRoadVehicle {
        const distanceStart = distance(
            train.getOnCanvas().position,
            nextRail.start
        );
        const distanceEnd = distance(train.getOnCanvas().position, nextRail.end);
        //compare train x/y with nextRail start/end
        // if Start is closer, then return 1, else return -1
        return distanceStart < distanceEnd ? DIR_FORWARD : DIR_BACKWARD;
    }

    private addNext(rail: Rail) {
        this._next.push(rail);
    }

    private addPrev(rail: Rail) {
        this._prev.push(rail);
    }
}
