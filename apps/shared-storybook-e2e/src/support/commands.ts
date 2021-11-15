// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject> {
		visitIFrame<StoryName extends string>(component: string, story: StoryName): void;

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
	}
}

function visitIFrame<StoryName extends string>(component: string, story: StoryName): void {
	cy.visit(`/iframe.html?id=${component}--${story}`);
}

function getBySelector(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
	return cy.get(`[data-test=${selector}]`);
}

Cypress.Commands.add(visitIFrame.name, visitIFrame);
Cypress.Commands.add(getBySelector.name, getBySelector);
