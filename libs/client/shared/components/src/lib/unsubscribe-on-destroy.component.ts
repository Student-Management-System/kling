/* eslint-disable @angular-eslint/component-class-suffix */
import { OnDestroy, Component } from "@angular/core";
import { SubSink } from "subsink";

/**
 * A class that automatically unsubscribes all observables when
 * the object gets destroyed
 */
@Component({
	template: ""
})
export class UnsubscribeOnDestroy implements OnDestroy {
	/**The subscription sink object that stores all subscriptions */
	subs = new SubSink();

	/**
	 * The lifecycle hook that unsubscribes all subscriptions
	 * when the component / object gets destroyed
	 */
	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
