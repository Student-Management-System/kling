import "./commands";
import { getBySelector, useIndexedDbService, useStore } from "./commands";

Cypress.Commands.add(getBySelector.name, getBySelector);
Cypress.Commands.add(useIndexedDbService.name, useIndexedDbService);
Cypress.Commands.add(useStore.name, useStore);
