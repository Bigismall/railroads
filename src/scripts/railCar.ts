import {RAILROAD_VEHICLE_LENGTH, RAILROAD_VEHICLE_SPACE} from "./railroadVehicle";
import {TrainOnRail} from "./trainOnRail";
import {Train} from "./train";


/*
TODO
* Create Locomotive class
* Remove RailroadVehicle class
* Train should keep the next and previous rail
* Train should have collection of cars
*/
export class RailCar extends TrainOnRail {
    private root: TrainOnRail
    constructor(selector:HTMLElement  | null, vehicle: TrainOnRail, whichOne: number=1) {
        const train = new Train(selector , vehicle.train.getSpeed(), ((RAILROAD_VEHICLE_LENGTH*2)+RAILROAD_VEHICLE_SPACE)*whichOne);
        super(train, vehicle.rail);
        this.attachTo(vehicle);
    }

    public attachTo(vehicle: TrainOnRail){
        this.root = vehicle;
    }

    gameLoop() {
        this.train.setSpeed(this.root.train.getSpeed());
        // this.train.setOnPath(this.root.train.getOnPath().direction, this.train.getOnPath().position);
        super.gameLoop();
    }


}