import { IndexedDbService } from "@kling/indexed-db";

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Searches the DOM for nodes with a specific `data-test` attribute.
			 *
			 * See https://docs.cypress.io/guides/references/best-practices#Selecting-Elements.
			 *
			 * @param selector Value of a `data-test` HTML attribute.
			 *
			 * @example
			 * // In HTML
			 * <button data-test="ok-btn">OK</button>
			 * // In test file
			 * cy.getBySelector("ok-btn").click();
			 */
			getBySelector: (selector: string) => Cypress.Chainable<JQuery<HTMLElement>>;

			useIndexedDbService: (
				cb: (service: IndexedDbService) => void
			) => Cypress.Chainable<any>;
		}
	}
}

export function getBySelector(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
	return cy.get(`[data-test=${selector}]`);
}

export function useIndexedDbService(
	cb: (service: IndexedDbService) => void
): Cypress.Chainable<any> {
	return cy
		.window()
		.its("appIndexedDb")
		.then(idbService => {
			cb(idbService);
		});
}
