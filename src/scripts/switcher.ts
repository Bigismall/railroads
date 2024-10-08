import { CSS_CLASS_RAIL_ACTIVE } from "./constants";
import type { Rail } from "./rail";
import type { SwitcherIndex } from "./types";

export class Switcher {
	private readonly rails: Rail[];
	private activeRail: SwitcherIndex = 0;

	constructor(rail1: Rail, rail2: Rail, activeRail: SwitcherIndex = 0) {
		this.rails = [rail1, rail2];
		this.activeRail = activeRail;
		this.toggle(this.activeRail);

		// Toggle rail on click
		for (const rail of this.rails) {
			rail.$element.addEventListener("click", () => {
				this.toggle();
			});
		}
	}

	public toggle(railNumber?: SwitcherIndex) {
		this.activeRail =
			railNumber ?? (((this.activeRail + 1) % 2) as SwitcherIndex);
		this.makeInactive(this.rails[1 - this.activeRail]);
		this.makeActive(this.rails[this.activeRail]);
	}

	private makeActive(rail: Rail) {
		rail.active = true;
		rail.$element.classList.add(CSS_CLASS_RAIL_ACTIVE);
	}

	private makeInactive(rail: Rail) {
		rail.active = false;
		rail.$element.classList.remove(CSS_CLASS_RAIL_ACTIVE);
	}
}
