import {RAILROAD_VEHICLE_LENGTH, RailroadVehicle} from "./railroadVehicle";
import {TrainOnRail} from "./trainOnRail";

export class RailCar extends RailroadVehicle {
    private root: TrainOnRail
    constructor(selector:HTMLElement  | null, vehicle: TrainOnRail){
        const { position: onPathPosition} = vehicle.train.getOnPath();
        super(selector,  vehicle.train.getSpeed(), onPathPosition,RAILROAD_VEHICLE_LENGTH);
        this.attachTo(vehicle);
    }

    public attachTo(vehicle: TrainOnRail){
        this.root = vehicle;
    }

    gameLoop() {
        //TODO implement
    }

}