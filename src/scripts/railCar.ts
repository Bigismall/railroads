import { RAILROAD_VEHICLE_LENGTH, RAILROAD_VEHICLE_SPACE, Train } from './train'
import { TrainOnRail } from './trainOnRail'

/*
TODO
* Create Locomotive class
* Train should keep the next and previous rail
* Train should have collection of cars
*/
export class RailCar extends TrainOnRail {
  private root: TrainOnRail

  constructor (selector: HTMLElement | null, vehicle: TrainOnRail, whichOne: number = 1) {
    const train = new Train(selector, vehicle.train.getSpeed(), ((RAILROAD_VEHICLE_LENGTH * 2) + RAILROAD_VEHICLE_SPACE) * whichOne)
    super(train, vehicle.rail)
    this.root = vehicle
  }

  public attachTo (vehicle: TrainOnRail): void {
    this.root = vehicle
  }

  gameLoop (): void {
    this.train.setSpeed(this.root.train.getSpeed())
    // this.train.setOnPath(this.root.train.getOnPath().direction, this.train.getOnPath().position);
    super.gameLoop()
  }
}
